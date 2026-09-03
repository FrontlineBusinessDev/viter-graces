import ModalButton from "@/components/buttons/ModalButton";
import {
  DefaultInputSelectTagArray,
  InputSelect,
} from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { AmountWithPesoSign, PesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import { ActivityLogDetails, RefundMethodList } from "@/layout/ArrayValue";
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
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { PhilippinePeso } from "lucide-react";
import React from "react";
import * as Yup from "yup";
import { Validations } from "./functions";

const ModalReturns = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [isSelected, setIsSelected] = React.useState(false);

  const initialReturnStateRef = React.useRef(null);
  if (initialReturnStateRef.current === null) {
    initialReturnStateRef.current = {
      selectedItems: JSON.parse(JSON.stringify(selectedItems)),
      isSelected,
    };
  }

  const itemsDirty =
    JSON.stringify(selectedItems) !==
      JSON.stringify(initialReturnStateRef.current.selectedItems) ||
    isSelected !== initialReturnStateRef.current.isSelected;

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
        itemEdit
          ? `${apiVersion}/returns-products/${itemEdit?.id}`
          : `${apiVersion}/returns-products`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["returns-products"] });

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
    return_product_date: isEmptyItem(
      itemEdit?.return_product_date,
      store?.credentials?.data?.server_date,
    ),
    return_product_reason: isEmptyItem(
      itemEdit?.return_product_reason,
      "other",
    ),
    return_product_notes: isEmptyItem(itemEdit?.return_product_notes, ""),
    return_product_is_restocked: isEmptyItem(
      itemEdit?.return_product_is_restocked,
      "",
    ),
    return_product_status: isEmptyItem(
      itemEdit?.return_product_status,
      "pending",
    ),
    return_product_resolution_type: isEmptyItem(
      itemEdit?.return_product_resolution_type,
      "other",
    ),
    return_product_refund_method: isEmptyItem(
      itemEdit?.return_product_refund_method,
      "",
    ),
    return_product_paid_amount: isEmptyItem(
      itemEdit?.return_product_paid_amount,
      "",
    ),
    other_reason: isEmptyItem(itemEdit?.return_product_reason, ""),
  };

  const yupSchema = Yup.object({
    return_product_date: Yup.string().trim().required("Required"),
    return_product_reason: Yup.string().trim().required("Required"),
    return_product_resolution_type: Yup.string().trim().required("Required"),
    return_product_notes: Yup.string().trim().required("Required"),
    other_reason: Yup.string().trim().required("Required"),
    return_product_refund_method: Yup.string().when(
      "return_product_resolution_type",
      {
        is: "refund",
        then: (schema) => schema.trim().required("Required"),
        otherwise: (schema) => schema.notRequired(),
      },
    ),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapper
        val="Process Returns"
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
                selectedItems: selectedItems || [],
                return_product_is_restocked: isSelected ? "yes" : "no",
                ...ActivityLogDetails(
                  "returns-products",
                  itemEdit ? "update" : "create",
                  store,
                  {
                    ...values,
                    selectedItems: selectedItems || [],
                    return_product_is_restocked: isSelected ? "yes" : "no",
                  },
                ),
              };

              Validations(values, selectedItems, dispatch);

              if (!Validations(values, selectedItems, dispatch)) {
                // console.log(data);
                mutation.mutate(data);
              } else {
                dispatch(setError(true));
              }
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative ">
                      <InputText
                        label="Return Date"
                        type="date"
                        name="return_product_date"
                        disabled={mutation.isPending}
                      />
                    </div>

                    <div className="relative">
                      <InputSelect
                        label="Resolution Types"
                        type="text"
                        name="return_product_resolution_type"
                        disabled={mutation.isPending}
                        onChange={(e) => {
                          props.values.return_product_resolution_type =
                            e.target.value;
                          if (e.target.value === "replacement") {
                            props.setFieldValue(
                              "return_product_reason",
                              "other",
                            );
                          }
                        }}
                      >
                        <optgroup label={`Select Resolution Types`}>
                          <option value="" hidden>
                            --
                          </option>
                          <option value="refund">Refund</option>
                          <option value="credit memo">Credit Memo</option>
                          <option value="replacement">Replacement</option>
                        </optgroup>
                      </InputSelect>
                    </div>

                    <div className="relative">
                      <InputSelect
                        label="Refund Method"
                        type="text"
                        name="return_product_refund_method"
                        disabled={mutation.isPending}
                      >
                        <optgroup label={`Select Refund Method`}>
                          <option value="" hidden>
                            --
                          </option>
                          {RefundMethodList().map((item, key) => (
                            <option key={key} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </optgroup>
                      </InputSelect>
                    </div>

                    <div className="relative">
                      <InputSelect
                        label="Return Reason"
                        type="text"
                        name="return_product_reason"
                        onChange={(e) => {
                          props.values.other_reason = e.target.value;
                          if (e.target.value === "other") {
                            props.values.other_reason = "";
                          }
                        }}
                        disabled={mutation.isPending}
                      >
                        <optgroup label={`Select Return Reason`}>
                          <option value="" hidden>
                            --
                          </option>
                          <option value="damage">Damage</option>
                          <option value="expired">Expired</option>
                          <option value="other">Other</option>
                        </optgroup>
                      </InputSelect>
                    </div>
                    {props.values.return_product_reason === "other" ? (
                      <div className="relative ">
                        <InputText
                          label="Other Reason"
                          type="text"
                          name="other_reason"
                          disabled={mutation.isPending}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="relative mt-3">
                    <label htmlFor="">Linked Order *</label>
                    <DefaultInputSelectTagArray
                      onChange={(e) => {
                        setSelectedItems(
                          e.items.map((i) => ({
                            ...i,
                            selected: false,
                            qty: 0,
                            total: 0,
                          })),
                        );
                      }}
                      path={`sales-order/read-all-sales-order`}
                      testFilterId="sales_order_product_name"
                      store={store}
                    />

                    {selectedItems?.length > 0 && (
                      <div className="relative">
                        <p className="text-xs font-medium mt-3 mb-1">
                          Select Items to Return
                        </p>
                        <div className=" border border-gray-300 rounded-xl p-4 bg-gray-50 dark:bg-dark-mode">
                          {selectedItems.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between mb-2"
                            >
                              {/* Toggle */}
                              <div className="flex items-center gap-3">
                                {/* Toggle Switch */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...selectedItems];
                                    updated[index].selected =
                                      !updated[index].selected;
                                    setSelectedItems(updated);
                                  }}
                                  className={`w-11 h-5.5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                                    item.selected
                                      ? "bg-green-600"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                                      item.selected
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  ></div>
                                </button>

                                <span className="flex items-center text-sm">
                                  {item.sales_order_product_name} (
                                  <PhilippinePeso className={`size-3 mr-px`} />
                                  {numberWithCommasToFixed(
                                    item.sales_order_price,
                                    4,
                                  )}
                                  )
                                </span>
                              </div>

                              {/* Ordered + Qty */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 dark:text-light">
                                  Ordered: {item.sales_order_qty}
                                </span>

                                {item.selected && (
                                  <div className="flex gap-1 ">
                                    <input
                                      type="number"
                                      min={0}
                                      max={item.ordered}
                                      value={item.qty}
                                      onChange={(e) => {
                                        const updated = [...selectedItems];
                                        updated[index].qty = e.target.value;
                                        updated[index].total =
                                          Number(
                                            updated[index]?.sales_order_price,
                                          ) * Number(updated[index]?.qty);
                                        setSelectedItems(updated);
                                      }}
                                      className="w-16 h-7 border rounded px-2 py-1 text-sm mt-0"
                                      placeholder="pcs"
                                    />
                                    {/* <p className="content-end mb-0">.pcs</p> */}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className=" "></div>
                    <div className="bg-[#F5F5EC] dark:bg-gray-600 w-full place-self-end my-5 p-2">
                      <p className="flex flex-col place-self-end text-primary text-lg text-right">
                        <span className="text-black dark:text-light text-sm">
                          <span className="capitalize">
                            {props.values.return_product_resolution_type}
                          </span>{" "}
                          Amount
                        </span>
                        <AmountWithPesoSign
                          classN="size-5"
                          amount={selectedItems?.reduce(
                            (sum, item) =>
                              Number(sum) +
                              Number(item.qty || 0) *
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
                      name="return_product_notes"
                      placeholder={`${itemEdit ? "Update notes" : "Enter notes"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  {props.values.return_product_reason === "other" ? (
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setIsSelected((prev) => !prev)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                          isSelected ? "bg-green-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                            isSelected ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className="text-black text-sm dark:text-light">
                        Restock returned items
                      </span>
                    </div>
                  ) : (
                    ""
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

export default ModalReturns;
