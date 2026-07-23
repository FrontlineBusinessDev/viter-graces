import ModalButton from "@/components/buttons/ModalButton";
import {
  DefaultInputSelectTagArray,
  InputSalesOrderSelectTagArray,
} from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
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
import { Validations } from "./functions";

const ModalPurchaseOrderMovement = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [isSelected, setIsSelected] = React.useState(false);
  const [itemsDelete, setItemsDelete] = React.useState([]);
  const [counter, setCounter] = React.useState(1);

  const [items, setItems] = React.useState(
    itemEdit
      ? itemEdit?.items
      : [
          {
            id: 0,
            purchase_order_transfer_from_id: "",
            purchase_order_qty: "",
            purchase_order_product_owner_id: "",
            purchase_order_product_owner_name: "",
            allData: [],
          },
        ],
  );

  const handleClose = () => {
    sessionStorage.removeItem("quickAdd");
    dispatch(setIsAdd(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit`${apiVersion}/purchase-order-movement`,
        "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["purchase-order-movement"] });

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
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        purchase_order_ai: 0,
        purchase_order_transfer_from_id: "",
        purchase_order_qty: "",
        purchase_order_product_owner_id: "",
        purchase_order_product_owner_name: "",
        id: counter,
      },
    ]);
    setCounter((prev) => prev + 1);
  };

  const handleChangeItem = (index, field, fieldId, id, value) => {
    const updated = [...items];

    updated[index][fieldId] = id;
    updated[index][field] = value;

    setItems(updated);
  };

  const handleRemoveItem = (a) => {
    setItemsDelete([
      ...itemsDelete,
      {
        purchase_order_ai: isEmptyItem(a?.purchase_order_ai, 0),
        id: a.id,
      },
    ]);

    setItems((prev) => prev.filter((item) => item.id !== a.id));
  };

  const handleChange = (index, selectedItem = "", fieldId, field) => {
    const updated = [...items];
    if (selectedItem === null || selectedItem === "") {
      updated[index]["purchase_order_transfer_from_id"] = "";
      updated[index]["purchase_order_qty"] = "";
      updated[index]["purchase_order_product_owner_id"] = "";
      updated[index]["purchase_order_product_owner_name"] = "";
      updated[index][field] = "";
      updated[index][fieldId] = "";
      updated[index]["allData"] = [];
    } else {
      updated[index]["purchase_order_transfer_from_id"] =
        selectedItem["purchase_order_aid"];
      updated[index]["purchase_order_qty"] = selectedItem["purchase_order_qty"];
      updated[index]["purchase_order_product_owner_id"] =
        selectedItem["purchase_order_product_owner_id"];
      updated[index]["purchase_order_product_owner_name"] =
        selectedItem["purchase_order_product_owner_name"];
      updated[index][field] = selectedItem["name"];
      updated[index][fieldId] = selectedItem["id"];
      updated[index]["allData"] = selectedItem;
    }
    setItems(updated);
  };

  const initVal = {
    purchase_order_date: isEmptyItem(
      itemEdit?.purchase_order_date,
      store?.credentials?.data?.server_date,
    ),
    purchase_order_transfer_note: isEmptyItem(
      itemEdit?.purchase_order_transfer_note,
      "",
    ),
  };

  const yupSchema = Yup.object({
    purchase_order_date: Yup.string().trim().required("Required"),
    purchase_order_transfer_note: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapper
        label="Transfer Supply"
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

              const data = {
                ...values,
                items: items || [],
                ...ActivityLogDetails(
                  "purchase-order-movement",
                  itemEdit ? "update" : "create",
                  store,
                  {
                    ...values,
                    items: items || [],
                  },
                ),
              };

              Validations(values, items, dispatch);

              if (!Validations(values, items, dispatch)) {
                console.log(data);
                // mutation.mutate(data);
              } else {
                dispatch(setError(true));
              }
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="flex mb-7 justify-between items-end">
                    <div className="relative ">
                      <InputText
                        label="Date"
                        type="date"
                        name="purchase_order_date"
                        disabled={mutation.isPending}
                      />
                    </div>
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
                                  Items
                                </th>
                                <th
                                  className={`min-w-40  dark:bg-gray-900! bg-gray-100!`}
                                >
                                  Product owner
                                </th>
                                <th
                                  className={` dark:bg-gray-900! bg-gray-100!`}
                                >
                                  Quantity
                                </th>
                                <th
                                  className={`min-w-30! dark:bg-gray-900! bg-gray-100! text-right`}
                                >
                                  Tranfer qty
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
                                      isEmptyItem(a?.purchase_order_ai, 0),
                                    ) !== 0 ? (
                                      <td className=" dark:bg-gray-900! ">
                                        {a?.purchase_order_product_name} (
                                        {a?.purchase_order_qty} qty)
                                      </td>
                                    ) : (
                                      <td className=" dark:bg-gray-900! ">
                                        <InputSalesOrderSelectTagArray
                                          onChange={(e, selectedItem) => {
                                            handleChange(
                                              index,
                                              selectedItem,
                                              "purchase_order_product_id",
                                              "purchase_order_product_name",
                                            );
                                          }}
                                          dataVal={items}
                                          item={a}
                                          path={`purchase-order-movement/read-all-active-data`}
                                          testFilterId="purchase_order_product_name"
                                          store={store}
                                          className={" "}
                                        />
                                      </td>
                                    )}
                                    <td className=" dark:bg-gray-900! ">
                                      <DefaultInputSelectTagArray
                                        onChange={(e) => {
                                          handleChangeItem(
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
                                        testFilterId="sales_order_product_name"
                                        store={store}
                                      />
                                    </td>
                                    <td className=" dark:bg-gray-900! ">
                                      {a?.purchase_order_qty}
                                    </td>
                                    <td className=" dark:bg-gray-900! ">
                                      <input
                                        onChange={(e) => {
                                          handleChangeItem(
                                            index,
                                            "current_order_qty",
                                            "current_order_qty",
                                            e.target.value,
                                            e.target.value,
                                          );
                                        }}
                                        className="mt-0 bg-white  dark:bg-gray-900!"
                                        type="number"
                                        placeholder="Qty"
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

                  <div className="relative mt-5">
                    <InputTextArea
                      label="Note"
                      type="text"
                      name="purchase_order_transfer_note"
                      placeholder={`${itemEdit ? "Update notes" : "Enter notes"}`}
                      disabled={mutation.isPending}
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

export default ModalPurchaseOrderMovement;
