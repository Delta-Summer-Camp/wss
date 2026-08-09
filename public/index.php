<!DOCTYPE html>
<?php

require __DIR__ . '/../vendor/autoload.php';

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$event = [
        'type'      => 'global_chat_message',
        'timestamp' => time(),
        'data'      => [
                'player_id' => 101,
                'username'  => 'Alex',
                'message'   => 'Всем привет! Кто пойдет на босса?',
                'channel'   => 'global'
        ]
];

$redis->publish('game_events', json_encode($event));


$uri = 'mongodb://127.0.0.1:27017';

$uriOptions = [
        'ServerSelectionTimeoutMS' => 10000
];

$mongoClient = new MongoDB\Client($uri, $uriOptions);

$mongoDB = $mongoClient->getDatabase("game_data");

#$chat = $mongoDB->selectCollection("chat_messages");

#$messages = $chat->find(
#[],
#        [
#                'sort' => ['_id' => -1],
#                'limit' => 20
#        ]
#);

#?>

#<html lang="en">

#<head>

#    <title>Global Chat</title>

#    <meta name="viewport" content="width=device-width, initial-scale=1.0">

#    <script src="https://code.jquery.com/jquery-3.7.1.js"
#            integrity="sha256-eKhayi8LEQwp4NKx+CfCh+3qOVUtJn3QNZ0TciWLP4="
#            crossorigin="anonymous">
#    </script>

#    <script src="js/main.js"></script>

#    <link href="css/main.css" rel="stylesheet">

#</head>

#<body>

#<h1>Global Chat</h1>

#<div id="chat">

#    <?php foreach ($messages as $message): ?>

#        <div class="message">

#            <b>
#                <?= htmlspecialchars($message['username']) ?>
#            </b>:

 #           <?= htmlspecialchars($message['message']) ?>

  #      </div>

   # <?php endforeach; ?>

#</div>

#</body>

#</html>