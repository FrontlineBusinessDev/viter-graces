import ModalButton from "@/components/buttons/ModalButton";
import { InputText } from "@/components/inputs/InputText";
import MessageError from "@/components/MessageError";
import { apiVersion } from "@/config/config";
import { ActivityLogDetails } from "@/layout/ArrayValue";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { queryData } from "@/services/queryData";
import {
  setError,
  setIsSubAdd,
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

const ModalAddItem = ({ itemEdit, item, setAddItem }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const queryClient = useQueryClient();

  const handleClose = () => {
    dispatch(setIsSubAdd(false));
    setAddItem(false);
  };

  handleEscape(() => handleClose());

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/suppliers-product/${itemEdit?.id}`
          : `${apiVersion}/suppliers-product`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["suppliers-product"] });

      if (data.success) {
        dispatch(setIsSubAdd(false));
        dispatch(setSuccess(true));
        dispatch(
          setMessage(`Successfully ${itemEdit ? "updated" : "created"}`),
        );
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  console.log("item", item);

  const initVal = {
    suppliers_product_aid: isEmptyItem(itemEdit?.suppliers_product_aid, ""),
    suppliers_product_name: isEmptyItem(itemEdit?.suppliers_product_name, ""),
    suppliers_product_unit: isEmptyItem(itemEdit?.suppliers_product_unit, ""),
    suppliers_product_price: isEmptyItem(itemEdit?.suppliers_product_price, ""),
    suppliers_product_supplier_id: isEmptyItem(item?.suppliers_aid, ""),
    suppliers_product_supplier_name: isEmptyItem(item?.suppliers_name, ""),

    suppliers_product_name_old: isEmptyItem(
      itemEdit?.suppliers_product_name,
      "",
    ),
    suppliers_product_unit_old: isEmptyItem(
      itemEdit?.suppliers_product_unit,
      "",
    ),
  };

  const yupSchema = Yup.object({
    suppliers_product_name: Yup.string().trim().required("Required"),
    suppliers_product_unit: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapper
        val="Item"
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

              let data = {
                ...ActivityLogDetails(
                  "suppliers product",
                  itemEdit ? "update" : "create",
                  store,
                  values,
                ),
                ...values,
              };
              // mutate data
              mutation.mutate(data);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="relative mb-6">
                    <InputText
                      label="Item"
                      type="text"
                      name="suppliers_product_name"
                      placeholder={`${itemEdit ? "Update Product name" : "Enter new Product name"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="relative mb-6">
                    <InputText
                      label="Unit"
                      type="text"
                      name="suppliers_product_unit"
                      placeholder={`${itemEdit ? "Update unit" : "Enter unit"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>
                  <div className="relative mb-6">
                    <InputText
                      label="Estimated Cost"
                      type="text"
                      name="suppliers_product_price"
                      placeholder={`${itemEdit ? "0.00" : "0.00"}`}
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

export default ModalAddItem;
