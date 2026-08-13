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

const REDIS_PORT = 6379;
const MONGODB_PORT = 27017;
const LOCALHOST = "127.0.0.1";

// connection data
class Client
{
  private ConnectionInterface $conn;

  public function __construct(ConnectionInterface $conn)
  {
    $this->conn = $conn;
  }

  public function setConn(ConnectionInterface $conn): void
  {
    $this->conn = $conn;
  }

  public function getConn(): ConnectionInterface
  {
    return $this->conn;
  }
}

const URI = 'mongodb://' . LOCALHOST . ":" . MONGODB_PORT;
const URI_OPTIONS = ['ServerSelectionTimeoutMS' => 10000];

class GameServer implements MessageComponentInterface
{
  private $redisSub;
  private $redisPub;
  private $radisData;
  private MongoDB\Database $mongoDB;
  private MongoDB\Collection $users;

  private array $gamers;

  public function __construct($redisSub, $redisPub, $redisData)
  {
    $this->redisSub = $redisSub;
    $this->redisPub = $redisPub;
    $this->redisData = $redisData;

    try {
      $mongoClient = new MongoDB\Client(URI, URI_OPTIONS);

      $this->mongoDB = $mongoClient->selectDatabase("game_data");
      $this->users = $this->mongoDB->selectCollection("gamers");
    } catch (MongoDB\Driver\Exception\RuntimeException $e) {
      printf("Failed to connect to MongoDB: %s\n", $e->getMessage());
    }

    // Redis events processing
    $this->redisSub->subscribe('game_events');
    $this->redisSub->on('message', function ($channel, $message) {
      $msg = var_export(json_decode($message, true), true);
    });

    echo "Server started\n";
  }

  // WSS connection is opened
  public function onOpen(ConnectionInterface $conn): void
  {
    $gamer = new Client($conn);
    // Example: store connection to redis
    $this->redisData->set('conn:' . $conn . ':status', 'new');

    // Note: to get this value use
    // $this->redisData->get('conn:' . $conn . ':status')->then(
    //   function($status) {
    //     echo $status;
    //   }
  }

  // New WSS message received
  public function onMessage(ConnectionInterface $from, $msg): void
  {
    // ToDo
  }

  // WSS connection was closed
  public function onClose(ConnectionInterface $conn): void
  {
    // ToDo
  }

  // WSS error
  public function onError(ConnectionInterface $conn, \Exception $e): void
  {
    echo "Error: {$e->getMessage()}\n";
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

        echo "WebSocket server running on port 8080\n";

      });
    });
  });
});

Loop::run();