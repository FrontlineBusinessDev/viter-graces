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

const ModalPurchaseOrder = ({ itemEdit }) => {
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
        val="Purchase Order"
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative mt-3">
                      <InputText
                        label="PO Number"
                        type="text"
                        name="user_account_first_name"
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mt-3">
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
                    <div className="relative mt-3">
                      <InputText
                        label="Order Date"
                        type="date"
                        name="user_account_last_name"
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Expected Delivery"
                        type="date"
                        name="user_account_last_name"
                        disabled={mutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="flex my-7 justify-between">
                    <label htmlFor="">Order Items</label>
                    <a
                      className="flex items-center justify-center text-dark gap-2 px-3 py-1.5 bg-transparent rounded-md border-gray-300 border min-w-20 hover:bg-primary transition-all duration-300 ease-in-out hover:text-light dark:text-light"
                      onClick={handleAddItem}
                    >
                      <Plus size={15} />
                      <span className="capitalize leading-0">Add Item</span>
                    </a>
                  </div>

                  <div className="border shadow border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
                    {items.length === 0 ? (
                      <div className="h-20 flex items-center justify-center ">
                        <p>No Items added yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <ul className="hidden md:grid grid-cols-[1.5fr_1.3fr_.7fr_1.3fr] px-3 mt-2 text-dark">
                          <li>Products</li>
                          <li>Product Owner</li>
                          <li>Quantity</li>
                          <li>Price per pc.</li>
                        </ul>
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-2 md:flex md:flex-row gap-3 items-center p-3 mt-1"
                          >
                            <input
                              type="text"
                              placeholder="Product Name"
                              className="input"
                            />
                            <input
                              type="text"
                              placeholder="Product Owner"
                              className="input"
                            />
                            <input
                              type="number"
                              placeholder="Qty"
                              className="input md:w-20"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              className="input md:w-24"
                            />
                            <span className="font-semibold text-black dark:text-light">
                              ₱0.00
                            </span>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 text-xl"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative mt-3">
                      <InputSelectArray
                        label="Status"
                        type="text"
                        name="user_account_role_id"
                        disabled={mutation.isPending}
                        isLoading={isLoading || isFetching}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputSelectArray
                        label="Payment Status"
                        type="text"
                        name="user_account_role_id"
                        disabled={mutation.isPending}
                        isLoading={isLoading || isFetching}
                      />
                    </div>
                  </div>

                  <div className="bg-[#F5F5EC] w-[50%] place-self-end my-6 p-2">
                    <p className="flex flex-col place-self-end text-primary text-lg text-right">
                      <span className="text-black text-sm">Total</span>₱ 0.00
                    </p>
                  </div>
                  <div className="relative mt-3">
                    <InputTextArea
                      label="Note"
                      type="text"
                      name="user_account_email"
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

export default ModalPurchaseOrder;
