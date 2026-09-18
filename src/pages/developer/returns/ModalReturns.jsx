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
  const isEdit = Boolean(itemEdit);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [isSelected, setIsSelected] = React.useState(
    Number(itemEdit?.return_product_is_restocked) === 1,
  );

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

  // Existing returns already filed against the selected order - used to
  // subtract already-returned qty from what's still displayed as available.
  // Rejected returns don't count against the remaining balance. The return
  // being edited is excluded from its own tally so its currently-committed
  // qty doesn't count against the room available to it.
  const selectedOrderNumber = selectedItems?.[0]?.sales_order_number;
  const [returnedQtyByProduct, setReturnedQtyByProduct] = React.useState({});

  React.useEffect(() => {
    if (!selectedOrderNumber) {
      setReturnedQtyByProduct({});
      return;
    }

    let cancelled = false;

    queryData(`${apiVersion}/returns-products/page/1`, "post", {
      searchValue: "",
      columnFilters: [
        { id: "return_product_order_number", value: [selectedOrderNumber] },
      ],
    }).then((result) => {
      if (cancelled) return;

      const map = {};
      (result?.data || [])
        .filter(
          (r) =>
            ["pending", "processed"].includes(r.return_product_status) &&
            r.id !== itemEdit?.id,
        )
        .forEach((r) => {
          const productId = r.return_product_product_id;
          map[productId] =
            (map[productId] || 0) + Number(r.return_product_qty || 0);
        });
      setReturnedQtyByProduct(map);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedOrderNumber, itemEdit?.id]);

  // Update mode: the linked order is fixed (shown as a label, not a picker),
  // so load its item list once to pre-populate the single product this
  // return record is for - reuses the same endpoint/shape the create-mode
  // order picker already fetches (order.items[]).
  React.useEffect(() => {
    if (!itemEdit) return;

    let cancelled = false;

    queryData(`${apiVersion}/sales-order/read-all-sales-order`, "post", {
      searchValue: "",
      columnFilters: [],
    }).then((result) => {
      if (cancelled) return;

      const order = (result?.data || []).find(
        (o) => o.sales_order_number === itemEdit.return_product_order_number,
      );
      const orderItem = order?.items?.find(
        (i) =>
          Number(i.sales_order_product_id) ===
          Number(itemEdit.return_product_product_id),
      );

      const loadedItem = {
        // fallback covers the edge case where the linked order/item can no
        // longer be found (e.g. deleted) - caps qty at the return's own
        // current value instead of blocking the edit entirely
        ...(orderItem || {
          sales_order_number: itemEdit.return_product_order_number,
          sales_order_product_id: itemEdit.return_product_product_id,
          sales_order_product_name: itemEdit.return_product_product_name,
          sales_order_price: itemEdit.return_product_price,
          sales_order_qty: itemEdit.return_product_qty,
        }),
        selected: true,
        qty: Number(itemEdit.return_product_qty),
        total:
          Number(itemEdit.return_product_qty) *
          Number(itemEdit.return_product_price),
      };

      setSelectedItems([loadedItem]);
      initialReturnStateRef.current = {
        selectedItems: JSON.parse(JSON.stringify([loadedItem])),
        isSelected: initialReturnStateRef.current.isSelected,
      };
    });

    return () => {
      cancelled = true;
    };
  }, [itemEdit]);

  // `ordered` here is the net remaining returnable qty for this UI, not the
  // sales order's original qty - the historical sales order row is untouched
  const itemsWithRemaining = React.useMemo(
    () =>
      selectedItems.map((item) => ({
        ...item,
        ordered: Math.max(
          0,
          Number(item.sales_order_qty) -
            Number(returnedQtyByProduct[item.sales_order_product_id] || 0),
        ),
      })),
    [selectedItems, returnedQtyByProduct],
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
    onError: (error) => {
      dispatch(setError(true));
      dispatch(setMessage(error?.message || "Failed to save return."));
    },
  });

  // itemEdit.return_product_date comes pre-formatted for display (e.g. "Sep
  // 08, 2026" from the table's readAll) - a native <input type="date"> only
  // accepts "YYYY-MM-DD" and silently renders blank for anything else, which
  // made the date look empty (and unchangeable) whenever editing a return.
  const editDate = itemEdit?.return_product_date
    ? new Date(itemEdit.return_product_date)
    : null;
  // build the YYYY-MM-DD string from local date parts, not toISOString() -
  // that converts to UTC first and can shift the date back a day depending
  // on the browser's timezone
  const editDateIso =
    editDate && !isNaN(editDate)
      ? `${editDate.getFullYear()}-${String(editDate.getMonth() + 1).padStart(2, "0")}-${String(editDate.getDate()).padStart(2, "0")}`
      : null;

  const initVal = {
    return_product_date: isEmptyItem(
      editDateIso,
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
      "",
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

              // update mode edits a single product row - carry its qty/amount
              // at the top level so update.php's payload fallback picks up
              // the edited value instead of the record's original qty
              const editedItem = selectedItems?.[0];
              const editExtras =
                itemEdit && editedItem
                  ? {
                      return_product_qty: editedItem.qty,
                      return_product_amount:
                        Number(editedItem.qty) *
                        Number(editedItem.sales_order_price || 0),
                    }
                  : {};

              const data = {
                ...values,
                selectedItems: selectedItems || [],
                return_product_is_restocked: isSelected ? "yes" : "no",
                ...editExtras,
                ...ActivityLogDetails(
                  "returns-products",
                  itemEdit ? "update" : "create",
                  store,
                  {
                    ...values,
                    selectedItems: selectedItems || [],
                    return_product_is_restocked: isSelected ? "yes" : "no",
                    ...editExtras,
                  },
                ),
              };

              if (!Validations(values, itemsWithRemaining, dispatch)) {
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
                          if (e.target.value !== "refund") {
                            props.setFieldValue(
                              "return_product_refund_method",
                              "",
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

                    {props.values.return_product_resolution_type ===
                      "refund" && (
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
                    )}

                    <div className="relative">
                      <InputSelect
                        label="Return Reason"
                        type="text"
                        name="return_product_reason"
                        onChange={(e) => {
                          props.values.other_reason = e.target.value;
                          if (e.target.value === "other") {
                            props.values.other_reason = "";
                            setIsSelected(true);
                          } else {
                            setIsSelected(false);
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
                    {props.values.return_product_reason === "other" ||
                    isEdit ? (
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
                    {isEdit ? (
                      <p className="text-sm py-2">
                        {itemEdit.return_product_order_number}
                      </p>
                    ) : (
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
                    )}

                    {selectedItems?.length > 0 && (
                      <div className="relative">
                        <p className="text-xs font-medium mt-3 mb-1">
                          {isEdit ? "Item to Return" : "Select Items to Return"}
                        </p>
                        <div className=" border border-gray-300 rounded-xl p-4 bg-gray-50 dark:bg-dark-mode">
                          {itemsWithRemaining.map((item, index) => (
                            <div
                              key={item.id ?? index}
                              className="flex items-center justify-between mb-2"
                            >
                              <div className="flex items-center gap-3">
                                {!isEdit && (
                                  <button
                                    type="button"
                                    disabled={item.ordered <= 0}
                                    onClick={() => {
                                      const updated = [...selectedItems];
                                      updated[index].selected =
                                        !updated[index].selected;
                                      setSelectedItems(updated);
                                    }}
                                    className={`w-11 h-5.5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                                      item.ordered <= 0
                                        ? "bg-gray-200 cursor-not-allowed"
                                        : item.selected
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
                                )}

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
                                  {item.ordered <= 0
                                    ? "Fully returned"
                                    : `Ordered: ${item.ordered}`}
                                </span>

                                {(isEdit || item.selected) &&
                                  item.ordered > 0 && (
                                    <div className="flex gap-1 ">
                                      <input
                                        type="number"
                                        min={0}
                                        max={item.ordered}
                                        value={item.qty}
                                        onChange={(e) => {
                                          const updated = [...selectedItems];
                                          updated[index].qty = Math.min(
                                            Number(e.target.value) || 0,
                                            item.ordered,
                                          );
                                          updated[index].total =
                                            Number(
                                              updated[index]?.sales_order_price,
                                            ) * Number(updated[index]?.qty);
                                          setSelectedItems(updated);
                                        }}
                                        className="w-16 h-7 border rounded px-2 py-1 text-sm mt-0"
                                        placeholder="pcs"
                                      />
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
                  {props.values.return_product_reason === "other" ||
                  isEdit ? (
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
