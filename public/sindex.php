<?php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

/**
 * 1. API ROUTING
 */
if (str_starts_with($uri, '/rest/v1')) {

    require __DIR__ . '/../rest/v1/core/bootstrap.php';
    // or your main entry file inside core

    exit;
}

/**
 * 2. STATIC FILES (CSS/JS/Images from dist)
 */
$file = __DIR__ . '/../dist' . $uri;

if ($uri !== '/' && file_exists($file)) {
    return false; // let PHP server serve file
}

/**
 * 3. FRONTEND FALLBACK (SPA)
 */
readfile(__DIR__ . '/../dist/index.html');
