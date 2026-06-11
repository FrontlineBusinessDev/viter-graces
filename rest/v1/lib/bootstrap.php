<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;


// Go to project root (adjust if needed)
$rootPath = dirname(__DIR__, 3);

$dotenv = Dotenv::createImmutable($rootPath);

// echo var_dump($dotenv);
$dotenv->load();
