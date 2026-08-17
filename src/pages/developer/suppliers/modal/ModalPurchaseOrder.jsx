import ModalButton from "@/components/buttons/ModalButton";
import {
  DefaultInputSelectTagArray,
  InputSelectArrayWithOptions,
  InputSelectFilterTagArray,
  ProductOwnerInputSelectTagArray,
} from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { Amount, AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import { ActivityLogDetails, taxOption } from "@/layout/ArrayValue";
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
import { PropsValues } from "./functions";

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

  const [counter, setCounter] = React.useState(1);

  const handleChangeProduct = (index, itemVal, selectedItem, props) => {
    const updated = [...items];

    // console.log("selectedItem", selectedItem);

    if (itemVal === null || itemVal === "") {
      updated[index]["purchase_order_price"] = "";
      updated[index]["suppliers_delivery"] = "";
      updated[index]["purchase_order_product_name"] = "";
      updated[index]["purchase_order_product_id"] = "";
      updated[index]["purchase_order_total_amount"] = 0;
    } else {
      updated[index]["purchase_order_price"] = selectedItem?.amount;
      updated[index]["suppliers_delivery"] = props?.suppliers_delivery;
      updated[index]["purchase_order_product_name"] = selectedItem?.name;
      updated[index]["purchase_order_product_id"] = selectedItem?.id;

      // compute row total
      const qty = Number(updated[index]["purchase_order_qty"] || 1);
      const price = Number(updated[index]["purchase_order_price"] || 0);

      updated[index]["purchase_order_total_amount"] = qty * price;
    }
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
    sessionStorage.removeItem("quickAdd");
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

  console.log("items", items);

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
    purchase_order_transact_id: store.credentials?.data?.user_account_aid,
    purchase_order_transact_name: store.credentials?.data?.name,
    purchase_order_tax: isEmptyItem(itemEdit?.purchase_order_tax, "0"),
    purchase_order_balance: isEmptyItem(itemEdit?.purchase_order_balance, "0"),
    purchase_order_discount: isEmptyItem(
      itemEdit?.purchase_order_discount,
      "0",
    ),
    purchase_order_payment: isEmptyItem(itemEdit?.purchase_order_payment, "0"),
    total_amount: 0,
    total_sub_amount: 0,
    total_amount_without_discount_and_vat: 0,
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
    purchase_order_percent_tax: isEmptyItem(
      itemEdit?.purchase_order_percent_tax,
      "",
    ),
  };

  const yupSchema = Yup.object({
    purchase_order_supplier_id: Yup.string().trim().required("Required"),
    purchase_order_date: Yup.string().trim().required("Required"),
    purchase_order_payment_status: Yup.string().trim().required("Required"),
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

  // console.log("items", items);
  return (
    <>
      <ModalWrapper
        val={
          itemEdit
            ? `${
                itemEdit
                  ? `${
                      itemEdit.purchase_order_supplier_name
                    } (${itemEdit?.purchase_order_number})`
                  : ""
              }`
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

              const isHaveEmptyProduct = items.some(
                (item) => !Number(item?.purchase_order_product_id),
              );

              if (isHaveEmptyProduct) {
                dispatch(setError(true));
                dispatch(setMessage("You have empty product field."));
                return;
              }
              const isHaveEmptyProductOwner = items.some(
                (item) => !Number(item?.purchase_order_product_owner_id),
              );

              if (isHaveEmptyProductOwner) {
                dispatch(setError(true));
                dispatch(setMessage("You have empty product owner field."));
                return;
              }

              const combinations = new Set();

              const hasDuplicateCombination = items.some((item) => {
                const productId = Number(item?.purchase_order_product_id);

                const ownerId = Number(item?.purchase_order_product_owner_id);

                const combinationKey = `${productId}-${ownerId}`;

                if (combinations.has(combinationKey)) {
                  return true;
                }

                combinations.add(combinationKey);

                return false;
              });

              if (hasDuplicateCombination) {
                dispatch(setError(true));
                dispatch(
                  setMessage(
                    "The same product and product owner cannot be selected more than once.",
                  ),
                );
                return;
              }
              let data = {
                ...ActivityLogDetails(
                  "purchase order",
                  itemEdit ? "update" : "create",
                  store,
                  {
                    ...values,
                    purchase_order: items,
                  },
                ),
                ...values,
                purchase_order: items,
                itemsDelete: itemsDelete,
                purchase_order_payment: Number(values?.purchase_order_payment),
                isHaveNotDelivered: items.filter(
                  (a) => !a.purchase_order_delivery_is_status,
                )?.length,
                order_total_amount: items.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.purchase_order_qty || 0) *
                      Number(item.purchase_order_price || 0),
                  0,
                ),
              };

              mutation.mutate(data);
            }}
          >
            {(props) => {
              PropsValues(props, items);

              return (
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    {itemEdit ? (
                      ""
                    ) : (
                      <div className="relative z-50">
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
                    )}

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

                  <div className="border shadow  border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
                    {items.length === 0 ? (
                      <div className="h-20 flex items-center justify-center ">
                        <p>No Items added yet.</p>
                      </div>
                    ) : (
                      <div className="relative overflow-auto w-full h-full min-h-80 max-h-80 bg-gray-100 dark:bg-gray-900! ">
                        <table className="shadow-none! ">
                          <thead className={`relative z-20 table-header-group`}>
                            <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0!">
                              <th className="w-px bg-gray-100! dark:bg-gray-900!">
                                #
                              </th>
                              <th
                                className={`min-w-20  dark:bg-gray-900! bg-gray-100!`}
                              >
                                Products
                              </th>
                              <th className={` dark:bg-gray-900! bg-gray-100!`}>
                                Product Owner
                              </th>
                              <th className={` dark:bg-gray-900! bg-gray-100!`}>
                                Quantity
                              </th>
                              <th className={` dark:bg-gray-900! bg-gray-100!`}>
                                Amount
                              </th>
                              <th
                                className={` dark:bg-gray-900! bg-gray-100! text-center`}
                              >
                                Total
                              </th>
                              <th
                                className={` dark:bg-gray-900! bg-gray-100! `}
                              ></th>
                            </tr>
                          </thead>
                          <tbody className=" ">
                            {items.map((a, index) => {
                              return (
                                <tr key={index} className="border-0!">
                                  <td className="text-center dark:bg-gray-900! bg-gray-100! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                                    {index + 1}.
                                  </td>
                                  {Number(
                                    isEmptyItem(a?.purchase_order_aid, 0),
                                  ) !== 0 ? (
                                    <td className=" bg-gray-100! dark:bg-gray-900!">
                                      {a?.purchase_order_product_name}
                                    </td>
                                  ) : (
                                    <td className=" bg-gray-100! dark:bg-gray-900! ">
                                      <ProductOwnerInputSelectTagArray
                                        onChange={(e, selectedItem) => {
                                          handleChangeProduct(
                                            index,
                                            e,
                                            selectedItem,
                                            props.values,
                                          );
                                        }}
                                        dataVal={items}
                                        item={a}
                                        path={`suppliers-product/read-in-modal/${Number(props.values.purchase_order_supplier_id)}`}
                                        testFilterId="sales_order_product_name"
                                        store={store}
                                      />
                                    </td>
                                  )}
                                  <td className=" bg-gray-100! min-w-25 dark:bg-gray-900!">
                                    <ProductOwnerInputSelectTagArray
                                      onChange={(e) => {
                                        handleChange(
                                          index,
                                          "purchase_order_product_owner_id",
                                          "purchase_order_product_owner_name",
                                          e.id,
                                          e.value,
                                        );
                                      }}
                                      dataVal={items}
                                      item={a}
                                      path={`product-owner/read-by-product-owner`}
                                      testFilterId="purchase_order_product_owner_name"
                                      store={store}
                                      defaultValue={
                                        Number(
                                          isEmptyItem(a?.purchase_order_aid, 0),
                                        ) !== 0
                                          ? [
                                              {
                                                id: a.purchase_order_product_owner_id,
                                                value:
                                                  a.purchase_order_product_owner_name,
                                                label: `${a.purchase_order_product_owner_name}`,
                                              },
                                            ]
                                          : ""
                                      }
                                    />
                                  </td>
                                  <td className=" bg-gray-100! dark:bg-gray-900! ">
                                    <input
                                      onChange={(e) => {
                                        handleChangeAmount(
                                          index,
                                          "purchase_order_qty",
                                          e.target.value,
                                        );
                                      }}
                                      className="mt-0! bg-white dark:bg-gray-900!"
                                      defaultValue={a["purchase_order_qty"]}
                                      type="number"
                                      placeholder="Qty"
                                    />
                                  </td>
                                  <td className=" bg-gray-100! dark:bg-gray-900! ">
                                    <input
                                      onChange={(e) => {
                                        handleChangeAmount(
                                          index,
                                          "purchase_order_price",
                                          e.target.value,
                                          0,
                                        );
                                      }}
                                      className="mt-0! bg-white  dark:bg-gray-900!"
                                      defaultValue={a?.purchase_order_price}
                                      type="number"
                                      placeholder="Price"
                                    />
                                  </td>
                                  <td className=" bg-gray-100! dark:bg-gray-900! ">
                                    <AmountWithPesoSign
                                      classN="size-3"
                                      amount={a["purchase_order_total_amount"]}
                                    />
                                  </td>
                                  <td className=" bg-gray-100! dark:bg-gray-900! ">
                                    {itemEdit ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleDeliveryStatus(
                                              index,
                                              "purchase_order_delivery_is_status",
                                              !a.purchase_order_delivery_is_status,
                                            )
                                          }
                                          className={`text-white ${!a.purchase_order_delivery_is_status ? " bg-gray-500 " : "bg-green-800 "} rounded-sm p-1 text-[10px] mr-3`}
                                          type="button"
                                        >
                                          {!a.purchase_order_delivery_is_status
                                            ? "Not Delivered"
                                            : "Delivered"}
                                        </button>
                                        {Number(
                                          isEmptyItem(a?.purchase_order_aid, 0),
                                        ) === 0 ? (
                                          <button
                                            onClick={() => handleRemoveItem(a)}
                                            className="text-red-500 text-xl "
                                            type="button"
                                          >
                                            ✕
                                          </button>
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => handleRemoveItem(a)}
                                        className="text-red-500 text-xl "
                                        type="button"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                          if (e.target.value === "unpaid") {
                            props.values.purchase_order_payment = "0";
                          } else {
                            props.values.purchase_order_payment = "";
                          }
                          props.values.purchase_order_payment_status =
                            e.target.value;
                          return e;
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items items-center gap-2">
                    <div className="relative mt-3 ">
                      <InputSelectArrayWithOptions
                        label="VAT"
                        type="purchase_order_percent_tax"
                        name="purchase_order_percent_tax"
                        defaultValue="--"
                        options={taxOption()}
                        onChange={(e) => {
                          props.values.purchase_order_percent_tax = e.target.id;
                          return e;
                        }}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Discount Amount"
                        type="number"
                        name="purchase_order_discount"
                        // placeholder="0"
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                    {props.values.purchase_order_payment_status === "paid" ? (
                      <div className="w-full place-self-end my-5 p-2">
                        <p className="flex flex-col place-self-end text-primary mb-0 text-lg text-right">
                          <span className="text-black dark:text-light text-sm">
                            Amount Paid
                          </span>

                          <AmountWithPesoSign
                            classN="size-5"
                            amount={Number(props.values.total_amount)}
                          />
                        </p>
                      </div>
                    ) : (
                      <div className="relative mt-3">
                        <InputText
                          label="Paid Amount"
                          type="number"
                          name="purchase_order_payment"
                          // placeholder="0"
                          disabled={mutation.isPending}
                          required={false}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 items-end gap-2 mt-3">
                    <ul className="grid grid-cols-2  text-xs!">
                      <li className="text-right text-black dark:text-light">
                        Sub Amount:
                      </li>
                      <li className="place-self-end text-right">
                        <Amount
                          classAmnt="text-xs! "
                          amount={Number(props.values.total_sub_amount)}
                        />
                      </li>
                      <li className="text-right text-black dark:text-light ">
                        Discount Amount:
                      </li>
                      <li className="place-self-end text-right">
                        <Amount
                          classAmnt="text-xs! "
                          amount={Number(props.values.purchase_order_discount)}
                        />
                      </li>
                      <li className="text-right text-black dark:text-light ">
                        VAT Amount:
                      </li>
                      <li className="place-self-end text-right">
                        <Amount
                          classAmnt="text-xs! "
                          amount={Number(props.values.purchase_order_tax)}
                        />
                      </li>
                    </ul>
                    <div className="bg-[#F5F5EC] dark:bg-gray-600 w-full place-self-end p-2">
                      <p className="flex flex-col place-self-end text-primary text-lg text-right">
                        <span className="text-black dark:text-light text-sm">
                          Total Amount
                        </span>

                        <AmountWithPesoSign
                          classN="size-5"
                          amount={Number(props.values.total_amount)}
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
