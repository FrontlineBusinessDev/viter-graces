import { StoreContext } from "@/store/StoreContext";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const { store } = React.useContext(StoreContext);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center pt-40 flex-col gap-2 p-4 h-screen bg-linear-to-t text-black">
        <h3 className="text-8xl">404</h3>
        <h2 className="font-bold text-2xl ">Page not found</h2>
        <p className="">Please check your URL</p>
        <button
          type="button"
          className="group flex items-center gap-1 z-10 py-2 px-6 rounded-md text-primary font-bold "
          onClick={() => handleBack()}
        >
          <ArrowLeft className="group-hover:mr-4 duration-100 ease-in-out" />
          <span>Go back</span>
        </button>
      </div>
    </>
  );
};

export default PageNotFound;
