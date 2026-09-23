<?php
require_once __DIR__ . '/../bootstrap.php';

define("USERNAME", $_ENV['EMAIL_USERNAME']);
define("PASSWORD", $_ENV['EMAIL_PASSWORD']);
define("FROM", "Grace's ");
define("VERIFY_ACCOUNT", "Account Verification");
define("RESET_PASSWORD", "Reset Password");
define("VERIFY_EMAIL", "Email Verification");
define("REPLY_TO", $_ENV['EMAIL_REPLY_TO']);

// Frontline
define("HOST", $_ENV['EMAIL_HOST']);
define("PORT", $_ENV['EMAIL_PORT']);
define("SMTPSECURE", $_ENV['EMAIL_SMTPSECURE']);


// // local
// define("ROOT_DOMAIN", "http://localhost:5173/portal");
// define("IMAGES_URL", "http://localhost:5173/portal/img");

define("ROOT_DOMAIN", $_ENV['VITE_APP_DEV_BASE_URL']);
define("IMAGES_URL", $_ENV['VITE_APP_DEV_BASE_URL'] . "/img");
