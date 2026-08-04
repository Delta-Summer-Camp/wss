<!DOCTYPE html>
<?php

require __DIR__ . '/../vendor/autoload.php';

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$event = [
  #ToDo
];
$channel = 'internal';
$redis->publish($channel, json_encode($event));

$uri = 'mongodb://127.0.0.1:27017';
$uriOptions = ['ServerSelectionTimeoutMS' => 10000];
$mongoClient = new MongoDB\Client($uri, $uriOptions);
$mongoDB = $mongoClient->getDatabase("game_data");
$chat = $mongoDB->selectCollection("/*ToDo*/");
// ToDo
// $messages = $chat->find([], ['sort' => ['_id' => -1]]);
?>
<html lang="en">
<head>
  <title><!-- ToDo --></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://code.jquery.com/jquery-3.7.1.js"
          integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
  <script src="js/main.js"></script>
  <link href="css/main.css" rel="stylesheet">
</head>
<body>

</body>
</html>