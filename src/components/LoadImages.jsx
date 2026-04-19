import { CircleUser, FileText, User } from "lucide-react";
import React from "react";
import TableSpinner from "./spinners/TableSpinner";
import { devBaseImgUrl, googleHDViewLink } from "@/config/config";

const LoadImages = ({
  url,
  className,
  count = 0,
  isTableSpinner = false,
  isErrorUserImage = false,
  isDevBaseUrl = false,
  icon = false,
  setLoadingImg = () => {},
}) => {
  if (!url || url === "") {
    return;
  }

  const [isLoading, setIsLoading] = React.useState(true);
  const [isImageError, setIsImageError] = React.useState(false);
  const isLocalFile = url instanceof File || url instanceof Blob;
  const isLocalImage = isLocalFile && url.type.split("/").includes("image");
  const blobFile = new Blob([url], { type: url.type });
  const urlObjectFile = URL.createObjectURL(blobFile);

  React.useEffect(() => {
    setLoadingImg(true);
  }, []);

  return (
    <>
      {isLoading && (
        <>
          {isTableSpinner ? (
            <div className="bg-gray-300 h-full w-full rounded-md relative loading-bar overflow-hidden z-20"></div>
          ) : (
            <TableSpinner />
          )}
        </>
      )}
      <img
        src={
          isLocalImage
            ? urlObjectFile
            : url.id
              ? googleHDViewLink + url.id
              : isDevBaseUrl
                ? devBaseImgUrl + "/" + url
                : url
        }
        onLoad={({ currentTarget }) => {
          setIsLoading(false);
          setLoadingImg(false);
          setIsImageError(false);
          currentTarget.classList = className;
        }}
        onError={({ currentTarget }) => {
          currentTarget.classList = "hidden";
          //   currentTarget.onerror = null; // prevents looping
          setIsLoading(false);
          setLoadingImg(false);
          setIsImageError(true);
        }}
        alt={`${
          isLocalImage
            ? urlObjectFile
            : url.id
              ? googleHDViewLink + url.id
              : url
        }`}
        className={className}
      />
      <div className="absolute top-0 bottom-0 left-0 right-0">
        <div className="flex flex-col gap-4 justify-center items-center h-full">
          {icon ? (
            <>
              {isImageError && isErrorUserImage && (
                <User className="w-full h-full fill-gray-400" />
              )}
            </>
          ) : (
            <>
              {isImageError && isErrorUserImage && (
                <CircleUser className="w-full h-full fill-gray-400" />
              )}
            </>
          )}

          {isImageError && !isErrorUserImage && (
            <FileText className="text-5xl fill-gray-300" />
          )}

          {isImageError && !isErrorUserImage && (
            <span className="text-xs">File could not preview.</span>
          )}
        </div>
      </div>
    </>
  );
};

export default LoadImages;
