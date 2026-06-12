<?php
require_once __DIR__ . '/../bootstrap.php';

define("USERNAME", "noreply@hris.frontlinebusiness.com.ph");
define("PASSWORD", "b@11551gfN4b");
define("FROM", "Grace's ");
define("VERIFY_ACCOUNT", "Account Verification");
define("RESET_PASSWORD", "Reset Password");
define("VERIFY_EMAIL", "Email Verification");
define("REPLY_TO", "cyrene.lumabas@frontlinebusiness.com.ph");

// Frontline
define("HOST", "mail.frontlinebusiness.com.ph");
define("PORT", 465);
define("SMTPSECURE", "ssl");


// // local
// define("ROOT_DOMAIN", "http://localhost:5173/portal");
// define("IMAGES_URL", "http://localhost:5173/portal/img");

define("ROOT_DOMAIN", $_ENV['VITE_APP_DEV_BASE_URL'] . $_ENV['VITE_APP_DEV_API_VERSION']);
define("IMAGES_URL", $_ENV['VITE_APP_DEV_BASE_URL'] . $_ENV['VITE_APP_DEV_API_VERSION'] . "/img");
