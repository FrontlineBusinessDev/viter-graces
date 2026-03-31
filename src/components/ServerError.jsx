import { ChevronsLeftRightEllipsis } from "lucide-react";
import React from "react";

const ServerError = () => {
  return (
    <>
      <div className="flex justify-center items-center flex-col p-2">
        <ChevronsLeftRightEllipsis className="h-14 w-14 text-gray-300" />
        <span className=" text-gray-300 text-xl">
          Server Error / API Network Error
        </span>
      </div>
    </>
  );
};

export default ServerError;
