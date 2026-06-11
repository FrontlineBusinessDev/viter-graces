<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

try {
    // // Go to project root (adjust if needed)
    if (file_exists(__DIR__ . '/../../.env')) {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();
    }
    // $rootPath = dirname(__DIR__, 3);
    // $dotenv = Dotenv::createImmutable($rootPath);
} catch (Exception $e) {
    error_log("Dotenv skipped: " . $e->getMessage());
    echo  $e->getMessage();
    exit;
}
// // echo var_dump($dotenv);
// $dotenv->load();
