<?php

require __DIR__ . '/../vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

use MongoDB\Client;

// Подключение к MongoDB
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

// Получаем данные
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

// Проверяем, существует ли username
$existingUser = $users->findOne([
    'username' => $username
]);

if ($existingUser !== null) {
    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Такой username уже существует'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Хешируем пароль
$passwordHash = md5($password);

// Создаём пользователя
$result = $users->insertOne([
    'username' => $username,
    'password' => $passwordHash,
    'created_at' => new MongoDB\BSON\UTCDateTime()
]);

echo json_encode([
    'success' => true,
    'message' => 'Регистрация успешна',
    'user_id' => (string) $result->getInsertedId()
], JSON_UNESCAPED_UNICODE);