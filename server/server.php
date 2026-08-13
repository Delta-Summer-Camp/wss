<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Loop;
use React\Socket\SocketServer;

const MONGODB_PORT = 27017;
const LOCALHOST = "127.0.0.1";
const URI = 'mongodb://' . LOCALHOST . ":" . MONGODB_PORT;

class Client {
    private ConnectionInterface $conn;
    public ?string $username = null;
    public bool $isTrusted = false;
    public float $x = 49.5;
    public float $y = 48.5;
    public int $messageCount = 0;

    public function __construct(ConnectionInterface $conn) {
        $this->conn = $conn;
    }

    public function getConn(): ConnectionInterface {
        return $this->conn;
    }
}

class GameServer implements MessageComponentInterface {
    private MongoDB\Collection $users;
    private array $gamers = [];

    public function __construct() {
        $mongoClient = new MongoDB\Client(URI);
        $this->users = $mongoClient->selectDatabase("game_data")->selectCollection("users");
        echo "Сервер запущен\n";
    }

    public function onOpen(ConnectionInterface $conn): void {
        $this->gamers[$conn->resourceId] = new Client($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg): void {
        $data = json_decode($msg, true);
        $player = $this->gamers[$from->resourceId] ?? null;

        if (!$player) return;

        if (isset($data['type']) && $data['type'] === 'auth') {
            $username = $data['username'] ?? '';
            $passwordHash = $data['passwordHash'] ?? '';

            $userDoc = $this->users->findOne(['username' => $username]);

            if ($userDoc && isset($userDoc['passwordHash']) && $userDoc['passwordHash'] === $passwordHash) {
                $player->username = $username;
                $player->x = (float)($userDoc['x'] ?? 49.5);
                $player->y = (float)($userDoc['y'] ?? 48.5);
                $player->isTrusted = true;

            } else {
                $player->getConn()->close();
            }
            return;
        }

        if (!$player->isTrusted) return;

        if (isset($data['x'], $data['y'])) {
            $player->x = (float)$data['x'];
            $player->y = (float)$data['y'];
            $player->messageCount++;

            if ($player->messageCount % 100 === 0) {
                $this->users->updateOne(
                    ['username' => $player->username],
                    ['$set' => ['x' => $player->x, 'y' => $player->y]]
                );
                $player->messageCount = 0;
            }
        }

        $gameState = [];
        foreach ($this->gamers as $c) {
            if ($c->isTrusted) {
                $gameState[] = [
                    'playerId' => $c->getConn()->resourceId,
                    'username' => $c->username,
                    'x' => $c->x,
                    'y' => $c->y
                ];
            }
        }

        $datas = json_encode($gameState);
        foreach ($this->gamers as $c) {
            if ($c->isTrusted) {
                $c->getConn()->send($datas);
            }
        }
    }

    public function onClose(ConnectionInterface $conn): void {
        $player = $this->gamers[$conn->resourceId];

        if ($player && $player->isTrusted && $player->username) {
            $this->users->updateOne(
                ['username' => $player->username],
                ['$set' => ['x' => $player->x, 'y' => $player->y]]
            );
        }

        unset($this->gamers[$conn->resourceId]);
        echo "Соединение закрыто.\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e): void {
        $conn->close();
    }
}

$gameServer = new GameServer();
$socket = new SocketServer('0.0.0.0:8080');

new IoServer(
    new HttpServer(new WsServer($gameServer)),
    $socket,
    Loop::get()
);

echo "WebSocket сервер запущен на порту 8080\n";
Loop::run();
