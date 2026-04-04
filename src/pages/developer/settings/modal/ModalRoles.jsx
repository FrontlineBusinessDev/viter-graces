import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import MessageError from "@/components/MessageError";
import { apiVersion } from "@/config/config";
import ModalHeader from "@/layout/headers/ModalHeader";
import { queryData } from "@/services/queryData";
import {
  setError,
  setIsAction,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

const ModalRoles = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const queryClient = useQueryClient();

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
        dispatch(setIsAction(false));
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
    // EDIT DATA WITH OLD
    ...itemEdit,
    ...Object.fromEntries(
      itemEdit
        ? Object.entries(itemEdit)?.map(([key, value]) => [`${key}_old`, value])
        : [],
    ),

    role_aid: itemEdit ? itemEdit.role_aid : "",
    role_name: itemEdit ? itemEdit.role_name : "",
    role_description: itemEdit ? itemEdit.role_description : "",
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
      <div className="bg-dark/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-999 flex justify-center items-center w-full md:inset-0 max-h-full animate-fadeIn">
        <div className="p-1 w-[350px] animate-slideUp ">
          <div className="bg-light p-3 pt-5 rounded-lg">
            <ModalHeader val="Role" itemEdit={itemEdit} mutation={mutation} />
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
                      <div className="relative mt-5 mb-6">
                        {itemEdit ? (
                          <p className="flex gap-1">
                            <span className="text-primary">Name:</span>
                            <span>{isEmptyItem(itemEdit?.role_name, "")}</span>
                          </p>
                        ) : (
                          <InputText
                            label="Name"
                            type="text"
                            name="role_name"
                            disabled={mutation.isPending}
                          />
                        )}
                      </div>
                      <div className="relative mb-6">
                        <InputTextArea
                          label="Description"
                          name="role_description"
                          disabled={mutation.isPending}
                        />
                      </div>

                      {store.error && <MessageError />}
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

export default ModalRoles;
