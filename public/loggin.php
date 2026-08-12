<?php

require __DIR__ . '/../vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

use MongoDB\Client;


$mongoClient = new Client('mongodb://127.0.0.1:27017');

$database = $mongoClient->selectDatabase('game_data');
$users = $database->selectCollection('users');

// Принимаем только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Метод не разрешён'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// Проверяем заполнение
if ($username === '' || $password === '') {
    http_response_code(400);

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
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Неправильный пароль или юзернейм'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


$passwordHash = md5($password);


if ($passwordHash !== $user['passwordHash']) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Неправильный пароль или юзернейм'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

    http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Авторизация успешна',
    'username' => $user['username']
], JSON_UNESCAPED_UNICODE);