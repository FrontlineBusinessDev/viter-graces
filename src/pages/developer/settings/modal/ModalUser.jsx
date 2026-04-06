import ModalButton from "@/components/buttons/ModalButton";
import { InputSelectArray } from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import MessageError from "@/components/MessageError";
import { apiVersion, devNavUrl } from "@/config/config";
import ModalHeader from "@/layout/headers/ModalHeader";
import { queryData } from "@/services/queryData";
import useQueryData from "@/services/useQueryData";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const ModalUser = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const {
    isLoading,
    isFetching,
    error,
    data: roles,
  } = useQueryData(
    `${apiVersion}/roles`, // endpoint
    "get", // method
    "roles", // key
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
      <div className="bg-dark/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-999 flex justify-center items-center w-full md:inset-0 max-h-full animate-fadeIn">
        <div className="p-1 w-[350px] animate-slideUp ">
          <div className="bg-light p-3 pt-5 rounded-lg">
            <ModalHeader val="User" itemEdit={itemEdit} mutation={mutation} />
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
                      <div className="relative mt-3">
                        <InputSelectArray
                          label="Role"
                          type="text"
                          name="user_account_role_id"
                          disabled={mutation.isPending}
                          isLoading={isLoading || isFetching}
                          error={error}
                          result={roles}
                          onChange={(e) => {
                            props.values.user_account_role_id = e.target.value;
                            props.values.user_account_role =
                              e.target.options[e.target.selectedIndex].text;
                            return e;
                          }}
                        />
                      </div>
                      <div className="relative mt-3">
                        <InputText
                          label="First name"
                          type="text"
                          name="user_account_first_name"
                          placeholder={`${itemEdit ? "Update user first name" : "Enter new user first name"}`}
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-3">
                        <InputText
                          label="Last name"
                          type="text"
                          name="user_account_last_name"
                          placeholder={`${itemEdit ? "Update user last name" : "Enter new user last name"}`}
                          disabled={mutation.isPending}
                        />
                      </div>
                      <div className="relative mt-3">
                        <InputText
                          label="Email"
                          type="text"
                          name="user_account_email"
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
                        />
                        <ModalButton
                          disabled={mutation.isPending}
                          loading={mutation.isPending}
                          itemEdit={itemEdit}
                          type="reset"
                        />
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalUser;
