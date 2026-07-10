import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { Image } from "lucide-react";
import ActionButtonMobile from "../ActionButtonMobile";

const RoleMobileReponsive = ({
  rows,
  setData,
  setItemEdit,
  isDefaultMobile,
  ishaveSubAdd = false,
}) => {
  return (
    <>
      {isDefaultMobile === "roles" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            const is_status =
              Number(rowData?.role_is_active) > 0 ? "active" : "inactive";

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex flex-wrap gap-2 justify-between items-center border-b border-gray-200 pb-3 ">
                  <div className="flex flex-col">
                    <div className="flex sm:gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.name}
                      </span>
                    </div>
                    <span className={`font-semibold text-left text-xs `}>
                      {rowData?.role_description}
                    </span>
                  </div>

                  {/* STATUS */}
                  <div>
                    <Pills variant={is_status}>{is_status}</Pills>
                    <p className="mb-0 mt-1">{rowData?.user_account_role}</p>
                  </div>
                </div>

                {/* OTHER FIELDS */}
                <div className="flex flex-wrap justify-end items-end mt-3">
                  <ActionButtonMobile
                    dataArray={rowData}
                    setData={setData}
                    setItemEdit={setItemEdit}
                    ishaveSubAdd={ishaveSubAdd}
                    path={isDefaultMobile}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default RoleMobileReponsive;
