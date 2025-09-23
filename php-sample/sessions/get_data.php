<?php

declare(strict_types=1);

require __DIR__ . '/session_bootstrap.php';

header('Content-Type: application/json; charset=UTF-8');

echo json_encode(session_response_payload(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
