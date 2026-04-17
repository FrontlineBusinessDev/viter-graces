import ModalButton from "@/components/buttons/ModalButton";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { apiVersion } from "@/config/config";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import ModalHeader from "@/layout/modal/ModalWrapper";
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

const ModalRoles = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const queryClient = useQueryClient();

  const handleClose = () => {
    dispatch(setIsAdd(false));
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
        val="Role"
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
                    {itemEdit ? (
                      <p className="flex gap-1">
                        <span className="text-primary">Name:</span>
                        <span>{isEmptyItem(itemEdit?.role_name, "")}</span>
                      </p>
                    ) : (
                      <InputText
                        label="Role"
                        type="text"
                        name="role_name"
                        placeholder={`${itemEdit ? "Update role" : "Enter new role"}`}
                        disabled={mutation.isPending}
                      />
                    )}
                  </div>
                  <div className="relative mb-6">
                    <InputTextArea
                      label="Description"
                      name="role_description"
                      placeholder={`${itemEdit ? "Update description" : "Enter description"}`}
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

export default ModalRoles;
