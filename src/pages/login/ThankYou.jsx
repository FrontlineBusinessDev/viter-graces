import LogoFull from "@/assets/svg/LogoFull";
import { devNavUrl } from "@/config/config";
import { Check } from "lucide-react";
import React from "react";

const ThankYou = () => {
  return (
    <div
      className="relative flex justify-center items-center bg-dark-bg"
      style={{ transform: "translateY(clamp(5rem,12vw,8rem))" }}
    >
      <div className="w-96 p-6">
        <div className="flex justify-center items-center flex-col">
          <LogoFull />
        </div>
        <Check className="h-16 w-16 mx-auto mt-8" color="rgb(0 145 38)" />
        <h2 className="mb-4 mt-2 text-lg text-center">Thank You!</h2>
        <p className="text-sm text-justify mb-6">
          Your password has been successfully reset. A confirmation email has
          been sent. For your security, you have been logged out of your
          previous session. Please log in with your new credentials.
        </p>

        <p className="mt-2 text-sm">
          Go back to{" "}
          <a href={`${devNavUrl}/login`} className="w-full text-primary">
            <u> login</u>
          </a>
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
