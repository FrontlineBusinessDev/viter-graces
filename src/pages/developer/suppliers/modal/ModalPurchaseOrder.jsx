import ModalButton from "@/components/buttons/ModalButton";
import {
  InputSelectArray,
  InputSelectPaymentArray,
  InputSelectStatusArray,
  InputSelectTagArray,
} from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { AmountWithPesoSign, PesoSign } from "@/components/PesoSign";
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

const ModalPurchaseOrder = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState([
    {
      purchase_order_product_id: "",
      purchase_order_product_name: "",
      purchase_order_product_owner_id: "",
      purchase_order_product_owner_name: "",
      purchase_order_qty: "",
      purchase_order_price: "",
      purchase_order_total_amount: 0,
    },
  ]);
  const [counter, setCounter] = React.useState(0);

  const handleChange = (index, field, fieldId, value, id) => {
    const updated = [...items];

    updated[index][field] = value;
    updated[index][fieldId] = id;

    setItems(updated);
  };

  const handleChangeAmount = (index, field, value) => {
    const updated = [...items];

    updated[index][field] = value;

    // compute row total
    const qty = Number(updated[index]["purchase_order_qty"] || 0);
    const price = Number(updated[index]["purchase_order_price"] || 0);

    updated[index]["purchase_order_total_amount"] = qty * price;

    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        purchase_order_product_id: "",
        purchase_order_product_name: "",
        purchase_order_product_owner_id: "",
        purchase_order_product_owner_name: "",
        purchase_order_qty: "",
        purchase_order_price: "",
        purchase_order_total_amount: "",
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
          ? `${apiVersion}/purchase-order/${itemEdit?.id}`
          : `${apiVersion}/purchase-order`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] });

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
    purchase_order_aid: isEmptyItem(itemEdit?.purchase_order_aid, ""),
    purchase_order_number: isEmptyItem(itemEdit?.purchase_order_number, ""),
    purchase_order_supplier_id: isEmptyItem(
      itemEdit?.purchase_order_supplier_id,
      "",
    ),
    purchase_order_supplier_name: isEmptyItem(
      itemEdit?.purchase_order_supplier_name,
      "",
    ),
    purchase_order_date: isEmptyItem(
      itemEdit?.purchase_order_date,
      store?.credentials?.data?.server_date,
    ),
    purchase_order_expected_delivery: isEmptyItem(
      itemEdit?.purchase_order_expected_delivery,
      store?.credentials?.data?.server_date,
    ),
    purchase_order_total_amount: isEmptyItem(itemEdit?.total_amount, ""),
    purchase_order_payment: isEmptyItem(itemEdit?.total_paid, "0"),
    purchase_order_status: isEmptyItem(
      itemEdit?.purchase_order_status,
      "draft",
    ),
    purchase_order_payment_status: isEmptyItem(
      itemEdit?.purchase_order_payment_status,
      "draft",
    ),
    purchase_order_note: isEmptyItem(itemEdit?.purchase_order_note, ""),

    purchase_order_number_old: isEmptyItem(itemEdit?.purchase_order_number, ""),
  };

  const yupSchema = Yup.object({
    purchase_order_number: Yup.string().trim().required("Required"),
    purchase_order_supplier_id: Yup.string().trim().required("Required"),
    purchase_order_date: Yup.string().trim().required("Required"),
    purchase_order_expected_delivery: Yup.string().trim().required("Required"),
    purchase_order_status: Yup.string().trim().required("Required"),
    purchase_order_payment_status: Yup.string().trim().required("Required"),
    purchase_order_payment: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapper
        val="Purchase Order"
        itemEdit={itemEdit}
        mutation={mutation}
        isOpen={true}
        handleClose={handleClose}
        width="max-w-[40rem]!"
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
                  "purchase order",
                  itemEdit ? "update" : "create",
                  store,
                  { ...values, purchase_order: items },
                ),
                ...values,
                purchase_order: items,
              };

              mutation.mutate(data);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <InputText
                        label="PO Number"
                        type="text"
                        name="purchase_order_number"
                        placeholder={`${itemEdit ? "Update PO number" : "Enter new PO number"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative">
                      <InputSelectArray
                        label="Suppliers"
                        type="text"
                        path="suppliers/read-in-modal"
                        name="purchase_order_supplier_id"
                        onChange={(e) => {
                          props.values.purchase_order_supplier_id =
                            e.target.value;
                          props.values.purchase_order_supplier_name =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                      />
                    </div>

                    <div className="relative ">
                      <InputText
                        label="Order Date"
                        type="date"
                        name="purchase_order_date"
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative">
                      <InputText
                        label="Expected Delivery"
                        type="date"
                        name="purchase_order_expected_delivery"
                        disabled={mutation.isPending}
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
                        <ul className="grid grid-cols-[1fr_1fr_5rem_5rem_5rem_1rem]  gap-1 items-center p-3 mt-1">
                          <li>Products</li>
                          <li>Product Owner</li>
                          <li>Quantity</li>
                          <li>Price per pc.</li>
                          <li> </li>
                          <li> </li>
                        </ul>
                        {items.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr_1fr_5rem_5rem_5rem_1rem] gap-1 items-center px-3 pb-3 mt-1"
                            >
                              <InputSelectTagArray
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "purchase_order_product_id",
                                    "purchase_order_product_name",
                                    e.target.value,
                                    e.target.options[e.target.selectedIndex]
                                      .text,
                                  )
                                }
                                path={`suppliers-product/read-in-modal/${Number(props.values.purchase_order_supplier_id)}`}
                                placeholder="Product"
                              />
                              <InputSelectTagArray
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "purchase_order_product_owner_id",
                                    "purchase_order_product_owner_name",
                                    e.target.value,
                                    e.target.options[e.target.selectedIndex]
                                      .text,
                                  )
                                }
                                path={`product-owner/read-by-product-owner`}
                                placeholder="Product"
                              />
                              <input
                                onChange={(e) => {
                                  handleChangeAmount(
                                    index,
                                    "purchase_order_qty",
                                    e.target.value,
                                    0,
                                  );
                                }}
                                type="number"
                                placeholder="Qty"
                              />
                              <input
                                onChange={(e) => {
                                  handleChangeAmount(
                                    index,
                                    "purchase_order_price",
                                    e.target.value,
                                    0,
                                  );
                                }}
                                type="number"
                                placeholder="Price"
                              />
                              <span className="font-semibold text-black dark:text-light mr-2">
                                <AmountWithPesoSign
                                  classN="size-3"
                                  amount={
                                    items[index]["purchase_order_total_amount"]
                                  }
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
                    <div className="relative capitalize mt-3">
                      <InputSelectStatusArray
                        label="Status"
                        type="text"
                        name="purchase_order_status"
                        onChange={(e) => {
                          props.values.purchase_order_status =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                      />
                    </div>
                    <div className="relative capitalize mt-3">
                      <InputSelectPaymentArray
                        label="Payment Status"
                        type="text"
                        name="purchase_order_payment_status"
                        onChange={(e) => {
                          props.values.purchase_order_payment_status =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items items-center gap-2">
                    <div className="relative">
                      <InputText
                        label="Paid Amount"
                        type="number"
                        name="purchase_order_payment"
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="bg-[#F5F5EC] dark:bg-gray-600 w-full place-self-end my-5 p-2">
                      <p className="flex flex-col place-self-end text-primary text-lg text-right">
                        <span className="text-black dark:text-light text-sm">
                          Total
                        </span>

                        <AmountWithPesoSign
                          classN="size-5"
                          amount={items.reduce(
                            (sum, item) =>
                              sum +
                              Number(item.purchase_order_qty || 0) *
                                Number(item.purchase_order_price || 0),
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
                      name="purchase_order_note"
                      placeholder={`${itemEdit ? "Update notes" : "Enter notes"}`}
                      disabled={mutation.isPending}
                      required={false}
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

export default ModalPurchaseOrder;
