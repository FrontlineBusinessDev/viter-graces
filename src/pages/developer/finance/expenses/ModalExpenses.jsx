import ModalButton from "@/components/buttons/ModalButton";
import { InputSelectArray } from "@/components/inputs/InputSelect";
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
import { Plus } from "lucide-react";
import React from "react";
import * as Yup from "yup";

const ModalExpenses = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState([]);
  const [counter, setCounter] = React.useState(0);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { id: counter }]);
    setCounter((prev) => prev + 1);
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  const {
    isLoading,
    isFetching,
    error,
    data: supplier,
  } = useQueryData(
    `${apiVersion}/supplier`, // endpoint
    "get", // method
    "supplier", // key
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
    user_account_aid: isEmptyItem(itemEdit?.user_account_aid, ""),
    user_account_first_name: isEmptyItem(itemEdit?.user_account_first_name, ""),
    user_account_last_name: isEmptyItem(itemEdit?.user_account_last_name, ""),
    user_account_email: isEmptyItem(itemEdit?.user_account_email, ""),
    user_account_role_id: isEmptyItem(itemEdit?.user_account_role_id, ""),
    user_account_role: isEmptyItem(itemEdit?.user_account_role, ""),

    name: isEmptyItem(itemEdit?.name, ""),
    password_link: `/create-password`,
  };

  const yupSchema = Yup.object({
    user_account_first_name: Yup.string().trim().required("Required"),
    user_account_last_name: Yup.string().trim().required("Required"),
    user_account_email: Yup.string().trim().required("Required"),
    user_account_role_id: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

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
              // console.log(values);
              mutation.mutate(values);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="relative mb-3">
                    <InputSelectArray
                      label="Supplier"
                      type="text"
                      name="user_account_role_id"
                      disabled={mutation.isPending}
                      isLoading={isLoading || isFetching}
                      error={error}
                      result={supplier}
                      onChange={(e) => {
                        props.values.user_account_role_id = e.target.value;
                        props.values.user_account_role =
                          e.target.options[e.target.selectedIndex].text;
                        return e;
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <InputSelectArray
                        label="Category"
                        type="text"
                        name="user_account_role_id"
                        disabled={mutation.isPending}
                        isLoading={isLoading || isFetching}
                        error={error}
                        result={supplier}
                        onChange={(e) => {
                          props.values.user_account_role_id = e.target.value;
                          props.values.user_account_role =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                      />
                    </div>
                    <div className="relative ">
                      <InputText
                        label="Amount"
                        type="number"
                        name="user_account_first_name"
                        placeholder={`${itemEdit ? "0.00" : "0.00"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative">
                      <InputSelectArray
                        label="VAT (Optional)"
                        type="text"
                        name="user_account_role_id"
                        disabled={mutation.isPending}
                        isLoading={isLoading || isFetching}
                        error={error}
                        result={supplier}
                        onChange={(e) => {
                          props.values.user_account_role_id = e.target.value;
                          props.values.user_account_role =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                      />
                    </div>
                    <div className="relative ">
                      <InputText
                        label="Date"
                        type="date"
                        name="user_account_last_name"
                        disabled={mutation.isPending}
                      />
                    </div>
                  </div>
                  <div className="relative my-3">
                    <InputSelectArray
                      label="Payment Method"
                      type="text"
                      name="user_account_role_id"
                      disabled={mutation.isPending}
                      isLoading={isLoading || isFetching}
                      error={error}
                      result={supplier}
                      onChange={(e) => {
                        props.values.user_account_role_id = e.target.value;
                        props.values.user_account_role =
                          e.target.options[e.target.selectedIndex].text;
                        return e;
                      }}
                    />
                  </div>

                  <div className="relative">
                    <InputTextArea
                      label="Description"
                      type="text"
                      name="user_account_email"
                      placeholder={`${itemEdit ? "Update Description" : "Enter Description"}`}
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

export default ModalExpenses;
