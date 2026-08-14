<?php

require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

use MongoDB\Client;

$mongoClient = new Client('mongodb://127.0.0.1:27017');

$database = $mongoClient->selectDatabase('game_data');
$users = $database->selectCollection('users');

// Получаем данные
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

// Проверяем, существует ли username
$user = $users->findOne([
    'username' => $username
]);

if ($user !== null) {
    echo json_encode([
        'success' => false,
        'message' => 'Такой username уже существует'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Создаём пользователя
$result = $users->insertOne([
    'username' => $username,
    'passwordHash' => $passwordHash,
    'created_at' => new MongoDB\BSON\UTCDateTime()
]);

echo json_encode([
    'success' => true,
    'message' => 'Регистрация успешна',
    'user_id' => (string) $result->getInsertedId()
], JSON_UNESCAPED_UNICODE);