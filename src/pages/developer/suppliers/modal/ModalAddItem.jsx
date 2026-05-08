import ModalButton from "@/components/buttons/ModalButton";
import { InputText } from "@/components/inputs/InputText";
import MessageError from "@/components/MessageError";
import { apiVersion } from "@/config/config";
import ModalWrapper from "@/layout/modal/ModalWrapper";
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

const ModalAddItem = ({ itemEdit, setAddItem }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setAddItem(false);
  };

  handleEscape(() => handleClose());

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/roles/${itemEdit?.id}`
          : `${apiVersion}/roles`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["roles"] });

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
    role_aid: isEmptyItem(itemEdit?.role_aid, ""),
    role_name: isEmptyItem(itemEdit?.role_name, ""),
    role_description: isEmptyItem(itemEdit?.role_description, ""),

    role_name_old: isEmptyItem(itemEdit?.role_name, ""),
    role_description_old: isEmptyItem(itemEdit?.role_description, ""),
  };

  const yupSchema = Yup.object({
    role_name: Yup.string().trim().required("Required"),
    role_description: Yup.string().trim().required("Required"),
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
              // mutate data
              mutation.mutate(values);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="relative mb-6">
                    <InputText
                      label="Item"
                      type="text"
                      name="Item_name"
                      placeholder={`${itemEdit ? "Update Product name" : "Enter new Product name"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="relative mb-6">
                    <InputText
                      label="Unit"
                      type="text"
                      name="Item_name"
                      placeholder={`${itemEdit ? "Update unit" : "Enter unit"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="relative mb-6">
                    <InputText
                      label="Estimated Cost"
                      type="text"
                      name="Item_name"
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
