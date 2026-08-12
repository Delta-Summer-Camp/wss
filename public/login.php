<?php

 require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

  use MongoDB\Client;

  $mongoClient = new Client('mongodb://127.0.0.1:27017');

 $database = $mongoClient->selectDatabase('game_data');
 $users = $database->selectCollection('users');

$username = trim($_POST['username'] ?? '');
$password = $_POST['passwordHash'] ?? '';

// Проверяем заполнение
if ($username === '' || $password === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Username и password обязательны'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$user = $users->findOne([
    'username' => $username
]);

if ($user === null) {
    echo json_encode([
        'success' => false,
        'message' => 'Неправильный пароль или юзернейм'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$passwordHash = md5($password);


if ($passwordHash !== $user['passwordHash']) {
    echo json_encode([
        'success' => false,
        'message' => 'Неправильный пароль или юзернейм'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

echo json_encode([
  'success' => true,
  'message' => 'Авторизация успешна',
  'user' => $user
//    'username' => $user['username']
], JSON_UNESCAPED_UNICODE);
