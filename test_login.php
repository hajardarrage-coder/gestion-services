<?php
$url = 'http://localhost/Gestion-services/backend/public/api/login';
$data = [
    'email' => 'admin@gmail.com',
    'password' => 'admin123',
];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "RESPONSE: " . $result . "\n";
