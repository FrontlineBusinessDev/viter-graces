import { Eye, EyeOff } from "lucide-react";
import React from "react";
import TableLoading from "./spinners/TableLoading";

const StatCardLoader = () => {
  return (
    <>
      <div className="group perspective-[1000px] w-full ">
        <div
          className={`relative transition-transform duration-500 transform-3d `}
        >
          {/* FRONT */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm  w-full hover:shadow-md transition border border-transparent hover:border-gray-300 backface-hidden h-[155px]">
            <TableLoading count={1} cols={2} />
            <TableLoading count={3} cols={1} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatCardLoader;
