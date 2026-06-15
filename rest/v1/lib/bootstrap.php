<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$rootPath = dirname(__DIR__, 3);
$dotenv = Dotenv::createImmutable($rootPath);
$dotenv->safeLoad();

// Production fallback — sync system env vars into $_ENV
// (DigitalOcean injects vars into system environment, not a .env file)
foreach ($_SERVER as $key => $value) {
    if (!isset($_ENV[$key])) {
        $_ENV[$key] = $value;
    }
}

// Also catch anything only in getenv()
foreach (array_keys(getenv()) as $key) {
    if (!isset($_ENV[$key])) {
        $_ENV[$key] = getenv($key);
    }
}
