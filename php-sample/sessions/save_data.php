<?php

declare(strict_types=1);

require __DIR__ . '/session_bootstrap.php';

header('Content-Type: application/json; charset=UTF-8');

$contact = null;

if (!empty($_POST)) {
    if (isset($_POST['contact']) && is_array($_POST['contact'])) {
        $contact = $_POST['contact'];
    } else {
        $contact = [
            'email' => $_POST['email'] ?? '',
            'name' => $_POST['name'] ?? '',
            'tel' => $_POST['tel'] ?? '',
        ];
    }
} else {
    $rawBody = file_get_contents('php://input');
    if ($rawBody !== false && $rawBody !== '') {
        $decoded = json_decode($rawBody, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode([
                'error' => 'JSON が不正です',
                'message' => json_last_error_msg(),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }

        if (is_array($decoded['contact'] ?? null)) {
            $contact = $decoded['contact'];
        }
    }
}

if (!is_array($contact)) {
    http_response_code(422);
    echo json_encode([
        'error' => 'contact フィールドがありません',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$_SESSION['contact'] = [
    'email' => (string) ($contact['email'] ?? ''),
    'name' => (string) ($contact['name'] ?? ''),
    'tel' => (string) ($contact['tel'] ?? ''),
];
$_SESSION['updated_at'] = time();

echo json_encode(session_response_payload(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
