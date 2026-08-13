<?php

 require __DIR__ . '/vendor/autoload.php';

  header('Content-Type: application/json; charset=utf-8');

  use MongoDB\Client;

  $mongoClient = new Client('mongodb://127.0.0.1:27017');

 $database = $mongoClient->selectDatabase('game_data');
 $users = $database->selectCollection('users');

$username = trim($_POST['username'] ?? '');
$passwordHash = $_POST['passwordHash'] ?? '';

// Проверяем заполнение
if ($username === '' || $passwordHash === '') {
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

if ($passwordHash !== $user['passwordHash']) {
    echo json_encode([
        'success' => false,
        'message' => 'Неправильный пароль или юзернейм'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

session_start();
session_destroy();
session_start();
$_SESSION['signed_in'] = true;
$_SESSION['username'] = $username;

echo json_encode([
  'success' => true,
  'message' => 'Авторизация успешна',
  'username' => $user['username']
], JSON_UNESCAPED_UNICODE);
