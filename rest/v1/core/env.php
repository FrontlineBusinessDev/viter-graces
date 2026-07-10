<?php

// THIS IS FOR USING THE ROOT .ENV
require_once __DIR__ . '/../lib/bootstrap.php';

// echo var_dump($_ENV);
// echo var_dump($_ENV['WEB_APP_API_KEY']);
// echo getenv('WEB_APP_API_KEY');
// exit;

define("WEB_APP_API_KEY", $_ENV['WEB_APP_API_KEY']);
// LOCAL
define("DB_HOST", $_ENV['DB_HOST']);
define("DB_NAME", $_ENV['DB_NAME']);
define("DB_USERNAME", $_ENV['DB_USERNAME']);
define("DB_PASSWORD", $_ENV['DB_PASSWORD']);
define("DB_PORT", $_ENV['DB_PORT']);

// GOOGLE APIS
define("GOOGLE_API_SUBJECT_EMIAL", $_ENV["GOOGLE_API_SUBJECT_EMAIL"]);
define("GOOGLE_API_DIRECTORY_PATH", __DIR__ . $_ENV["GOOGLE_API_DIRECTORY_PATH"]);
define("GOOGLE_AUTH_DRIVE", 'https://www.googleapis.com/auth/drive');

define("UPLOAD_MULTIPLE_PATH", $_ENV["UPLOAD_MULTIPLE_PATH"]);

// Also add putenv just to be completely safe:

define("GOOGLE_CLIENT_ID", $_ENV["GOOGLE_CLIENT_ID"]);
define("GOOGLE_CLIENT_SECRET", $_ENV["GOOGLE_CLIENT_SECRET"]);
define("GOOGLE_REFRESH_TOKEN", $_ENV["GOOGLE_REFRESH_TOKEN"]);

// define("USERNAME", "noreply@hris.frontlinebusiness.com.ph");
// define("PASSWORD", "b@11551gfN4b");
// define("FROM", "Grace's ");
// define("VERIFY_ACCOUNT", "Account Verification");
// define("RESET_PASSWORD", "Reset Password");
// define("VERIFY_EMAIL", "Email Verification");
// define("REPLY_TO", "cyrene.lumabas@frontlinebusiness.com.ph");

// // Frontline
// define("HOST", "mail.frontlinebusiness.com.ph");
// define("PORT", 465);
// define("SMTPSECURE", "ssl");

/*SITEGROUND config*/
// define("HOST", "gvam1193.siteground.biz");
// define("PORT", 465);
// define("SMTPSECURE", "ssl");

// /*GMAIL config*/
// define("HOST", "smtp.gmail.com");
// define("PORT", 587);
// define("SMTPSECURE", "tls");

/*OFFICE 365 config*/
// define("HOST", "smtp.office365.com");
// define("PORT", 587);
// define("SMTPSECURE", "tls")

/*OUTLOOK config*/
// define("HOST", "smtp-mail.outlook.com");
// define("PORT", 587);
// define("SMTPSECURE", "tls")

// // // local
// define("ROOT_DOMAIN", "http://localhost:5173/giving");
// define("IMAGES_URL", "http://localhost:5173/giving/img");


// LIVE
// define("WEB_APP_API_KEY", require $_SERVER["DOCUMENT_ROOT"] . '/../../apikey.php');
// define("DB_NAME", 'dbebtpqmtfksdq');
// define("DB_USERNAME", 'frontli5_fbs');
// define("DB_PASSWORD", '6o~q%}%U^&67');

// // GOOGLE APIS LIVE
// define("GOOGLE_API_SUBJECT_EMIAL", "emmanuel.manalo@frontlinebusiness.com.ph");
// define("GOOGLE_API_DIRECTORY_PATH", __DIR__ . '/../../../img/');
// define("UPLOAD_MULTIPLE_PATH", "../../../img/");

// define("USERNAME", "noreply@hris.frontlinebusiness.com.ph");
// define("PASSWORD", "b@11551gfN4b");

define("WEB_APP_AMAZON_SPACE_STORAGE_BUCKET", $_ENV["WEB_APP_AMAZON_SPACE_STORAGE_BUCKET"]);
define("WEB_APP_AMAZON_SPACE_STORAGE_REGION", $_ENV["WEB_APP_AMAZON_SPACE_STORAGE_REGION"]);
define("WEB_APP_AMAZON_SPACE_STORAGE_KEY", $_ENV["WEB_APP_AMAZON_SPACE_STORAGE_KEY"]);
define("WEB_APP_AMAZON_SPACE_STORAGE_SECRET", $_ENV["WEB_APP_AMAZON_SPACE_STORAGE_SECRET"]);
