<!DOCTYPE html>
<?php

require __DIR__ . '/vendor/autoload.php';

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$event = [
  #ToDo
];
$channel = 'internal';
$redis->publish($channel, json_encode($event));

$uri = 'mongodb://127.0.0.1:27017';
$uriOptions = ['ServerSelectionTimeoutMS' => 10000];

try {
    $mongoClient = new MongoDB\Client($uri, $uriOptions);

    $mongoDB = $mongoClient->selectDatabase("game_data");

    // Select/create users collection
    $users = $mongoDB->selectCollection("users");

    // Create a test user
    $newUser = [
            'username' => 'Ian',
            'email' => 'ianiliev111@gmail.com',
            'score' => 0,
            'created_at' => new MongoDB\BSON\UTCDateTime()
    ];

    // Insert user
    $result = $users->insertOne($newUser);

    echo "MongoDB connection works!<br>";
    echo "User added with ID: " . $result->getInsertedId() . "<br>";

    // Get the user we just created
    $user = $users->findOne([
            '_id' => $result->getInsertedId()
    ]);

    echo "<pre>";
    print_r($user);
    echo "</pre>";

} catch (Exception $e) {
    echo "MongoDB error: " . $e->getMessage();
}

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