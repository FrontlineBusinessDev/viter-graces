import ModalButton from "@/components/buttons/ModalButton";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { apiVersion } from "@/config/config";
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

const ModalCustomer = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  console.log("itemEdit", itemEdit);

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/customer/${itemEdit?.id}`
          : `${apiVersion}/customer`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["customer"] });

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
    customer_name: isEmptyItem(itemEdit?.customer_name, ""),
    customer_email: isEmptyItem(itemEdit?.customer_email, ""),
    customer_phone: isEmptyItem(itemEdit?.customer_phone, ""),
    customer_address: isEmptyItem(itemEdit?.customer_address, ""),
    customer_messenger: isEmptyItem(itemEdit?.customer_messenger, ""),
    customer_whatsapp: isEmptyItem(itemEdit?.customer_whatsapp, ""),
    customer_other: isEmptyItem(itemEdit?.customer_other, ""),
    customer_notes: isEmptyItem(itemEdit?.customer_notes, ""),

    customer_name_old: isEmptyItem(itemEdit?.customer_name, ""),
  };

  const yupSchema = Yup.object({
    customer_name: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapper
        val="Customer"
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
                      label="Name"
                      type="text"
                      name="customer_name"
                      placeholder={`${itemEdit ? "Update name" : "Enter name"}`}
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Email"
                      type="text"
                      name="customer_email"
                      placeholder={`${itemEdit ? "Update email" : "Enter new email"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Phone"
                      type="number"
                      name="customer_phone"
                      placeholder={`${itemEdit ? "Update phone" : "Enter phone"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Address"
                      type="text"
                      name="customer_address"
                      placeholder={`${itemEdit ? "Update address" : "Enter address"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Messenger"
                      type="text"
                      name="customer_messenger"
                      placeholder={`${itemEdit ? "Update Messenger" : "Enter new Messenger"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Whatsapp"
                      type="text"
                      name="customer_whatsapp"
                      placeholder={`${itemEdit ? "Update Whatsapp" : "Enter new Whatsapp"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputText
                      label="Other"
                      type="text"
                      name="customer_other"
                      placeholder={`${itemEdit ? "Update Other" : "Enter new Other"}`}
                      disabled={mutation.isPending}
                      required={false}
                    />
                  </div>
                  <div className="relative mt-3">
                    <InputTextArea
                      label="Notes"
                      type="text"
                      name="customer_notes"
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

export default ModalCustomer;
