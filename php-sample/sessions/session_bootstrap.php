<?php

declare(strict_types=1);

const SESSION_MAX_LIFETIME = 1800;

session_set_cookie_params([
    'lifetime' => SESSION_MAX_LIFETIME,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Lax',
]);

ini_set('session.gc_maxlifetime', (string) SESSION_MAX_LIFETIME);

session_start();

// Reset the session if it exceeded the max lifetime while still present.
if (isset($_SESSION['created_at']) && time() - (int) $_SESSION['created_at'] >= SESSION_MAX_LIFETIME) {
    $_SESSION = [];
    session_regenerate_id(true);
}

$_SESSION['created_at'] = $_SESSION['created_at'] ?? time();

/**
 * Build the JSON payload describing the current session state.
 */
function session_response_payload(): array
{
    $createdAt = (int) ($_SESSION['created_at'] ?? time());
    $updatedAt = (int) ($_SESSION['updated_at'] ?? $_SESSION['created_at'] ?? $createdAt);
    $contact = $_SESSION['contact'] ?? ['email' => '', 'name' => '', 'tel' => ''];

    return [
        'contact' => [
            'email' => (string) ($contact['email'] ?? ''),
            'name' => (string) ($contact['name'] ?? ''),
            'tel' => (string) ($contact['tel'] ?? ''),
        ],
        'createdAt' => gmdate('c', $createdAt),
        'updatedAt' => gmdate('c', $updatedAt),
        'expiresAt' => gmdate('c', $createdAt + SESSION_MAX_LIFETIME),
    ];
}
