import ModalButton from "@/components/buttons/ModalButton";
import { InputSelectArray } from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import MessageError from "@/components/MessageError";
import { apiVersion, devNavUrl } from "@/config/config";
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
import React from "react";
import * as Yup from "yup";

const ModalProductOwner = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  const {
    isLoading,
    isFetching,
    error,
    data: productOwner,
  } = useQueryData(
    `${apiVersion}/productOwner`, // endpoint
    "get", // method
    "productOwner", // key
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/users/${itemEdit?.id}`
          : `${apiVersion}/users`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });

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
    product_owner_aid: isEmptyItem(itemEdit?.product_owner_aid, ""),
    product_owner_first_name: isEmptyItem(
      itemEdit?.product_owner_first_name,
      "",
    ),
    product_owner_last_name: isEmptyItem(itemEdit?.product_owner_last_name, ""),
    product_owner_email: isEmptyItem(itemEdit?.product_owner_email, ""),
  };

  const yupSchema = Yup.object({
    product_owner_first_name: Yup.string().trim().required("Required"),
    product_owner_last_name: Yup.string().trim().required("Required"),
    product_owner_email: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapper
        val="Product Owner"
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
              // console.log(values);
              mutation.mutate(values);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="relative">
                    <InputText
                      label="First name"
                      type="text"
                      name="product_owner_first_name"
                      placeholder={`${itemEdit ? "Update user first name" : "Enter new user first name"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Last name"
                      type="text"
                      name="product_owner_last_name"
                      placeholder={`${itemEdit ? "Update user last name" : "Enter new user last name"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Email"
                      type="text"
                      name="product_owner_email"
                      placeholder={`${itemEdit ? "Update user email" : "Enter new user email"}`}
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

export default ModalProductOwner;
