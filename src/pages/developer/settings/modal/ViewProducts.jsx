import CloseButton from "@/components/buttons/CloseButton";
import NoData from "@/components/NoData";
import { AmountsWithPesoSign, AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import {
  numberWithCommas,
  numberWithCommasToFixed,
} from "@/utilities/numberWithCommas";
import { Download } from "lucide-react";
import React from "react";

const ViewProducts = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  let counter = 1;
  const handleClose = () => {
    dispatch(setIsView(false));
  };

  let total_balance =
    Number(itemEdit?.total_amount) - Number(itemEdit?.total_paid);

  // console.log("itemEdit", itemEdit);
  return (
    <div
      className="bg-dark/50 dark:bg-dark-mode/90 fixed inset-0 z-999 flex justify-center items-center overflow-y-auto animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className={`p-1 min-w-[650px] animate-slideUp w-full max-w-lg my-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col max-h-[90vh] p-4">
          <div className="modal-header relative p-4">
            <h3 className="text-black dark:text-light text-lg ">
              Owned Products
            </h3>
            <CloseButton handleClose={handleClose} />
          </div>
          <ul className="pl-4 mb-2">
            <li className="text-black dark:text-light ">
              Name: {itemEdit?.name}
            </li>
            <li className="text-black dark:text-light ">
              Email: {itemEdit?.user_account_email}
            </li>
          </ul>

          <div className="overflow-y-auto flex-1">
            <div className="">
              <div className="rounded-2xl border border-gray-300 bg-white dark:bg-[#0b111e] overflow-x-hidden dark:border-gray-700 max-h-[200px]">
                <div className="relative overflow-auto w-full h-full bg-gray-100 dark:bg-gray-900! ">
                  <table className="shadow-none! ">
                    <thead className={`relative z-50 table-header-group`}>
                      <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! ">
                        <th className="w-px dark:bg-gray-900!">#</th>
                        <th className={`min-w-40  dark:bg-gray-900!`}>
                          Status
                        </th>
                        <th className={`min-w-40  dark:bg-gray-900!`}>
                          Product
                        </th>
                        <th className={` dark:bg-gray-900!`}>Stock</th>
                        <th
                          className={`min-w-30! dark:bg-gray-900! text-right`}
                        >
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {isEmptyItem(itemEdit?.items?.length, 0) === 0 && (
                        <tr className=" ">
                          <td colSpan="100%" className="">
                            <NoData />
                          </td>
                        </tr>
                      )}

                      {itemEdit?.items?.map((aitem, index) => {
                        return (
                          <tr key={index} className="border-0!">
                            <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                              {index + 1}.
                            </td>
                            <td className=" dark:bg-gray-900! ">
                              <Pills variant={aitem?.inventory_status}>
                                {aitem?.inventory_status}
                              </Pills>
                            </td>
                            <td className=" dark:bg-gray-900! ">
                              {aitem?.stock_movement_product_name}
                            </td>
                            <td className="text-right dark:bg-gray-900! ">
                              {numberWithCommas(aitem?.current_qty)}
                            </td>
                            <td className="text-right dark:bg-gray-900! ">
                              <AmountsWithPesoSign
                                classN={"size-3"}
                                amount={aitem?.products_price}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
