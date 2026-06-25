import ModalButton from "@/components/buttons/ModalButton";
import {
  InputSalesOrderSelectTagArray,
  InputSelectArray,
  InputSelectArrayWithOptions,
  InputSelectCustomerArray,
} from "@/components/inputs/InputSelect";
import { InputNumber, InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import { ActivityLogDetails } from "@/layout/ArrayValue";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { queryData } from "@/services/queryData";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { Plus } from "lucide-react";
import React from "react";
import * as Yup from "yup";

const ModalSalesOrders = ({ itemEdit, cutomer = "" }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [counter, setCounter] = React.useState(0);
  const [installmentCounter, setInstallmentCounter] = React.useState(0);
  const [itemsDelete, setItemsDelete] = React.useState([]);
  const [installmentItemsDelete, setInstallmentItemsDelete] = React.useState(
    [],
  );
  const [installmentItems, setInstallmentItems] = React.useState(
    itemEdit ? itemEdit?.installmentItems : [],
  );
  const [items, setItems] = React.useState(
    itemEdit
      ? itemEdit?.items
      : [
          {
            sales_order_product_id: "",
            sales_order_product_name: "",
            sales_order_product_owner_id: "",
            sales_order_product_owner_name: "",
            sales_order_qty: "1",
            sales_order_price: "",
            sales_order_total: 0,
          },
        ],
  );

  const handleChange = (index, selectedItem = "", fieldId, field) => {
    const updated = [...items];
    if (selectedItem !== "") {
      updated[index]["sales_order_product_owner_id"] =
        selectedItem["products_owner_id"];
      updated[index]["current_qty"] = selectedItem["current_qty"];
      updated[index]["sales_order_product_owner_name"] =
        selectedItem["products_owner_name"];
      updated[index]["sales_order_price"] = selectedItem["products_price"];
      const qty = Number(updated[index]["sales_order_qty"] || 1);
      const price = Number(updated[index]["sales_order_price"] || 0);
      updated[index]["sales_order_total"] = qty * price;
    }
    updated[index][field] = selectedItem["name"];
    updated[index][fieldId] = selectedItem["id"];

    setItems(updated);
  };

  const handleChangeAmount = (index, field, value) => {
    const updated = [...items];

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
        sales_order_price: "",
        sales_order_total: 0,
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

  const handleAddInstallmentItems = () => {
    setInstallmentItems([
      ...installmentItems,
      {
        installmet_payment_aid: 0,
        installmet_payment_code: "sales-order",
        installmet_payment_due_date: store?.credentials?.data?.server_date,
        installmet_payment_code_number: "",
        installmet_payment_code_id: "",
        installmet_payment_amount: "",
        id: installmentCounter,
      },
    ]);
    setInstallmentCounter((prev) => prev + 1);
  };

  const handleRemoveInstallmentItems = (a) => {
    setInstallmentItemsDelete([
      ...installmentItemsDelete,
      {
        installmet_payment_aid: isEmptyItem(a?.installmet_payment_aid, 0),
        id: a.id,
      },
    ]);

    setInstallmentItems((prev) => prev.filter((item) => item.id !== a.id));
  };

  const handleChangeInstallment = (index, field, value) => {
    const updated = [...installmentItems];

    updated[index][field] = value;

    setInstallmentItems(updated);
  };

  const handleClose = () => {
    dispatch(setIsAdd(false));
    dispatch(setError(false));
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
        dispatch(setMessage(data.error));
      }
    },
  });

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
    sales_order_total_payable_amount: isEmptyItem(
      itemEdit?.sales_order_total_payable_amount,
      "0",
    ),
    sales_order_total_balance_amount: isEmptyItem(
      itemEdit?.sales_order_total_balance_amount,
      "0",
    ),
    total: "0",
    validationAmount: false,
  };

  const yupSchema = Yup.object({
    sales_order_date: Yup.string().trim().required("Required"),
    sales_order_customer_id: Yup.string().trim().required("Required"),
    sales_order_paid_amount: Yup.string().trim().required("Required"),
    sales_order_received_by_id: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  let paymentOption = [
    { id: "cash", name: "cash" },
    { id: "check", name: "check" },
    { id: "online transaction", name: "online transaction" },
    { id: "mutiple payment", name: "mutiple payment" },
  ];

  let taxOption = [
    { id: 0, name: "--" },
    { id: 1.12, name: "inclusive" },
    { id: 0.12, name: "exclusive" },
  ];

  return (
    <>
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
              const invalidItem = items.find(
                (item) =>
                  Number(item.current_qty) < Number(item.sales_order_qty),
              );

              if (invalidItem) {
                dispatch(setError(true));
                dispatch(
                  setMessage(
                    `Insufficient stock for ${invalidItem.sales_order_product_name}. Available: ${invalidItem.current_qty}, Requested: ${invalidItem.sales_order_qty}`,
                  ),
                );
                return;
              }

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
                sales_order_installment: installmentItems?.length,
                installmentItems,
                installmentItemsDelete,
                items,
                itemsDelete,
              };
              mutation.mutate(data);
            }}
          >
            {(props) => {
              props.values.sales_order_total_amount = items?.reduce(
                (sum, item) =>
                  sum +
                  Number(item.sales_order_qty || 1) *
                    Number(item.sales_order_price || 0),
                0,
              );
              props.values.sales_order_total_payable_amount =
                items?.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.sales_order_qty || 1) *
                      Number(item.sales_order_price || 0),
                  0,
                ) - Number(props.values.sales_order_discount);

              // COMPUTATION OF INCLUSIVE TAX
              if (Number(props.values.sales_order_tax) === 1.12) {
                props.values.sales_order_tax_amount =
                  Number(props.values.sales_order_total_payable_amount) -
                  Number(props.values.sales_order_total_payable_amount) / 1.12;
              }

              // COMPUTATION OF EXCLUSIVE TAX
              if (Number(props.values.sales_order_tax) === 0.12) {
                props.values.sales_order_tax_amount =
                  Number(props.values.sales_order_total_payable_amount) * 0.12;

                props.values.sales_order_total_payable_amount =
                  Number(props.values.sales_order_total_payable_amount) +
                  Number(props.values.sales_order_tax_amount);
              }

              if (Number(props.values.sales_order_tax) === 0) {
                props.values.sales_order_tax_amount = 0;
              }
              props.values.sales_order_total_balance_amount =
                Number(props.values.sales_order_total_payable_amount) -
                Number(props.values.sales_order_paid_amount);

              props.values.total =
                installmentItems?.reduce(
                  (isum, itemIns) =>
                    isum + Number(itemIns.installmet_payment_amount),
                  0,
                ) + Number(props.values.sales_order_paid_amount);
              props.values.validationAmount =
                Number(props.values.total) >=
                Number(props.values.sales_order_total_payable_amount);
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
                    <div className="relative">
                      <InputSelectCustomerArray
                        label="Customer"
                        path="customer/read-all-by-active"
                        type="text"
                        name="sales_order_customer_id"
                        onChange={(e) => {
                          props.values.sales_order_customer_id = e.target.value;
                          props.values.sales_order_customer_name =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                      />
                    </div>
                    <div className="relative">
                      <InputSelectArrayWithOptions
                        label="Payment Method"
                        type="text"
                        name="sales_order_payment_method"
                        defaultValue="cash"
                        options={paymentOption}
                        onChange={(e) => {
                          props.values.sales_order_payment_method =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                      />
                    </div>
                    <div className="relative ">
                      <InputNumber
                        label="Discount"
                        name="sales_order_discount"
                        placeholder={`${itemEdit ? "0" : "0"}`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
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

                  <div className="border shadow border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
                    {items.length === 0 ? (
                      <div className="h-20 flex items-center justify-center ">
                        <p>No Items added yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col pb-2 mb-3  ">
                        <ul className="grid grid-cols-[10rem_5rem_7rem_7rem_1rem] sm:grid-cols-[1fr_5rem_7rem_7rem_1rem] gap-2 px-3 p-3 text-dark bg-gray-100">
                          <li>Products</li>
                          <li>Quantity</li>
                          <li className="text-right">Price per pc.</li>
                          <li className="text-center">Total</li>
                        </ul>
                        {items.map((a, index) => {
                          return (
                            <div
                              key={index}
                              className="grid grid-cols-[10rem_5rem_7rem_7rem_1rem] sm:grid-cols-[1fr_5rem_7rem_7rem_1rem] gap-1 items-center px-3 py-1"
                            >
                              <InputSalesOrderSelectTagArray
                                onChange={(e, selectedItem) => {
                                  handleChange(
                                    index,
                                    selectedItem,
                                    "sales_order_product_id",
                                    "sales_order_product_name",
                                  );
                                }}
                                item={a}
                                path={`products/read-all-product-that-have-stock`}
                                testFilterId="sales_order_product_name"
                              />
                              <input
                                onChange={(e) => {
                                  handleChangeAmount(
                                    index,
                                    "sales_order_qty",
                                    e.target.value,
                                    0,
                                  );
                                }}
                                className="mt-0"
                                defaultValue={isEmptyItem(
                                  a["sales_order_qty"],
                                  1,
                                )}
                                type="number"
                                placeholder="Qty"
                              />

                              <span className="font-semibold text-black dark:text-light mr-2">
                                <AmountWithPesoSign
                                  classN="size-3"
                                  amount={a["sales_order_price"]}
                                />
                              </span>
                              <span className="font-semibold text-black dark:text-light mr-2">
                                <AmountWithPesoSign
                                  classN="size-3"
                                  amount={a["sales_order_total"]}
                                />
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(a, index)}
                                className="text-red-500 text-xl"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative mt-3">
                      <InputSelectArrayWithOptions
                        label="Tax"
                        type="sales_order_tax"
                        name="sales_order_tax"
                        defaultValue="--"
                        options={taxOption}
                        onChange={(e) => {
                          props.values.sales_order_tax = e.target.id;
                          return e;
                        }}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputNumber
                        label="Amount Paid"
                        name="sales_order_paid_amount"
                        placeholder={`${itemEdit ? "0" : "0"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div></div>
                    <div className="bg-[#F5F5EC] dark:bg-gray-600 w-full place-self-end my-3 p-2">
                      <p className="flex flex-col place-self-end text-primary text-lg text-right">
                        <span className="text-black dark:text-light text-sm">
                          Total
                        </span>
                        <AmountWithPesoSign
                          classN=""
                          amount={Number(
                            props?.values?.sales_order_total_payable_amount,
                          )}
                        />
                      </p>
                    </div>
                  </div>

                  <div className="flex my-5 justify-between items-center">
                    <label htmlFor="">
                      Installment{" "}
                      {installmentItems?.length > 0
                        ? `(${installmentItems?.length})`
                        : ""}
                    </label>
                    <button
                      type="button"
                      className=" cursor-pointer flex items-center justify-center text-dark gap-2 px-3 py-1.5 bg-transparent rounded-md border-gray-300 border min-w-20 hover:bg-primary transition-all duration-300 ease-in-out hover:text-light dark:text-light"
                      onClick={handleAddInstallmentItems}
                    >
                      <Plus size={15} />
                      <span className="capitalize leading-0">Installment</span>
                    </button>
                  </div>

                  {installmentItems.length === 0 ? (
                    <hr className="border-gray-200" />
                  ) : (
                    <div className="border shadow border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out py-3 ">
                      <div className="flex flex-col pb-2 h-57 overflow-auto">
                        <ul className=" grid grid-cols-[10rem_1fr_1rem] sm:grid-cols-[1fr_1fr_1rem] gap-3 px-3 text-dark sticky top-0 bg-gray-100 py-2">
                          <li>Due Date</li>
                          <li>Amount</li>
                        </ul>
                        {installmentItems.map((a, index) => {
                          return (
                            <div
                              key={index}
                              className="grid grid-cols-[10rem_1fr_1rem] sm:grid-cols-[1fr_1fr_1rem] gap-3 items-center px-3 py-2"
                            >
                              <input
                                onChange={(e) => {
                                  handleChangeInstallment(
                                    index,
                                    "installmet_payment_due_date",
                                    e.target.value,
                                    0,
                                  );
                                }}
                                defaultValue={isEmptyItem(
                                  a["installmet_payment_due_date"],
                                  1,
                                )}
                                type="date"
                              />
                              <input
                                onChange={(e) => {
                                  handleChangeInstallment(
                                    index,
                                    "installmet_payment_amount",
                                    e.target.value,
                                    0,
                                  );
                                }}
                                defaultValue={isEmptyItem(
                                  a["installmet_payment_amount"],
                                  1,
                                )}
                                placeholder="0"
                                type="number"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveInstallmentItems(a, index)
                                }
                                className="text-red-500 text-xl"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                        <div className="px-3 mt-2 text-dark ">
                          <ul className="sm:grid grid-cols-2 ">
                            <li className="sm:text-right mx-2 uppercase">
                              Total installment amount
                            </li>
                            <li className="text-left! mx-2 ">
                              <AmountWithPesoSign
                                classN="size-3 "
                                classAmnt="justify-start! "
                                amount={
                                  Number(props.values.total) -
                                  Number(props.values.sales_order_paid_amount)
                                }
                              />
                            </li>
                            <li className="sm:text-right mx-2 uppercase">
                              Total Paid
                            </li>
                            <li className="text-left! mx-2 ">
                              <AmountWithPesoSign
                                classN="size-3 "
                                classAmnt="justify-start! "
                                amount={props.values.sales_order_paid_amount}
                              />
                            </li>
                            <li
                              className={`${props.values.validationAmount ? "" : " text-red-800 "} sm:text-right mx-2 uppercase `}
                            >
                              Total
                            </li>
                            <li
                              className={`text-left! mx-2 sm:flex justify-between `}
                            >
                              <div
                                className={`${props.values.validationAmount ? "" : " text-red-800 "} `}
                              >
                                <AmountWithPesoSign
                                  classN="size-3 "
                                  classAmnt="justify-start! "
                                  amount={props.values.total}
                                />
                              </div>
                              <div className="sm:flex ">
                                <span className=" mr-4 uppercase ">
                                  Total Amount
                                </span>
                                <AmountWithPesoSign
                                  classN="size-3 "
                                  classAmnt="justify-start! "
                                  amount={
                                    props?.values
                                      ?.sales_order_total_payable_amount
                                  }
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

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

                  <div className="relative my-3 ">
                    <InputSelectArray
                      label="Received by:"
                      path="product-owner/read-by-product-owner"
                      type="text"
                      name="sales_order_received_by_id"
                      onChange={(e) => {
                        props.values.sales_order_received_by_id =
                          e.target.value;
                        props.values.sales_order_received_by_name =
                          e.target.options[e.target.selectedIndex].text;
                        return e;
                      }}
                    />
                  </div>

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
                      disabled={mutation.isPending}
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
