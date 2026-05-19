import ModalButton from "@/components/buttons/ModalButton";
import {
  InputSelectArray,
  InputSelectArrayWithOptions,
  InputSelectTagArray,
} from "@/components/inputs/InputSelect";
import { InputNumber, InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { Plus } from "lucide-react";
import React from "react";
import * as Yup from "yup";

const ModalSalesOrders = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [counter, setCounter] = React.useState(0);
  const [items, setItems] = React.useState(
    itemEdit
      ? itemEdit?.items
      : [
          {
            sales_order_product_id: "",
            sales_order_product_name: "",
            sales_order_product_owner_id: "",
            sales_order_product_owner_name: "",
            sales_order_qty: "",
            sales_order_price: "",
            sales_order_total: 0,
          },
        ],
  );

  const handleChange = (
    index,
    selectedItem = "",
    field,
    fieldId,
    value,
    id,
  ) => {
    const updated = [...items];
    if (selectedItem !== "") {
      updated[index]["sales_order_product_owner_id"] =
        selectedItem["products_owner_id"];
      updated[index]["sales_order_product_owner_name"] =
        selectedItem["products_owner_name"];
      updated[index]["sales_order_price"] = selectedItem["products_price"];
      const qty = Number(updated[index]["sales_order_qty"] || 0);
      const price = Number(updated[index]["sales_order_price"] || 0);
      updated[index]["total_amount"] = qty * price;
    }
    updated[index][field] = value;
    updated[index][fieldId] = id;

    setItems(updated);
  };

  const handleChangeAmount = (index, field, value) => {
    const updated = [...items];

    updated[index][field] = value;

    // compute row total
    const qty = Number(updated[index]["sales_order_qty"] || 0);
    const price = Number(updated[index]["sales_order_price"] || 0);

    updated[index]["total_amount"] = qty * price;

    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        sales_order_product_id: "",
        sales_order_product_name: "",
        sales_order_product_owner_id: "",
        sales_order_product_owner_name: "",
        sales_order_qty: "",
        sales_order_price: "",
        sales_order_total: 0,
        id: counter,
      },
    ]);
    setCounter((prev) => prev + 1);
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/users/${itemEdit?.id}`
          : `${apiVersion}/users`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });

      if (data.success) {
        dispatch(setIsAdd(false));
        dispatch(setSuccess(true));
        dispatch(setMessage(successMsg));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const initVal = {
    sales_order_date: isEmptyItem(itemEdit?.sales_order_date, ""),
    sales_order_customer_id: isEmptyItem(itemEdit?.sales_order_customer_id, ""),
    sales_order_customer_name: isEmptyItem(
      itemEdit?.sales_order_customer_name,
      "",
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
    sales_order_qty: isEmptyItem(itemEdit?.sales_order_qty, ""),
    sales_order_price: isEmptyItem(itemEdit?.sales_order_price, ""),
    sales_order_total: isEmptyItem(itemEdit?.sales_order_total, ""),
    sales_order_discount: isEmptyItem(itemEdit?.sales_order_discount, ""),
    sales_order_tax: isEmptyItem(itemEdit?.sales_order_tax, ""),
    sales_order_paid_amount: isEmptyItem(itemEdit?.sales_order_paid_amount, ""),
    sales_order_notes: isEmptyItem(itemEdit?.sales_order_notes, ""),
    sales_order_received_by_id: isEmptyItem(
      itemEdit?.sales_order_received_by_id,
      "",
    ),
    sales_order_received_by_name: isEmptyItem(
      itemEdit?.sales_order_received_by_name,
      "",
    ),
    sales_order_product_owner_id: isEmptyItem(
      itemEdit?.sales_order_product_owner_id,
      "",
    ),
    sales_order_product_owner_name: isEmptyItem(
      itemEdit?.sales_order_product_owner_name,
      "",
    ),
    sales_order_installment: isEmptyItem(itemEdit?.sales_order_installment, ""),
    sales_order_due_date: isEmptyItem(itemEdit?.sales_order_due_date, ""),
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
    { id: "0", name: "cash" },
    { id: "1", name: "check" },
    { id: "2", name: "online transaction" },
    { id: "3", name: "mutiple payment" },
  ];
  return (
    <>
      <ModalWrapper
        val="Sales Order"
        itemEdit={itemEdit}
        mutation={mutation}
        isOpen={true}
        handleClose={handleClose}
      >
        <div className="modal-body">
          <Formik
            initialValues={initVal}
            validationSchema={yupSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              dispatch(setError(false));
              // mutate data
              console.log({ ...values, items });
              // mutation.mutate({ ...values, items });
            }}
          >
            {(props) => {
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
                      <InputSelectArray
                        label="Customer"
                        path="product-owner/read-by-product-owner"
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
                            e.target.value;
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

                  <div className="flex my-7 justify-between">
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
                      <div className="flex flex-col">
                        <ul className="hidden md:grid grid-cols-[1fr_1fr_0.6fr_0.5fr_1rem] px-3 mt-2 text-dark">
                          <li>Products</li>
                          <li>Quantity</li>
                          <li className="text-right">Price per pc.</li>
                        </ul>
                        {items.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="grid grid-cols-2 md:grid md:grid-cols-[1fr_1fr_0.6fr_0.5fr_1rem] gap-3 items-center p-3 mt-1"
                            >
                              <InputSelectTagArray
                                onChange={(e, selectedItem) => {
                                  handleChange(
                                    index,
                                    selectedItem,
                                    "sales_order_product_id",
                                    "sales_order_product_name",
                                    e.target.value,
                                    e.target.options[e.target.selectedIndex]
                                      .text,
                                  );
                                }}
                                defaultValue={
                                  items[index]["sales_order_product_id"]
                                }
                                path={`products/read-all-active-by-product`}
                                placeholder="Product Name"
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
                                defaultValue={items[index]["sales_order_qty"]}
                                type="number"
                                placeholder="Qty"
                              />

                              <span className="font-semibold text-black dark:text-light mr-2">
                                <AmountWithPesoSign
                                  classN="size-3"
                                  amount={items[index]["sales_order_price"]}
                                />
                              </span>
                              <span className="font-semibold text-black dark:text-light mr-2">
                                <AmountWithPesoSign
                                  classN="size-3"
                                  amount={items[index]["total_amount"]}
                                />
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
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
                      <InputNumber
                        label="Tax (₱)"
                        name="sales_order_tax"
                        placeholder={`${itemEdit ? "0" : "0"}`}
                        disabled={mutation.isPending}
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
                    <div className="relative mt-3">
                      <InputNumber
                        label="Installment Count"
                        name="sales_order_installment"
                        placeholder={`${itemEdit ? "0" : "0"}`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="First due date"
                        type="date"
                        name="sales_order_date"
                        placeholder={`${itemEdit ? "0" : "0"}`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                    <div></div>

                    <div className="bg-[#F5F5EC] dark:bg-gray-600 w-full place-self-end my-3 p-2">
                      <p className="flex flex-col place-self-end text-primary text-lg text-right">
                        <span className="text-black dark:text-light text-sm">
                          Total
                        </span>
                        <AmountWithPesoSign
                          classN="size-5"
                          amount={items.reduce(
                            (sum, item) =>
                              sum +
                              Number(item.sales_order_qty || 0) *
                                Number(item.sales_order_price || 0),
                            0,
                          )}
                        />
                      </p>
                    </div>
                  </div>

                  <div className="relative">
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
