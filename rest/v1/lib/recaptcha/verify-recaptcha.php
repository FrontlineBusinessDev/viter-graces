<?php

function verifyRecaptcha($res)
{
    $curlx = curl_init();

    curl_setopt($curlx, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
    curl_setopt($curlx, CURLOPT_HEADER, 0);
    curl_setopt($curlx, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curlx, CURLOPT_POST, 1);

    $post_data =
        [
            'secret' => ' 6Ldaj2wrAAAAACK7HWC6-_SJn-VQaVZ4CyJofM0D', //<--- your reCaptcha secret key WFS
            'response' => $res
        ];

    curl_setopt($curlx, CURLOPT_POSTFIELDS, $post_data);

    $resp = curl_exec($curlx);

    curl_close($curlx);

    $val = json_decode($resp, true);
    if (!$val['success']) {
        echo json_encode([
            "error" => "Invalid recaptcha.",
            "type" => "invalid_request_error",
            "details" => $val
        ]);
        exit;
    }

    return [$resp, $val];
}
