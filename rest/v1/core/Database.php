<?php
require "env.php";

class Database
{
    private static $dbConnection;

    public static function connectDb()
    {
        // Localhost
        $host = DB_HOST;
        $dbname = DB_NAME;
        $username = DB_USERNAME;
        $password = DB_PASSWORD;

        // if (self::$dbConnection === null) {
        //     self::$dbConnection = new PDO("mysql:host={$host};dbname={$dbname};", $username, $password, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
        //     self::$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //     self::$dbConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        // }
        try {
            $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => false,
                // DigitalOcean SSL (safe default for managed DB)
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
            ];

            self::$dbConnection = new PDO($dsn, $username, $password, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            returnError("Database connection error.");
        }

        return self::$dbConnection;
    }
}
