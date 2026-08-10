<?php

require __DIR__ . '/vendor/autoload.php';

use Clue\React\Redis\RedisClient;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

use React\EventLoop\Loop;
use React\Socket\SocketServer;

// connection data
class Gamer {
  private ConnectionInterface $conn;
  public function __construct(ConnectionInterface $conn)
  {
    $this->conn = $conn;
  }
  public function setConn(ConnectionInterface $conn): void {
    $this->conn = $conn;
  }
  public function getConn(): ConnectionInterface {
    return $this->conn;
  }
}

const URI = 'mongodb://127.0.0.1:27017';
const URI_OPTIONS = ['ServerSelectionTimeoutMS' => 10000];

class GameServer implements MessageComponentInterface {
  private RedisClient $redisPub;
  private MongoDB\Database $mongoDB;
  private MongoDB\Collection $users;

  public function __construct($redisSub, $redisPub) {
    // $mongoGamer = new MongoDB\Gamer(URI, URI_OPTIONS);
    // try {
    //   $this->mongoDB = $mongoGamer->getDatabase("game_data");
    //   $this->users = $this->mongoDB->selectCollection("gamers");
    // } catch (MongoDB\Driver\Exception\RuntimeException $e) {
    //   printf("Failed to ping the MongoDB server: %s\n", $e->getMessage());
    // }

    $this->redisPub = $redisPub;
    $redisSub->subscribe('game_events');

    $redisSub->on('message', function ($channel, $message) {
      $msg = var_export(json_decode($message, true), true);
    });

    echo "Server started\n";
}

  public function onOpen(ConnectionInterface $conn): void
  {
    $gamer = new Gamer($conn);

    echo "connection opened";
  }

  public function onMessage(ConnectionInterface $from, $msg): void {
    echo var_dump($msg);
  }

  public function onClose(ConnectionInterface $conn): void {
    echo "connection closed";
  }

  public function onError(ConnectionInterface $conn, \Exception $e): void {
    echo "Error: {$e->getMessage()}\n";
    $conn->close();
  }
}

Loop::get()->futureTick(function () {

  $redisSub = new RedisClient('localhost:6379');
  $redisPub = new RedisClient('localhost:6379');

  $gameServer = new GameServer($redisSub, $redisPub);

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

Loop::run();