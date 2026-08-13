<!DOCTYPE html>
<?php
//
//require __DIR__ . '/vendor/autoload.php';
//
//$redis = new Redis();
//$redis->connect('127.0.0.1', 6379);
//
//$event = [
//        'type'      => 'global_chat_message',
//        'timestamp' => time(),
//        'data'      => [
//                'player_id' => 101,
//                'username'  => 'Alex',
//                'message'   => 'Всем привет! Кто пойдет на босса?',
//                'channel'   => 'global'
//        ]
//];
//
//$redis->publish('game_events', json_encode($event));
//
//
//$uri = 'mongodb://127.0.0.1:27017';
//$uriOptions = ['ServerSelectionTimeoutMS' => 10000];
//
//try {
//    $mongoClient = new MongoDB\Client($uri, $uriOptions);
//
//    $mongoDB = $mongoClient->selectDatabase("game_data");
//
//    // Select/create users collection
//    $users = $mongoDB->selectCollection("users");
//
//    // Create a test user
//    $newUser = [
//            'username' => 'Ian',
//            'email' => 'ianiliev111@gmail.com',
//            'score' => 0,
//            'created_at' => new MongoDB\BSON\UTCDateTime()
//    ];
//
//    // Insert user
//    $result = $users->insertOne($newUser);
//
//    echo "MongoDB connection works!<br>";
//    echo "User added with ID: " . $result->getInsertedId() . "<br>";
//
//    // Get the user we just created
//    $user = $users->findOne([
//            '_id' => $result->getInsertedId()
//    ]);
//
//    echo "<pre>";
//    print_r($user);
//    echo "</pre>";
//
//} catch (Exception $e) {
//    echo "MongoDB error: " . $e->getMessage();
//}
//
//?>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>WSS front end test</title>
    <link rel="stylesheet" href="./css/main.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="./js/lib/md5.js"></script>
</head>

<body>

<!-- Registration -->
<div id="registration" class="modal-overlay hidden">
    <div class="modal-card text-left">
        <h1 class="modal-title">Registration</h1>
        <form id="registration-form" method="post" class="form-layout">

            <div class="form-group">
                <label for="reg-username" class="form-label">Username:</label>
                <input class="form-input" type="text" id="reg-username" name="username">
            </div>

            <div class="form-group">
                <label for="reg-password" class="form-label">Password:</label>
                <input class="form-input" type="password" id="reg-password" name="password">
            </div>

            <div class="form-group">
                <label for="password2" class="form-label">Retype password:</label>
                <input class="form-input" type="password" id="password2" name="password2">
            </div>

            <input onclick="addUser()" class="btn btn-submit" type="button" value="Send">
        </form>
    </div>
</div>
<!-- Login -->

<div id="login" class="modal-overlay">
    <div class="modal-card text-center">
        <h1 class="modal-title">Login</h1>
        <form id="login-form" method="post" class="form-layout">
            <div class="form-group">
                <label for="login-username" class="form-label">Username:</label>
                <input class="form-input" type="text" id="login-username" name="username">
            </div>

            <div class="form-group">
                <label for="login-password" class="form-label">Password:</label>
                <input class="form-input" type="password" id="login-password" name="password">
            </div>

            <input onclick="validateLogin()" class="btn btn-submit" type="button" value="Send">

        </form>
        <p class="footer-text">
            Don't have an account? <a href="#" onclick="register()" class="link">Register here</a>
        </p>
    </div>
</div>

<div id="start-screen" class="modal-overlay hidden">
    <div class="modal-card modal-card-dark text-center">
        <h1 class="game-title">MAZE GAME</h1>
        <p class="game-instructions">
            Use <span class="highlight-text">WASD</span> keys to navigate the maze.
        </p>
        <a href="game.php">
            <button onclick="startGame()" class="btn btn-submit">PLAY</button>
        </a>

    </div>
</div>

<script src="js/logincode.js"></script>

</body>

</html>