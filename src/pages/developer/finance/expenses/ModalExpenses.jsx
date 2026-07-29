import ModalButton from "@/components/buttons/ModalButton";
import {
  DefaultInputSelectTagArray,
  InputSelectArray,
  InputSelectArrayWithOptions,
  InputSelectFilterTagArray,
} from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { apiVersion } from "@/config/config";
import { ActivityLogDetails } from "@/layout/ArrayValue";
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

const ModalExpenses = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState([]);
  const [counter, setCounter] = React.useState(0);

  const handleClose = () => {
    dispatch(setIsAdd(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(`${apiVersion}/finance-expenses`, "post", values),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["finance-expenses"],
      });

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
    purchase_order_supplier_id: "",
    purchase_order_supplier_name: "",
    purchase_order_date: store?.credentials?.data?.server_date,
    purchase_order_expected_delivery: store?.credentials?.data?.server_date,
    purchase_order_total_amount: "",
    purchase_order_transact_id: store?.credentials?.data?.id,
    purchase_order_transact_name: store?.credentials?.data?.name,
    purchase_order_tax: 0,
    purchase_order_balance: 0,
    purchase_order_discount: 0,
    purchase_order_payment: 0,
    total_amount: 0,
    total_sub_amount: 0,
    total_amount_without_discount_and_vat: 0,
    purchase_order_status: "draft",
    purchase_order_payment_status: "paid",
    purchase_order_note: "",
    suppliers_delivery: "monday",
    purchase_order_percent_tax: "",
    purchase_order_product_id: "",
    purchase_order_product_name: "",
    purchase_order_product_owner_id: "",
    purchase_order_product_owner_name: "",
    purchase_order_qty: "1",
    purchase_order_price: 0,
    purchase_order_product_name_other: "",
    purchase_order_delivery_is_status: true,
  };

  const yupSchema = Yup.object({
    purchase_order_date: Yup.string().trim().required("Required"),
    purchase_order_payment_status: Yup.string().trim().required("Required"),
    purchase_order_payment: Yup.string().trim().required("Required"),
    purchase_order_price: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  let paymentOption = [
    { id: "partially paid", name: "Partially Paid" },
    { id: "paid", name: "Paid" },
  ];

  return (
    <>
      <ModalWrapper
        val="Expenses"
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

              let data = {
                ...ActivityLogDetails("purchase order", "create", store, {
                  ...values,
                }),
                ...values,
              };

              // console.log(data);
              mutation.mutate(data);
            }}
          >
            {(props) => {
              if (props.values.purchase_order_payment_status === "paid") {
                props.values.purchase_order_price =
                  props.values.purchase_order_payment;
              }
              if (props.values.purchase_order_product_name !== "other") {
                props.values.purchase_order_product_name_other = "";
              }
              return (
                <Form>
                  <p>
                    Supplier :{" "}
                    <span className="uppercase font-bold">other</span>
                  </p>
                  <div className="relative ">
                    <InputText
                      label="Order Date"
                      type="date"
                      name="purchase_order_date"
                      disabled={mutation.isPending}
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
                        if (e.target.value === "partially paid") {
                          props.setFieldValue("purchase_order_price", "0");
                        }
                        props.setFieldValue(
                          "purchase_order_payment_status",
                          e.target.value,
                        );
                        return e;
                      }}
                    />
                  </div>
                  <div className="relative capitalize mt-3">
                    <DefaultInputSelectTagArray
                      label="Product Owner"
                      onChange={(e) => {
                        props.setFieldValue(
                          "purchase_order_product_owner_id",
                          e.id,
                        );
                        props.setFieldValue(
                          "purchase_order_product_owner_name",
                          e.name,
                        );
                      }}
                      dataVal={items}
                      path={`product-owner/read-by-product-owner`}
                      testFilterId="purchase_order_product_owner_id"
                      store={store}
                    />
                  </div>
                  <div className="relative my-3">
                    <DefaultInputSelectTagArray
                      label="Item"
                      onChange={(e, selectedItem) => {
                        if (selectedItem) {
                          props.setFieldValue(
                            "purchase_order_product_id",
                            isEmptyItem(selectedItem.id, ""),
                          );
                          props.setFieldValue(
                            "purchase_order_product_name",
                            isEmptyItem(selectedItem.name, ""),
                          );
                        } else {
                          props.setFieldValue("purchase_order_product_id", "");
                          props.setFieldValue(
                            "purchase_order_product_name",
                            "",
                          );
                        }
                      }}
                      dataVal={items}
                      path={`suppliers-product/read-other-supplier-modal`}
                      testFilterId="purchase_order_product_id"
                      store={store}
                    />
                  </div>
                  {props?.values?.purchase_order_product_name === "other" ? (
                    <div className="relative mb-3">
                      <InputText
                        label="Other Item"
                        type="text"
                        name="purchase_order_product_name_other"
                        disabled={mutation.isPending}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="relative mb-3">
                    <InputText
                      label="Amount Paid"
                      type="number"
                      number="number"
                      name="purchase_order_payment"
                      disabled={mutation.isPending}
                    />
                  </div>
                  {props?.values?.purchase_order_payment_status ===
                  "partially paid" ? (
                    <div className="relative mb-3">
                      <InputText
                        label="Total Amount"
                        type="number"
                        number="number"
                        name="purchase_order_price"
                        disabled={mutation.isPending}
                      />
                    </div>
                  ) : (
                    ""
                  )}

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

export default ModalExpenses;
