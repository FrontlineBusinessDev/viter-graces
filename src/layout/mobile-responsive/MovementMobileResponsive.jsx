import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import ActionButtonMobile from "../ActionButtonMobile";

const MovementMobileResponsive = ({
  rows,
  setData,
  setItemEdit,
  lastRowRef,
  isDefaultMobile,
  ishaveSubAdd = false,
  path = "",
}) => {
  return (
    <>
      {isDefaultMobile === "stock-movement" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex gap-2 justify-between items-center border-b border-gray-200 pb-3 ">
                  <ul className="flex flex-col">
                    <li className="flex sm:gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.stock_movement_product_name}
                      </span>
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.stock_movement_product_owner_name}
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.stock_movement_location}
                    </li>
                  </ul>

                  {/* STATUS */}
                  <ul>
                    <li className="mb-0 capitalize">
                      {rowData?.stock_movement_type}
                    </li>
                    <li className="mb-0">{rowData?.stock_movement_date}</li>
                  </ul>
                </div>
                {/* OTHER FIELDS */}
                <div className="flex flex-wrap justify-between items-end">
                  <ul className="py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Quantity:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.stock_movement_qty}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Before:
                      </span>
                      <span className="wrap-break-word font-semibold ">
                        {rowData?.stock_movement_before_qty}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        After:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.stock_movement_after_qty}
                      </span>
                    </li>
                  </ul>
                  <div className=" ">
                    <ActionButtonMobile
                      dataArray={rowData}
                      setData={setData}
                      setItemEdit={setItemEdit}
                      ishaveSubAdd={ishaveSubAdd}
                      path={path}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MovementMobileResponsive;
