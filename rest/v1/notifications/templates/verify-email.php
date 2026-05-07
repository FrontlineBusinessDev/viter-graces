<?php

function getHtmlVerifyEmail(
  $password_link,
  $name,
  $key,
  $ROOT_DOMAIN,
  $IMAGES_URL
) {
  $html = '<style>
  @import url("https://fonts.cdnfonts.com/css/Helvetica Neue-neue-9");
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  p {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .info td {
    padding: 2px;
    font-size: 14px;
  }
  table {
    border-spacing: 0;
  }
</style>
<body
  style="
    font-family:
      Helvetica Neue,
      sans-serif;
    line-height: 1.6;
    padding: 10px 0;
    background-color: #fff;
  "
>
  <div style="width: 100%; max-width: 550px; margin: 10px auto">
    <div style="padding: 10px 10px 0px">
      <div>
        <img
          src="' . $IMAGES_URL . '/SideLogo.png"
          alt="wfs"
          style="max-width: 150px"
        />
      </div>
    </div>
    <div style="padding: 0 10px 0px">
      <div style="color: #505050; margin: 20px 0 0px; border-radius: 10px">
        <div style="padding: 20px 0px; border-radius: 5px 5px 12px 12px">
          <p
            style="
              line-height: 1.2;
              font-size: 16px;
              color: #505050;
              font-weight: bold;
              margin: 0;
            "
          >
            CHANGE EMAIL REQUEST
          </p>
        </div>
        <div style="padding: 10px 0px">
          <p style="margin: 5px 0px 15px 0px">Hi There ' . $name . ',</p>
          <p style="margin-bottom: 5px">
            Hi there, We’ve received a request to change your email address.<br />To
            complete the update and secure your account, please confirm by
            clicking the button below.
          </p>

          <div style="margin: 30px 0 30px 0px">
            <a
              href="' . $ROOT_DOMAIN . '' . $password_link . '?key=' . $key . '"
              style="
                padding: 4px 50px;
                background-color: #1e7f2d;
                color: #fff;
                display: inline-block;
                text-decoration: none;
                font-size: 14px;
                border-radius: 5px;
                line-height: 28px;
              "
              >Confirm new email</a
            >
          </div>
          <small style="margin-top: 30px">
            If you didn’t receive the email, you can request a new one anytime.
            <br />
            Need help? Reply to this email—we’re here for you.
          </small>
        </div>
      </div>
      <p
        style="
          margin-top: 40px;
          font-size: 12px;
          padding: 20px 15px 0 0px;
          border-top: 1px solid #ddd;
          color: #505050;
        "
      >
        Having issues with the link? Try to paste this text on your browser URL:

        <a
          target="_blank"
          rel="nofollow"
          style="
            font-size: 12px;
            font-family:
              Helvetica Neue,
              sans-serif;
            text-decoration: none;
            color: #505050;
          "
          >' . $ROOT_DOMAIN . '' . $password_link . '?key=' . $key . '</a
        >
      </p>
    </div>
  </div>
</body> 
';
  return $html;
}
