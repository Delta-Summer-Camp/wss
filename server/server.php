<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Loop;
use React\Socket\SocketServer;
use Clue\React\Redis\Factory as RedisFactory;
use Clue\React\Redis\Client as RedisClient;

const REDIS_PORT = 6379;
const MONGODB_PORT = 27017;
const LOCALHOST = "127.0.0.1";
const URI = 'mongodb://' . LOCALHOST . ":" . MONGODB_PORT;

class Client
{
    private ConnectionInterface $conn;
    public ?string $username = null;
    public string $playerStatus = "runner";
    public bool $isTrusted = false;
    public float $x = 49.5;
    public float $y = 48.5;
    public int $messageCount = 0;

    public function __construct(ConnectionInterface $conn)
    {
        $this->conn = $conn;
    }

    public function getConn(): ConnectionInterface
    {
        return $this->conn;
    }
}

class GameServer implements MessageComponentInterface
{
    private MongoDB\Collection $users;
    private array $players = [];
    private RedisClient $redisSub;
    private RedisClient $redisPub;
    private RedisClient $redisData;

    public function __construct(RedisClient $redisSub, RedisClient $redisPub, RedisClient $redisData)
    {
        $mongoClient = new MongoDB\Client(URI);
        $this->users = $mongoClient->selectDatabase("game_data")->selectCollection("users");
        echo "Сервер запущен\n";
        $this->redisSub = $redisSub;
        $this->redisPub = $redisPub;
        $this->redisData = $redisData;
        $this->redisSub->subscribe('game_events');
        $this->redisSub->on('message', function (string $channel, string $load) {
            if ($channel == 'game_events') {
                foreach ($this->players as $player) {
                    if ($player->isTrusted) {
                        $player->getConn()->send($load);
                    }
                }
            }
        });
        echo "Heelo Redis";
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->players[$conn->resourceId] = new Client($conn);
        echo "new gamer";
        //$this->redisData->set('username' . $this->gamers[$conn->resourceId]->username . ':conn', $conn);
        //$this->redisData->set('username' . "player444" . ':conn', $conn);
    }

    public function onMessage(ConnectionInterface $from, $msg): void
    {
        $data = json_decode($msg, true);
        $player = $this->players[$from->resourceId] ?? null;

        if (!$player) return;

        if (isset($data['type']) && $data['type'] === 'auth') {
            $username = $data['username'] ?? '';
            $passwordHash = $data['passwordHash'] ?? '';

            $userDoc = $this->users->findOne(['username' => $username]);

            if ($userDoc && isset($userDoc['passwordHash']) && $userDoc['passwordHash'] === $passwordHash) {
                $player->username = $username;
                $player->x = (float)($userDoc['x'] ?? 49.5);
                $player->y = (float)($userDoc['y'] ?? 48.5);

		if(!isset($userDoc['status'])) {
			$totalGam = $this->users->countDocuments();
			if($totalGam > 0 && $totalGam % 4 === 0) {
				$player->playerStatus = "hunter";
			}else{
				$player->playerStatus = "runner";
			}

			$this->users->updateOne(
			['username' => $username],
			['$set' => ['status' => $player->playerStatus]]
			);
			}else{
				$player->playerStatus = $userDoc['status'];


}
                $player->isTrusted = true;
                $this->publishState($player);

            } else {
                $player->getConn()->close();
            }
            return;
        }
        //if (isset($data['type']) && $data['type'] === 'session_drop'){        }

        if (!$player->isTrusted) return;

        if (isset($data['x'], $data['y'])) {
            $player->x = (float)$data['x'];
            $player->y = (float)$data['y'];
            $player->messageCount++;
            if ($player->playerStatus === "hunter") {
		$triggDist = 1.0;
		foreach ($this->players as $otherPlayer) {
		if ($otherPlayer->isTrusted && $otherPlayer->playerStatus === "runner") {
			$dx = abs($player->x - $otherPlayer->x);
            		$dy = abs($player->y - $otherPlayer->y);
			if ($dx <= $triggDist && $dy <= $triggDist) {
				$player->playerStatus = "runner";
				$otherPlayer->playerStatus = "hunter";
				echo  "ismemntnie";
				$this->publishState($otherPlayer);
				$this->users->updateOne(
                    			['username' => $player->username],
                    			['$set' => ['status' => $player->playerStatus]]
                		);
                		$this->users->updateOne(
                    			['username' => $otherPlayer->username],
                    			['$set' => ['status' => $otherPlayer->playerStatus]]
               			 );
				break;
			}
		}
	}



        }
            if ($player->messageCount % 100 === 0) {
                $this->users->updateOne(
                    ['username' => $player->username],
                    ['$set' => ['x' => $player->x, 'y' => $player->y,
                        'status'=> $player->playerStatus]]
                );
                $player->messageCount = 0;
            }
            $this->publishState($player);
        }
    }

    private function publishState($player): void
    {
        if ($player->isTrusted) {
	    $plList = array_values($this->players);
            $this->redisPub->publish("game_events", json_encode($plList));
            $this->redisData->set($player->username, json_encode($player));
        }
    }


    public function onClose(ConnectionInterface $conn): void
    {
        $player = $this->players[$conn->resourceId];

        if ($player && $player->isTrusted && $player->username) {
            $this->users->updateOne(
                ['username' => $player->username],
                ['$set' => ['x' => $player->x, 'y' => $player->y]]
            );
        }
        $player->playerStatus="disconnected";
        $this->publishState($player);
        unset($this->players[$conn->resourceId]);
        echo "Соединение закрыто.\n";
        $this->publishState($player);

    }

    public function onError(ConnectionInterface $conn, \Exception $e): void
    {
        $conn->close();
    }
}

Loop::get()->futureTick(function () {

    $factory = new RedisFactory(Loop::get());

    $factory->createClient('redis://' . LOCALHOST . ":" . REDIS_PORT)->
    then(function ($redisSub) use ($factory) {
        $factory->createClient('redis://' . LOCALHOST . ":" . REDIS_PORT)->
        then(function ($redisPub) use ($factory, $redisSub) {
            $factory->createClient('redis://' . LOCALHOST . ":" . REDIS_PORT)->
            then(function ($redisData) use ($redisPub, $redisSub) {

                $gameServer = new GameServer($redisSub, $redisPub, $redisData);

                $socket = new SocketServer('0.0.0.0:8080');

                new IoServer(
                    new HttpServer(
                        new WsServer($gameServer)
                    ),
                    $socket,
                    Loop::get()
                );
            });
        });
    });
});


echo "WebSocket сервер запущен на порту 8080\n";
Loop::run();
