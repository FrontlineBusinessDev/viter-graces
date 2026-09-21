import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { setError, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";
import * as XLSX from "xlsx";

const ViewAccountsPayableDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const handleClose = () => {
    dispatch(setIsView(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  let totalPaidAmount = isEmptyItem(itemEdit?.paid_amount, 0);
  let totalAmount = isEmptyItem(itemEdit?.amount, 0);
  let totalBalanceAmount = isEmptyItem(itemEdit?.balance_amount, 0);

  const handleExportCsv = () => {
    const rows = (itemEdit?.items || []).map((item, index) => ({
      "#": index + 1,
      "Due Date": isEmptyItem(item?.purchase_order_date, ""),
      Amount: Number(
        item?.purchase_order_total_amount_per_product || 0,
      ).toFixed(2),
      "Paid Amount": Number(
        item?.purchase_order_total_paid_per_product || 0,
      ).toFixed(2),
      "Balance Amount": Number(
        item?.purchase_order_total_balance_per_product || 0,
      ).toFixed(2),
    }));

    rows.push({
      "#": "",
      "Due Date": "TOTAL",
      Amount: Number(totalAmount).toFixed(2),
      "Paid Amount": Number(totalPaidAmount).toFixed(2),
      "Balance Amount": Number(totalBalanceAmount).toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

    const today = new Date().toISOString().slice(0, 10);
    const fileName = `accounts_payable_${isEmptyItem(itemEdit?.purchase_order_number, "order")}_${today}`;
    XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: "csv" });
  };

  return (
    <ModalWrapper
      val={`Order Details - ${itemEdit?.purchase_order_number}`}
      itemEdit={itemEdit}
      mutation={{ isPending: false }}
      isOpen={true}
      handleClose={handleClose}
      width="min-w-[550px]!"
    >
      <ul className="grid grid-cols-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 ">
        <li>
          <p>Supplier:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.purchase_order_supplier_name}
          </p>
        </li>
        <li className="justify-end">
          <p>Delivery Date:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.purchase_order_expected_delivery}
          </p>
        </li>
        <li className="">
          <p>Order Date:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.purchase_order_date}
          </p>
        </li>
        <li className="justify-end">
          <p>TAX:</p>
          <p className="text-black dark:text-light">
            {Number(itemEdit?.purchase_order_percent_tax) === 0.12
              ? "Inclusive"
              : Number(itemEdit?.purchase_order_percent_tax) === 1.12
                ? "Exclusive"
                : "--"}
          </p>
        </li>
      </ul>

      <div className="border shadow border-gray-300 rounded-lg dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
        <div className="relative overflow-auto w-full h-full min-h-80 dark:bg-gray-900! ">
          <table className="shadow-none! ">
            <thead className={`relative z-50 table-header-group`}>
              <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! ">
                <th className="w-px dark:bg-gray-900! bg-gray-100!">#</th>
                <th className={`min-w-24  dark:bg-gray-900! bg-gray-100!`}>
                  Due Date
                </th>
                <th className={` dark:bg-gray-900! bg-gray-100!`}>Amount</th>
                <th
                  className={`min-w-30! dark:bg-gray-900! bg-gray-100! text-center`}
                >
                  Paid Amount
                </th>
                <th
                  className={`min-w-35! dark:bg-gray-900! bg-gray-100! text-center`}
                >
                  Balance Amount
                </th>
              </tr>
            </thead>
            <tbody className="">
              {itemEdit?.items?.map((a, index) => {
                return (
                  <tr key={index} className="border-0!">
                    <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                      {index + 1}.
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      {a?.purchase_order_date}
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      <AmountWithPesoSign
                        classN="size-3"
                        amount={Number(
                          a.purchase_order_total_amount_per_product,
                        )}
                      />
                    </td>

                    <td className="">
                      <AmountWithPesoSign
                        classN="size-3"
                        classAmnt="text-primary "
                        amount={Number(a.purchase_order_total_paid_per_product)}
                      />
                    </td>
                    <td className="">
                      <AmountWithPesoSign
                        classN="size-3"
                        classAmnt="text-primary text-warning "
                        amount={Number(
                          a.purchase_order_total_balance_per_product,
                        )}
                      />
                    </td>
                  </tr>
                );
              })}
              <tr className="border-0!">
                <td
                  className="dark:bg-gray-900! text-right font-bold "
                  colSpan={2}
                >
                  TOTAL
                </td>
                <td className="dark:bg-gray-900! text-right font-bold ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary text-black! "
                    amount={itemEdit.amount}
                  />
                </td>
                <td className="dark:bg-gray-900! text-right font-bold ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary"
                    amount={itemEdit.paid_amount}
                  />
                </td>

                <td className=" dark:bg-gray-900! ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary text-warning"
                    amount={itemEdit.balance_amount}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ul className="grid grid-cols-2 my-3 [&>li]:border-b [&>li]:border-b-gray-200 gap-y-2 ">
        <li>Total Amount</li>
        <li className="text-right text-black font-bold">
          <AmountWithPesoSign classN="size-3" amount={Number(totalAmount)} />
        </li>
        <li>Total Paid</li>
        <li className="text-right text-green-600 font-bold">
          <AmountWithPesoSign
            classN="size-3"
            amount={Number(totalPaidAmount)}
          />
        </li>
      </ul>
      <div className="grid grid-cols-2 bg-[#F5F5EC] dark:bg-gray-600 p-2 mb-5">
        <span className="font-bold text-lg text-red-600 dark:text-light">
          Balance
        </span>
        <span className="font-bold text-lg text-right text-red-600 dark:text-light">
          <AmountWithPesoSign amount={Number(totalBalanceAmount)} />
        </span>
      </div>

      <ExportCSVButton onClick={handleExportCsv} />
    </ModalWrapper>
  );
};

export default ViewAccountsPayableDetails;
