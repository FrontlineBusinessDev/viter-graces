import ModalButton from "@/components/buttons/ModalButton";
import {
  InputSalesOrderSelectTagArray,
  InputSelectArrayWithOptions,
  InputSelectFilterTagArray,
} from "@/components/inputs/InputSelect";
import { InputNumber, InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { AmountsWithPesoSign, AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import {
  ActivityLogDetails,
  discountTypeOption,
  InstallmentByType,
  InstallmentType,
  PaymentMethodList,
  PaymentTermsList,
  taxOption,
} from "@/layout/ArrayValue";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { queryData } from "@/services/queryData";
import useQueryData from "@/services/useQueryData";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { isRowsDirty } from "@/utilities/isRowsDirty";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { PhilippinePeso, Plus } from "lucide-react";
import React from "react";
import * as Yup from "yup";
import { PropsValues, Validations } from "./functions";

const ModalSalesOrders = ({ itemEdit, cutomer = "" }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [counter, setCounter] = React.useState(1);
  const [itemsDelete, setItemsDelete] = React.useState([]);

  const [items, setItems] = React.useState(
    itemEdit
      ? itemEdit?.items
      : [
          {
            id: 0,
            sales_order_product_id: "",
            sales_order_product_name: "",
            sales_order_product_owner_id: "",
            sales_order_product_owner_name: "",
            sales_order_discounted_with_vat_amount: 0,
            current_qty: "0",
            sales_order_qty: "1",
            sales_order_qty_old: "1",
            sales_order_price: "",
            sales_order_total: 0,
            is_new: true,
          },
        ],
  );

  const initialItemsRef = React.useRef(null);
  if (initialItemsRef.current === null) {
    initialItemsRef.current = JSON.parse(JSON.stringify(items));
  }

  const [selectedCustomerId, setSelectedCustomerId] = React.useState(
    isEmptyItem(
      itemEdit?.sales_order_customer_id,
      isEmptyItem(cutomer?.customer_aid, ""),
    ),
  );

  // Credit memo balance for the selected customer (processed returns only)
  const { data: creditMemoResult } = useQueryData(
    `${apiVersion}/customer/read-open-credit-memo`, // endpoint
    "post", // method
    `customer/read-open-credit-memo`, // key
    {
      id: selectedCustomerId,
      excludeSalesOrderNumber: isEmptyItem(itemEdit?.sales_order_number, ""),
    },
    { id: selectedCustomerId },
  );

  const creditMemoBalance = Number(
    isEmptyItem(creditMemoResult?.data?.[0]?.open_credit_memo, 0),
  );

  const paymentMethodOptions = PaymentMethodList().filter(
    (option) =>
      option.value !== "credit memo" ||
      (Number(selectedCustomerId) > 0 && creditMemoBalance > 0) ||
      itemEdit?.sales_order_payment_method === "credit memo",
  );
  console.log("creditMemoBalance", creditMemoBalance);
  // matches the blank row handleAddItem appends - a plain "Add Item" click
  // alone must not enable Save, only actually filling in a field should
  const blankItemTemplate = {
    sales_order_aid: 0,
    sales_order_product_id: "",
    sales_order_product_name: "",
    sales_order_product_owner_id: "",
    sales_order_product_owner_name: "",
    sales_order_qty: "1",
    sales_order_qty_old: "1",
    sales_order_price: "",
    sales_order_total: 0,
    is_new: true,
  };
  const itemsDirty =
    itemsDelete.length > 0 ||
    isRowsDirty(items, initialItemsRef.current, blankItemTemplate);

  const handleChange = (index, selectedItem = "", fieldId, field) => {
    const updated = [...items];
    if (selectedItem === null || selectedItem === "") {
      updated[index]["sales_order_product_owner_id"] = "";
      updated[index]["current_qty"] = 0;
      updated[index]["old_qty"] = 0;
      updated[index]["sales_order_product_owner_name"] = "";
      updated[index]["sales_order_price"] = "";
      updated[index]["sales_order_total"] = 0;
      updated[index][field] = "";
      updated[index][fieldId] = "";
      updated[index]["is_new"] = true;
    } else {
      updated[index]["is_new"] = true;
      updated[index]["sales_order_product_owner_id"] =
        selectedItem["products_owner_id"];
      updated[index]["current_qty"] = selectedItem["current_qty"];
      updated[index]["old_qty"] =
        Number(isEmptyItem(selectedItem["current_qty"], 0)) +
        Number(isEmptyItem(selectedItem["sales_order_qty"], 0));
      updated[index]["sales_order_product_owner_name"] =
        selectedItem["products_owner_name"];
      updated[index]["sales_order_price"] = selectedItem["products_price"];
      const qty = Number(updated[index]["sales_order_qty"] || 1);
      const price = Number(updated[index]["sales_order_price"] || 0);
      updated[index]["sales_order_total"] = qty * price;

      updated[index][field] = selectedItem["name"];
      updated[index][fieldId] = selectedItem["id"];
    }
    setItems(updated);
  };

  const handleChangeAmount = (index, id = 0, field, value) => {
    const updated = [...items];
    updated[index]["is_new"] = true;
    updated[index]["old_qty"] = itemEdit
      ? Number(isEmptyItem(updated[index]["current_qty"], 0)) +
        Number(isEmptyItem(updated[index]["sales_order_qty_old"], 0))
      : Number(isEmptyItem(updated[index]["current_qty"], 0));

    updated[index][field] = value;

    // compute row total
    const qty = Number(updated[index]["sales_order_qty"] || 1);
    const price = Number(updated[index]["sales_order_price"] || 0);

    updated[index]["sales_order_total"] = qty * price;

    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        sales_order_aid: 0,
        sales_order_product_id: "",
        sales_order_product_name: "",
        sales_order_product_owner_id: "",
        sales_order_product_owner_name: "",
        sales_order_qty: "1",
        sales_order_qty_old: "1",
        sales_order_price: "",
        sales_order_total: 0,
        is_new: true,
        id: counter,
      },
    ]);
    setCounter((prev) => prev + 1);
  };

  const handleRemoveItem = (a) => {
    setItemsDelete([
      ...itemsDelete,
      {
        sales_order_aid: isEmptyItem(a?.sales_order_aid, 0),
        id: a.id,
      },
    ]);

    setItems((prev) => prev.filter((item) => item.id !== a.id));
  };

  handleEscape(() => handleClose());

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/sales-order/${itemEdit?.id}`
          : `${apiVersion}/sales-order`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stock-movement"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
      queryClient.invalidateQueries({ queryKey: ["sales-order"] });

      if (data.success) {
        dispatch(setIsAdd(false));
        dispatch(setSuccess(true));
        dispatch(
          setMessage(
            itemEdit ? "Updated successfully." : "Created successfully.",
          ),
        );
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error || "An unexpected error occurred."));
      }
    },
  });

  const handleClose = () => {
    dispatch(setIsAdd(false));
    dispatch(setError(false));
    queryClient.invalidateQueries({ queryKey: ["stock-movement"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
    queryClient.invalidateQueries({ queryKey: ["sales-order"] });
    sessionStorage.removeItem("quickAdd");
  };

  const initVal = {
    // ...itemEdit,
    sales_order_date: isEmptyItem(
      itemEdit?.order_date,
      store?.credentials?.data?.server_date,
    ),
    sales_order_customer_id: isEmptyItem(
      itemEdit?.sales_order_customer_id,
      isEmptyItem(cutomer?.customer_aid, ""),
    ),
    sales_order_customer_name: isEmptyItem(
      itemEdit?.sales_order_customer_name,
      isEmptyItem(cutomer?.customer_name, ""),
    ),
    sales_order_payment_method: isEmptyItem(
      itemEdit?.sales_order_payment_method,
      "cash",
    ),
    sales_order_product_id: isEmptyItem(itemEdit?.sales_order_product_id, ""),
    sales_order_product_name: isEmptyItem(
      itemEdit?.sales_order_product_name,
      "",
    ),
    sales_order_qty: isEmptyItem(itemEdit?.sales_order_qty, "1"),
    sales_order_status: isEmptyItem(itemEdit?.sales_order_status, ""),
    sales_order_price: isEmptyItem(itemEdit?.sales_order_price, ""),
    sales_order_total: isEmptyItem(itemEdit?.sales_order_total, ""),
    sales_order_discount: isEmptyItem(itemEdit?.sales_order_discount, ""),
    sales_order_tax: isEmptyItem(itemEdit?.sales_order_tax, "0"),
    sales_order_tax_amount: isEmptyItem(itemEdit?.sales_order_tax_amount, "0"),
    sales_order_paid_amount: isEmptyItem(itemEdit?.sales_order_paid_amount, ""),
    sales_order_notes: isEmptyItem(itemEdit?.sales_order_notes, ""),
    sales_order_received_by_id: isEmptyItem(
      itemEdit?.sales_order_received_by_id,
      store.credentials?.data?.user_account_aid,
    ),
    sales_order_received_by_name: isEmptyItem(
      itemEdit?.sales_order_received_by_name,
      store.credentials?.data?.name,
    ),
    sales_order_product_owner_id: isEmptyItem(
      itemEdit?.sales_order_product_owner_id,
      "",
    ),
    sales_order_product_owner_name: isEmptyItem(
      itemEdit?.sales_order_product_owner_name,
      "",
    ),
    sales_order_installment: isEmptyItem(
      itemEdit?.sales_order_installment,
      "0",
    ),
    sales_order_due_date: isEmptyItem(
      itemEdit?.sales_order_due_date,
      store?.credentials?.data?.server_date,
    ),
    sales_order_total_receivable_amount: isEmptyItem(
      itemEdit?.sales_order_total_receivable_amount,
      "0",
    ),
    sales_order_total_balance_amount: isEmptyItem(
      itemEdit?.sales_order_total_balance_amount,
      "0",
    ),
    sales_order_payment_terms: isEmptyItem(
      itemEdit?.sales_order_payment_terms,
      "due on receipt - due on the same day the sales order",
    ),
    sales_order_total_amount: isEmptyItem(
      itemEdit?.sales_order_total_amount,
      "0",
    ),
    sales_order_number: isEmptyItem(itemEdit?.sales_order_number, ""),
    sales_order_discounted_with_vat_amount: isEmptyItem(
      itemEdit?.sales_order_discounted_with_vat_amount,
      0,
    ),
    subtotal: "0",
    validationAmount: false,
    sales_order_installment_type: isEmptyItem(
      itemEdit?.sales_order_installment_type,
      "monthly",
    ),
    sales_order_installment_type_day: isEmptyItem(
      itemEdit?.sales_order_installment_type_day,
      "0",
    ),
    sales_order_installment_count: isEmptyItem(
      itemEdit?.sales_order_installment_count,
      "0",
    ),
    sales_order_installment_amount: isEmptyItem(
      itemEdit?.sales_order_installment_amount,
      "0",
    ),
    sales_order_cash: isEmptyItem(itemEdit?.sales_order_cash, "0"),
    sales_order_check: isEmptyItem(itemEdit?.sales_order_check, "0"),
    sales_order_online_transaction: isEmptyItem(
      itemEdit?.sales_order_online_transaction,
      "0",
    ),
    sales_order_credit_memo: isEmptyItem(
      itemEdit?.sales_order_credit_memo,
      "0",
    ),

    sales_order_discount_percentage: isEmptyItem(
      itemEdit?.sales_order_discount_percentage,
      "0",
    ),
    sales_order_discount_type: isEmptyItem(
      itemEdit?.sales_order_discount_type,
      "amount",
    ),
  };

  const yupSchema = Yup.object({
    sales_order_date: Yup.string().trim().required("Required"),
    sales_order_customer_id: Yup.string().trim().required("Required"),
    sales_order_credit_memo: Yup.number().test(
      "max-credit-memo",
      "Exceeds the available credit memo balance",
      function (value) {
        if (this.parent.sales_order_payment_method !== "credit memo") {
          return true;
        }
        // const maxAllowed = Math.min(
        //   creditMemoBalance,
        //   Number(this.parent.sales_order_total_receivable_amount),
        // );
        return Number(value || 0) <= creditMemoBalance;
      },
    ),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      {/*  */}
      <ModalWrapper
        val={`Sales Order ${itemEdit ? `${itemEdit?.sales_order_number}` : ""}`}
        itemEdit={itemEdit}
        mutation={mutation}
        isOpen={true}
        handleClose={handleClose}
        width="max-w-[50rem]!"
      >
        <div className="modal-body">
          <Formik
            initialValues={initVal}
            validationSchema={yupSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              dispatch(setError(false));

              // mutate data
              let data = {
                ...ActivityLogDetails(
                  "sales-order",
                  itemEdit ? "update" : "create",
                  store,
                  { ...values, items },
                ),
                ...values,
                sales_order_discount: Number(values?.sales_order_discount),
                sales_order_paid_amount: Number(
                  values?.sales_order_paid_amount,
                ),
                items,
                itemsDelete,
                installmentItems: isEmptyItem(itemEdit?.installmentItems, []),
              };

              Validations(values, items, dispatch, creditMemoBalance);

              if (!Validations(values, items, dispatch, creditMemoBalance)) {
                mutation.mutate(data);
              } else {
                dispatch(setError(true));
              }
            }}
          >
            {(props) => {
              PropsValues(props, items);

              if (
                Number(props.values.sales_order_customer_id) ===
                Number(isEmptyItem(cutomer?.customer_aid, 0))
              ) {
                props.values.sales_order_payment_terms =
                  "due on receipt - due on the same day the sales order";
              }

              return (
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative ">
                      <InputText
                        label="Order Date"
                        type="date"
                        name="sales_order_date"
                        disabled={mutation.isPending}
                      />
                    </div>

                    <div className="relative ">
                      <InputSelectFilterTagArray
                        label="Customer"
                        defaultValue={{
                          id: isEmptyItem(
                            itemEdit?.sales_order_customer_id,
                            isEmptyItem(cutomer?.customer_aid, 0),
                          ),
                          label: isEmptyItem(
                            itemEdit?.sales_order_customer_name,
                            isEmptyItem(cutomer?.customer_name, ""),
                          ),
                          value: isEmptyItem(
                            itemEdit?.sales_order_customer_name,
                            isEmptyItem(cutomer?.customer_name, ""),
                          ),
                        }}
                        onChange={(e) => {
                          props.setFieldValue(
                            "sales_order_customer_id",
                            e?.id ?? "",
                          );
                          props.setFieldValue(
                            "sales_order_customer_name",
                            e?.value ?? "",
                          );
                          setSelectedCustomerId(e?.id ?? "");
                          return e;
                        }}
                        itemEdit={itemEdit}
                        path={`customer/read-all-by-active`}
                        testFilterId="sales_order_customer_id"
                        store={store}
                      />
                    </div>
                    <div className="relative">
                      <InputSelectArrayWithOptions
                        label="Payment Method"
                        type="text"
                        name="sales_order_payment_method"
                        defaultValue="cash"
                        options={paymentMethodOptions}
                        onChange={(e) => {
                          const previousMethod =
                            props.values.sales_order_payment_method;
                          const selectedMethod =
                            e.target.options[e.target.selectedIndex].text;

                          props.setFieldValue(
                            "sales_order_payment_method",
                            selectedMethod,
                          );
                          let orderTotal = Number(
                            props.values.sales_order_total_receivable_amount,
                          );

                          if (selectedMethod === "credit memo") {
                            props.setFieldValue(
                              "sales_order_credit_memo",
                              orderTotal > 0
                                ? Math.min(creditMemoBalance, orderTotal)
                                : creditMemoBalance,
                            );
                          } else if (previousMethod === "credit memo") {
                            props.setFieldValue("sales_order_credit_memo", 0);
                            props.setFieldValue("sales_order_paid_amount", 0);
                          }

                          return e;
                        }}
                      />
                    </div>

                    {Number(props.values.sales_order_customer_id) ===
                    Number(isEmptyItem(cutomer?.customer_aid, 0)) ? (
                      <div className="relative ">
                        <InputText
                          label="Payment Terms"
                          name="sales_order_payment_terms"
                          disabled={mutation.isPending}
                          readOnly
                          className="capitalize cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <InputSelectArrayWithOptions
                          label="Payment Terms"
                          type="text"
                          name="sales_order_payment_terms"
                          options={PaymentTermsList()}
                          onChange={(e) => {
                            props.setFieldValue(
                              "sales_order_payment_terms",
                              e.target.options[e.target.selectedIndex].text,
                            );
                            return e;
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex my-7 justify-between items-center">
                    <label htmlFor="">Order Items</label>
                    <button
                      type="button"
                      className=" cursor-pointer flex items-center justify-center text-dark gap-2 px-3 py-1.5 bg-transparent rounded-md border-gray-300 border min-w-20 hover:bg-primary transition-all duration-300 ease-in-out hover:text-light dark:text-light"
                      onClick={handleAddItem}
                    >
                      <Plus size={15} />
                      <span className="capitalize leading-0">Add Item</span>
                    </button>
                  </div>

                  <div className="border shadow border-gray-300 rounded-lg dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
                    {items.length === 0 ? (
                      <div className="h-20 flex items-center justify-center ">
                        <p>No Items added yet.</p>
                      </div>
                    ) : (
                      <>
                        <div className="relative overflow-auto w-full h-full min-h-80 dark:bg-gray-900! ">
                          <table className="shadow-none! ">
                            <thead
                              className={`relative z-50 table-header-group`}
                            >
                              <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! ">
                                <th className="w-px dark:bg-gray-900! bg-gray-100!">
                                  #
                                </th>
                                <th
                                  className={`min-w-40  dark:bg-gray-900! bg-gray-100!`}
                                >
                                  Products
                                </th>
                                <th
                                  className={` dark:bg-gray-900! bg-gray-100!`}
                                >
                                  Quantity
                                </th>
                                <th
                                  className={`min-w-30! dark:bg-gray-900! bg-gray-100! text-right`}
                                >
                                  Price per pc.
                                </th>
                                <th
                                  className={` dark:bg-gray-900! bg-gray-100! text-right`}
                                >
                                  Total
                                </th>
                                <th
                                  className={` dark:bg-gray-900! bg-gray-100! `}
                                ></th>
                              </tr>
                            </thead>
                            <tbody className="">
                              {items.map((a, index) => {
                                return (
                                  <tr key={a?.id} className="border-0!">
                                    <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                                      {index + 1}.
                                    </td>
                                    {Number(
                                      isEmptyItem(a?.sales_order_aid, 0),
                                    ) !== 0 ? (
                                      <td className=" dark:bg-gray-900! ">
                                        {a?.sales_order_product_name} (
                                        {a?.current_qty} qty)
                                      </td>
                                    ) : (
                                      <td className=" dark:bg-gray-900! ">
                                        <InputSalesOrderSelectTagArray
                                          onChange={(e, selectedItem) => {
                                            handleChange(
                                              index,
                                              selectedItem,
                                              "sales_order_product_id",
                                              "sales_order_product_name",
                                            );
                                          }}
                                          dataVal={items}
                                          item={a}
                                          path={`products/read-all-product-that-have-stock`}
                                          testFilterId="sales_order_product_name"
                                          store={store}
                                          className={" "}
                                        />
                                      </td>
                                    )}

                                    <td className=" dark:bg-gray-900! ">
                                      <input
                                        onChange={(e) => {
                                          handleChangeAmount(
                                            index,
                                            a?.sales_order_aid,
                                            "sales_order_qty",
                                            e.target.value,
                                          );
                                        }}
                                        className="mt-0 bg-white  dark:bg-gray-900!"
                                        defaultValue={isEmptyItem(
                                          a["sales_order_qty"],
                                          1,
                                        )}
                                        type="number"
                                        placeholder="Qty"
                                      />
                                    </td>
                                    <td className=" dark:bg-gray-900! ">
                                      <AmountWithPesoSign
                                        classN="size-3"
                                        amount={a["sales_order_price"]}
                                      />
                                    </td>
                                    <td className=" dark:bg-gray-900! ">
                                      <AmountWithPesoSign
                                        classN="size-3"
                                        amount={a["sales_order_total"]}
                                      />
                                    </td>
                                    <td className=" dark:bg-gray-900! ">
                                      <button
                                        onClick={() => handleRemoveItem(a)}
                                        className="text-red-500 text-xl"
                                        type="button"
                                      >
                                        ✕
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="my-5 px-4 border shadow border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 w-full transition-all duration-300 ease-in-out py-3 ">
                    <h2 className="text-sm mb-2">Payment Details</h2>
                    <div
                      className={` grid-cols-4 grid mt-3 gap-3 items-end mb-3`}
                    >
                      <div className="relative ">
                        <InputSelectArrayWithOptions
                          label="Type of discount"
                          type="sales_order_discount_type"
                          name="sales_order_discount_type"
                          defaultValue=""
                          options={discountTypeOption()}
                          onChange={(e) => {
                            props.setFieldValue(
                              "sales_order_discount_percentage",
                              "",
                            );
                            props.setFieldValue("sales_order_discount", "");
                            props.setFieldValue(
                              "sales_order_discount_type",
                              e.target.id,
                            );
                            return e;
                          }}
                          required={false}
                        />
                      </div>
                      {props.values.sales_order_discount_type ===
                      "percentage" ? (
                        <div className="relative ">
                          <InputNumber
                            label="Discount %"
                            name="sales_order_discount_percentage"
                            placeholder={`${itemEdit ? "0" : "0"}`}
                            disabled={mutation.isPending}
                            required={false}
                          />
                        </div>
                      ) : (
                        <div className="relative ">
                          <InputNumber
                            label="Discount"
                            name="sales_order_discount"
                            placeholder={`${itemEdit ? "0" : "0"}`}
                            disabled={mutation.isPending}
                            required={false}
                          />
                        </div>
                      )}
                      <div className="relative ">
                        <InputSelectArrayWithOptions
                          label="VAT"
                          type="sales_order_tax"
                          name="sales_order_tax"
                          defaultValue=""
                          options={taxOption()}
                          onChange={(e) => {
                            props.setFieldValue("sales_order_tax", e.target.id);
                            return e;
                          }}
                          required={false}
                        />
                      </div>

                      {props.values.sales_order_payment_method !==
                        "mutiple payment" &&
                      props.values.sales_order_payment_method !==
                        "credit memo" ? (
                        <div className="relative ">
                          <InputNumber
                            label="Amount Paid"
                            name="sales_order_paid_amount"
                            placeholder={`${itemEdit ? "0" : "0"}`}
                            disabled={mutation.isPending}
                            required={false}
                          />
                        </div>
                      ) : (
                        <div className="relative ">
                          <InputText
                            label="Total Paid"
                            type="number"
                            name="sales_order_paid_amount"
                            readOnly
                            className="border-t-0! border-x-0! text-primary min-w-20 focus:border-secondary"
                            disabled={mutation.isPending}
                          />
                        </div>
                      )}
                    </div>
                    {props.values.sales_order_payment_method ===
                      "mutiple payment" ||
                    props.values.sales_order_payment_method ===
                      "credit memo" ? (
                      <>
                        <div
                          className={`${creditMemoBalance > 0 ? "grid-cols-4 " : "grid-cols-3 "} grid gap-3 pb-2 overflow-auto `}
                        >
                          <div className="relative ">
                            <InputText
                              label="Cash amount"
                              type="number"
                              name="sales_order_cash"
                              disabled={mutation.isPending}
                            />
                          </div>
                          <div className="relative ">
                            <InputText
                              label="Check amount"
                              type="number"
                              name="sales_order_check"
                              disabled={mutation.isPending}
                            />
                          </div>
                          <div className="relative ">
                            <InputText
                              label="Online transaction amount"
                              type="number"
                              name="sales_order_online_transaction"
                              disabled={mutation.isPending}
                            />
                          </div>
                          {creditMemoBalance > 0 ? (
                            <div className="relative ">
                              <InputText
                                label="Credit memo"
                                type="number"
                                name="sales_order_credit_memo"
                                disabled={mutation.isPending}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  {!itemEdit &&
                  props.values.sales_order_payment_terms?.toLocaleLowerCase() ===
                    "installment" ? (
                    <>
                      <div className="my-5 px-4 border shadow border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 w-full transition-all duration-300 ease-in-out py-3 ">
                        <h2 className="text-sm mb-2">Installment Details</h2>
                        <div className="flex gap-3  pb-2 overflow-auto">
                          <div className="relative">
                            <InputSelectArrayWithOptions
                              label={`Type of installment`}
                              type="text"
                              name="sales_order_installment_type"
                              defaultValue="monthly"
                              options={InstallmentType()}
                              onChange={(e) => {
                                props.setFieldValue(
                                  "sales_order_installment_type_day",
                                  "",
                                );
                                props.setFieldValue(
                                  "sales_order_installment_type",
                                  e.target.options[e.target.selectedIndex].text,
                                );
                                return e;
                              }}
                            />
                          </div>
                          <div className="relative">
                            <InputSelectArrayWithOptions
                              label={`Payment every`}
                              type="text"
                              name="sales_order_installment_type_day"
                              options={InstallmentByType(
                                props.values.sales_order_installment_type,
                              )}
                              onChange={(e) => {
                                props.setFieldValue(
                                  "sales_order_installment_type_day",
                                  e.target.options[e.target.selectedIndex].text,
                                );
                                return e;
                              }}
                            />
                          </div>
                          <div className="relative ">
                            <InputText
                              label="Installment count"
                              type="number"
                              name="sales_order_installment_count"
                              disabled={mutation.isPending}
                            />
                          </div>
                          <div className="relative ">
                            <InputText
                              label="Installment Amount"
                              type="number"
                              name="sales_order_installment_amount"
                              readOnly
                              className="border-t-0! border-x-0! text-primary min-w-20 focus:border-secondary"
                              disabled={mutation.isPending}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : itemEdit &&
                    props.values.sales_order_payment_terms?.toLocaleLowerCase() ===
                      "installment" ? (
                    <div className="my-5 px-4 border shadow border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 w-full transition-all duration-300 ease-in-out py-3 ">
                      <h2 className="text-sm mb-2">Installment Details</h2>
                      <div className="flex justify-between gap-3 pb-2 overflow-auto">
                        <div className="  ">
                          <p className="">Type of installment</p>
                          <div className="flex">
                            {props.values.sales_order_installment_type}
                          </div>
                        </div>
                        <div className="  ">
                          <p className="">Payment every</p>
                          <div className="flex">
                            {props.values.sales_order_installment_type_day}
                          </div>
                        </div>
                        <div className="  ">
                          <p className="">Installment count</p>
                          <div className="flex">
                            {props.values.sales_order_installment_count}
                          </div>
                        </div>
                        <div className="  ">
                          <p className="">Installment Amount</p>
                          <div className="flex">
                            <PhilippinePeso className={`size-3 mr-1 mt-1`} />
                            {props.values.sales_order_installment_amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="grid xs:grid-cols-2 md:grid-cols-3 mt-3 gap-3 items-center">
                    <ul className="grid grid-cols-[5rem_1fr] ">
                      <li>Sub Amount:</li>
                      <li>
                        <AmountsWithPesoSign
                          classN={"size-3"}
                          classAmnt="justify-start!"
                          amount={props.values.subtotal}
                        />
                      </li>
                      <li>Discount:</li>
                      <li>
                        <AmountsWithPesoSign
                          classN={"size-3"}
                          classAmnt="justify-start!"
                          amount={props.values.sales_order_discount}
                        />
                      </li>
                      <li>VAT Amount:</li>
                      <li>
                        <AmountsWithPesoSign
                          classN={"size-3"}
                          classAmnt="justify-start!"
                          amount={props.values.sales_order_tax_amount}
                        />
                      </li>
                    </ul>
                    <ul className="grid grid-cols-[6rem_1fr] ">
                      <li className="font-bold text-primary!">Total Amount:</li>
                      <li>
                        <AmountsWithPesoSign
                          classN={"size-3"}
                          classAmnt="justify-start! font-bold text-primary!"
                          amount={
                            props.values.sales_order_total_receivable_amount
                          }
                        />
                      </li>
                      <li>Paid Amount:</li>
                      <li>
                        <AmountsWithPesoSign
                          classN={"size-3"}
                          classAmnt="justify-start!"
                          amount={props.values.sales_order_paid_amount}
                        />
                      </li>
                      <li>Balance:</li>
                      <li>
                        <AmountsWithPesoSign
                          classN={"size-3"}
                          classAmnt="justify-start!"
                          amount={props.values.sales_order_total_balance_amount}
                        />
                      </li>
                    </ul>
                    <div className="bg-[#F5F5EC] dark:bg-gray-600 w-full place-self-end my-3 p-2">
                      <p className="flex flex-col place-self-end text-primary text-lg text-right">
                        <span className="text-black dark:text-light text-sm">
                          Remaining Balance
                        </span>
                        <AmountWithPesoSign
                          classN=""
                          amount={Number(
                            props?.values?.sales_order_total_balance_amount,
                          )}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-3">
                    <InputTextArea
                      label="Note"
                      type="text"
                      name="sales_order_notes"
                      placeholder={`${itemEdit ? "Update notes" : "Enter notes"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>

                  {Number(ProductOwnerId(store)) > 0 ? (
                    ""
                  ) : (
                    <div className="relative my-3 ">
                      <InputSelectFilterTagArray
                        label="Created by:"
                        defaultValue={{
                          id: isEmptyItem(
                            itemEdit?.sales_order_received_by_id,
                            isEmptyItem(
                              store.credentials?.data?.user_account_aid,
                              0,
                            ),
                          ),
                          label: isEmptyItem(
                            itemEdit?.sales_order_received_by_name,
                            isEmptyItem(store.credentials?.data?.name, ""),
                          ),
                          value: isEmptyItem(
                            itemEdit?.sales_order_received_by_name,
                            isEmptyItem(store.credentials?.data?.name, ""),
                          ),
                        }}
                        onChange={(e) => {
                          props.setFieldValue(
                            "sales_order_received_by_id",
                            isEmptyItem(e?.id, ""),
                          );
                          props.setFieldValue(
                            "sales_order_received_by_name",
                            isEmptyItem(e?.value, ""),
                          );
                          return e;
                        }}
                        itemEdit={itemEdit}
                        path={`product-owner/read-by-product-owner`}
                        testFilterId="sales_order_received_by_id"
                        store={store}
                      />
                    </div>
                  )}

                  {store.error && <MessageError />}
                  <div className="modal-action">
                    <ModalButton
                      disabled={mutation.isPending}
                      loading={mutation.isPending}
                      itemEdit={itemEdit}
                      type="button"
                      handleClose={handleClose}
                    />
                    <ModalButton
                      disabled={
                        mutation.isPending || (!props.dirty && !itemsDirty)
                      }
                      loading={mutation.isPending}
                      itemEdit={itemEdit}
                      type="submit"
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </ModalWrapper>
    </>
  );
};

export default ModalSalesOrders;
