<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$rootPath = dirname(__DIR__, 3);
$dotenv = Dotenv::createImmutable($rootPath);
$dotenv->safeLoad();
// $dotenv->usePutenv()->load();
