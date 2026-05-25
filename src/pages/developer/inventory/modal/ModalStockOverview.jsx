import ModalButton from "@/components/buttons/ModalButton";
import {
  InputSelectArray,
  InputSelectArrayWithOptions,
} from "@/components/inputs/InputSelect";
import { InputNumber, InputText } from "@/components/inputs/InputText";
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
import React from "react";
import * as Yup from "yup";

const ModalStockOverview = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/stock-movement/${itemEdit?.id}`
          : `${apiVersion}/stock-movement`,
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
        dispatch(setMessage(successMsg));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const initVal = {
    stock_movement_aid: isEmptyItem(itemEdit?.stock_movement_aid, ""),
    stock_movement_type: isEmptyItem(itemEdit?.stock_movement_type, "in stock"),
    stock_movement_status: isEmptyItem(itemEdit?.stock_movement_status, ""),
    stock_movement_product_id: isEmptyItem(
      itemEdit?.stock_movement_product_id,
      "",
    ),
    stock_movement_product_name: isEmptyItem(
      itemEdit?.stock_movement_product_name,
      "",
    ),
    stock_movement_qty: isEmptyItem(itemEdit?.stock_movement_qty, ""),
    stock_movement_location: isEmptyItem(itemEdit?.stock_movement_location, ""),
    stock_movement_product_owner_id: isEmptyItem(
      itemEdit?.stock_movement_product_owner_id,
      "",
    ),
    stock_movement_product_owner_name: isEmptyItem(
      itemEdit?.stock_movement_product_owner_name,
      "",
    ),
    stock_movement_notes: isEmptyItem(itemEdit?.stock_movement_notes, ""),
  };

  const yupSchema = Yup.object({
    stock_movement_product_id: Yup.string().trim().required("Required"),
    stock_movement_qty: Yup.string().trim().required("Required"),
    stock_movement_type: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  let typeOption = [
    { id: "0", name: "in stock" },
    { id: "1", name: "purchases" },
    { id: "2", name: "stock adjustments" },
    { id: "3", name: "stock out - sales" },
    { id: "4", name: "stock out - reject/defective items" },
  ];
  return (
    <>
      <ModalWrapper
        val="Stock Movement"
        itemEdit={itemEdit}
        mutation={mutation}
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
                ...ActivityLogDetails(
                  "products",
                  itemEdit ? "update" : "create",
                  store,
                  values,
                ),
                ...values,
              };
              // console.log(data);
              mutation.mutate(data);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="relative mt-3">
                    <InputSelectArray
                      label="stock movement"
                      path="products/read-all-active-by-product"
                      placeholder={`${itemEdit ? "Update product" : "Enter product"}`}
                      type="text"
                      name="stock_movement_product_id"
                      onChange={(e, selectedItem) => {
                        props.values.stock_movement_product_owner_id =
                          selectedItem["products_owner_id"];
                        props.values.stock_movement_product_owner_name =
                          selectedItem["products_owner_name"];
                        props.values.stock_movement_product_id = e.target.value;
                        props.values.stock_movement_product_name =
                          e.target.options[e.target.selectedIndex].text;
                        return e;
                      }}
                      haveOtherInfo={true}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputSelectArrayWithOptions
                      label="Movement Type"
                      placeholder={`${itemEdit ? "Update movement type" : "Enter movement type"}`}
                      type="text"
                      name="stock_movement_type"
                      defaultValue="in stock"
                      options={typeOption}
                      onChange={(e) => {
                        props.values.stock_movement_type = e.target.value;
                        return e;
                      }}
                    />
                  </div>

                  <div className="relative mt-5 mb-6">
                    <InputNumber
                      label="Quantity"
                      name="stock_movement_qty"
                      placeholder={`${itemEdit ? "Update quantity" : "Enter quantity"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="relative mt-5 mb-6">
                    <InputText
                      label="Warehouse Location"
                      type="text"
                      name="stock_movement_location"
                      placeholder={`${itemEdit ? "Update warehouse location" : "Enter warehouse location"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>

                  <div className="relative my-6">
                    <InputTextArea
                      label="Notes"
                      name="stock_movement_notes"
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

export default ModalStockOverview;
