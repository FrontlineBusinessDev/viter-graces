import ModalButton from "@/components/buttons/ModalButton";
import {
  InputPurchaseOrderSelectTagArray,
  InputSelectArray,
  InputSelectArrayWithOptions,
  InputSelectFilterTagArray,
  InputSelectTagArray,
} from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
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

const ModalPurchaseOrder = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState(
    itemEdit
      ? itemEdit?.items
      : [
          {
            purchase_order_aid: "0",
            purchase_order_product_id: "",
            purchase_order_product_name: "",
            purchase_order_product_owner_id: "",
            purchase_order_product_owner_name: "",
            purchase_order_qty: "1",
            purchase_order_price: "",
            suppliers_delivery: "monday",
            purchase_order_delivery_is_status: true,
            purchase_order_total_amount: 0,
            id: 0,
          },
        ],
  );
  const [itemsDelete, setItemsDelete] = React.useState([]);

  const [counter, setCounter] = React.useState(0);

  const handleChangeProduct = (
    index,
    itemVal,
    field,
    fieldId,
    fieldPrice,
    value,
    id,
  ) => {
    const updated = [...items];

    updated[index][fieldPrice] = itemVal?.amount;
    updated[index]["suppliers_delivery"] = itemVal?.suppliers_delivery;
    updated[index][field] = value;
    updated[index][fieldId] = id;

    // compute row total
    const qty = Number(updated[index]["purchase_order_qty"] || 1);
    const price = Number(updated[index]["purchase_order_price"] || 0);

    updated[index]["purchase_order_total_amount"] = qty * price;

    setItems(updated);
  };
  const handleChange = (index, field, fieldId, value, id) => {
    const updated = [...items];

    updated[index][field] = value;
    updated[index][fieldId] = id;

    setItems(updated);
  };

  const handleDeliveryStatus = (index, field, value) => {
    const updated = [...items];

    updated[index][field] = value;

    setItems(updated);
  };

  const handleChangeAmount = (index, field, value) => {
    const updated = [...items];

    updated[index][field] = value;

    // compute row total
    const qty = Number(updated[index]["purchase_order_qty"] || 1);
    const price = Number(updated[index]["purchase_order_price"] || 0);

    updated[index]["purchase_order_total_amount"] = qty * price;

    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        purchase_order_aid: "0",
        purchase_order_product_id: "",
        purchase_order_product_name: "",
        purchase_order_product_owner_id: "",
        purchase_order_product_owner_name: "",
        purchase_order_qty: "1",
        purchase_order_price: "",
        suppliers_delivery: "monday",
        purchase_order_total_amount: "",
        purchase_order_delivery_is_status: true,
        id: counter,
      },
    ]);
    setCounter((prev) => prev + 1);
  };

  const handleRemoveItem = (a) => {
    setItemsDelete([
      ...itemsDelete,
      {
        purchase_order_aid: isEmptyItem(a?.purchase_order_aid, 0),
        id: a.id,
      },
    ]);

    setItems((prev) => prev.filter((item) => Number(item.id) !== Number(a.id)));
  };

  const handleClose = () => {
    dispatch(setIsAdd(false));
    dispatch(setError(false));
    queryClient.invalidateQueries({ queryKey: ["purchase-order"] });
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
    purchase_order_total_amount: isEmptyItem(
      itemEdit?.purchase_order_total_amount,
      "",
    ),
    purchase_order_payment: isEmptyItem(itemEdit?.purchase_order_payment, ""),
    purchase_order_status: isEmptyItem(
      itemEdit?.purchase_order_status,
      "draft",
    ),
    purchase_order_payment_status: isEmptyItem(
      itemEdit?.purchase_order_payment_status,
      "unpaid",
    ),
    purchase_order_note: isEmptyItem(itemEdit?.purchase_order_note, ""),
    suppliers_delivery: isEmptyItem(itemEdit?.suppliers_delivery, "monday"),

    purchase_order_number_old: isEmptyItem(itemEdit?.purchase_order_number, ""),
  };

  const yupSchema = Yup.object({
    purchase_order_supplier_id: Yup.string().trim().required("Required"),
    purchase_order_date: Yup.string().trim().required("Required"),
    purchase_order_payment_status: Yup.string().trim().required("Required"),
    purchase_order_payment: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  let purchaseOrderStatusOption = [
    { id: "draft", name: "Draft" },
    { id: "open", name: "Open" },
    { id: "partial", name: "Partial" },
    { id: "completed", name: "Completed" },
    { id: "cancelled", name: "Cancelled" },
  ];

  let paymentOption = [
    { id: "unpaid", name: "Unpaid" },
    { id: "partially paid", name: "Partially Paid" },
    { id: "paid", name: "Paid" },
  ];

  return (
    <>
      <ModalWrapper
        val={
          itemEdit
            ? `${itemEdit ? itemEdit?.purchase_order_number : ""}`
            : "Purchase Order"
        }
        itemEdit={itemEdit}
        mutation={mutation}
        isOpen={true}
        handleClose={handleClose}
        width="max-w-[60rem]!"
      >
        <div className="modal-body">
          <Formik
            initialValues={initVal}
            validationSchema={yupSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              dispatch(setError(false));

              const isHaveEmptyProduct = items.filter(
                (a) => Number(a?.purchase_order_product_id) === 0,
              )?.length;

              if (isHaveEmptyProduct > 0) {
                dispatch(setError(true));
                dispatch(setMessage("You have empty product field."));
                return;
              } else {
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
                  itemsDelete: itemsDelete,
                  isHaveNotDelivered: items.filter(
                    (a) => !a.purchase_order_delivery_is_status,
                  )?.length,
                };

                mutation.mutate(data);
              }
            }}
          >
            {(props) => {
              if (props.values.purchase_order_payment_status === "paid") {
                props.values.purchase_order_payment = items.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.purchase_order_qty || 0) *
                      Number(item.purchase_order_price || 0),
                  0,
                );
              }

              return (
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative ">
                      <InputSelectFilterTagArray
                        label="Supplier"
                        onChange={(e, selectedItem) => {
                          props.setFieldValue(
                            "purchase_order_supplier_id",
                            e.id,
                          );
                          props.setFieldValue(
                            "purchase_order_supplier_name",
                            e.value,
                          );
                          props.setFieldValue(
                            "suppliers_delivery",
                            selectedItem?.suppliers_delivery,
                          );

                          return e;
                        }}
                        itemEdit={itemEdit}
                        path={`suppliers/read-in-modal`}
                        testFilterId="purchase_order_supplier_id"
                        store={store}
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
                  </div>

                  <div className="flex my-7 items-center justify-between">
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
                        <ul className="grid grid-cols-[1fr_1fr_5rem_5rem_10rem_5rem]  gap-1 items-center p-3 mt-1">
                          <li>Products</li>
                          <li>Product Owner</li>
                          <li>Quantity</li>
                          <li>Amount</li>
                          <li className="text-center">Total</li>
                          <li> </li>
                          <li> </li>
                        </ul>
                        {items.map((a, index) => {
                          return (
                            <div
                              key={a.id}
                              className="grid grid-cols-[1fr_1fr_5rem_5rem_10rem_5rem] gap-1 items-center px-3 pb-3 mt-1"
                            >
                              <InputPurchaseOrderSelectTagArray
                                onChange={(e, selectedItem) => {
                                  handleChangeProduct(
                                    index,
                                    selectedItem,
                                    "purchase_order_product_id",
                                    "purchase_order_product_name",
                                    "purchase_order_price",
                                    e.target.value,
                                    e.target.options[e.target.selectedIndex]
                                      .text,
                                  );
                                }}
                                itemEdit={itemEdit}
                                item={a}
                                defaultValue={a["purchase_order_product_id"]}
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
                                itemEdit={itemEdit}
                                defaultValue={
                                  a["purchase_order_product_owner_id"]
                                }
                                path={`product-owner/read-by-product-owner`}
                                placeholder="product owner"
                              />
                              <input
                                onChange={(e) => {
                                  handleChangeAmount(
                                    index,
                                    "purchase_order_qty",
                                    e.target.value,
                                  );
                                }}
                                defaultValue={a["purchase_order_qty"]}
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
                                defaultValue={a["purchase_order_price"]}
                                type="number"
                                placeholder="Price"
                              />
                              <span className="font-semibold text-black dark:text-light mr-2">
                                <AmountWithPesoSign
                                  classN="size-3"
                                  amount={a["purchase_order_total_amount"]}
                                />
                              </span>
                              {itemEdit ? (
                                <button
                                  onClick={() =>
                                    handleDeliveryStatus(
                                      index,
                                      "purchase_order_delivery_is_status",
                                      !a.purchase_order_delivery_is_status,
                                    )
                                  }
                                  className={` text-white ${!a.purchase_order_delivery_is_status ? " bg-gray-500 " : "bg-green-800 "} rounded-sm py-1 text-[10px] mr-3`}
                                  type="button"
                                >
                                  {!a.purchase_order_delivery_is_status
                                    ? "Not Delivered"
                                    : "Delivered"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRemoveItem(a)}
                                  className="text-red-500 text-xl"
                                  type="button"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative capitalize mt-3">
                      <InputSelectArrayWithOptions
                        label="Purchase Order Status"
                        type="text"
                        name="purchase_order_status"
                        defaultValue="draft"
                        options={purchaseOrderStatusOption}
                        onChange={(e) => {
                          props.values.purchase_order_status = e.target.value;
                          return e;
                        }}
                      />
                    </div>
                    <div className="relative capitalize mt-3">
                      <InputSelectArrayWithOptions
                        label="Payment Status"
                        type="text"
                        name="purchase_order_payment_status"
                        defaultValue="unpaid"
                        options={paymentOption}
                        onChange={(e) => {
                          props.values.purchase_order_payment_status =
                            e.target.value;
                          return e;
                        }}
                      />
                    </div>

                    <div className="relative mt-3">
                      <InputText
                        label="Paid Amount"
                        type="number"
                        name="purchase_order_payment"
                        // placeholder="0"
                        disabled={mutation.isPending}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items items-center gap-2">
                    <div className="relative"></div>
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
