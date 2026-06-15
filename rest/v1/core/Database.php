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
        $port = DB_PORT;
        try {
            if (self::$dbConnection !== null) {
                return self::$dbConnection;
            }
            // if (self::$dbConnection === null) {
            //     self::$dbConnection = new PDO("mysql:host={$host};dbname={$dbname};", $username, $password, [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
            //     self::$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //     self::$dbConnection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            // } 
            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
            $isProduction = getenv('APP_ENV') === 'production';
            $options = [
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            if ($isProduction) {
                $options[PDO::MYSQL_ATTR_SSL_CA] = '/etc/ssl/certs/ca-certificates.crt';
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT && $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
            }

            self::$dbConnection = new PDO($dsn, $username, $password, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            returnError("Database connection error." . $e->getMessage());
        }

        return self::$dbConnection;
    }
}
