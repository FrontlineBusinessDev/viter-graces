import ModalButton from "@/components/buttons/ModalButton";
import { InputSelect, InputSelectArray } from "@/components/inputs/InputSelect";
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
import { Plus, Search } from "lucide-react";
import React from "react";
import * as Yup from "yup";

const ModalReturns = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [isSelected, setIsSelected] = React.useState(false);

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
    data: role,
  } = useQueryData(
    `${apiVersion}/role`, // endpoint
    "get", // method
    "role", // key
  );

  const filteredrole = role?.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
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

  const linkedOrders = [
    {
      value: "SO-1001",
      label: "Sales Order #1001 - John Doe",
      items: [
        { id: 1, name: "Banana Chips", ordered: 1 },
        { id: 2, name: "Shing-aling XL", ordered: 1 },
      ],
    },
    {
      value: "SO-1002",
      label: "Sales Order #1002 - Louren",
      items: [
        { id: 1, name: "Banana Chips", ordered: 3 },
        { id: 2, name: "Shing-aling XL", ordered: 2 },
      ],
    },
    {
      value: "SO-1003",
      label: "Sales Order #1003 - Isobel Rubico",
      items: [
        { id: 1, name: "Banana Chips", ordered: 20 },
        { id: 2, name: "Shing-aling XL", ordered: 15 },
      ],
    },
  ];

  return (
    <>
      <ModalWrapper
        val="Process Returns"
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
                    <div className="relative">
                      <InputText
                        label="Return Number"
                        type="number"
                        name="user_account_first_name"
                        placeholder={`${itemEdit ? "Update PO-149181" : "Enter RET-149181"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative ">
                      <InputText
                        label="Return Date"
                        type="date"
                        name="user_account_last_name"
                        disabled={mutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="relative mt-3">
                    <label htmlFor="">Linked Order *</label>
                    <div
                      type="submit"
                      className="absolute left-2 top-9 text-[14px] h-[30px] rounded-tr-none rounded-br-none border-l-0  text-gray-400 cursor-default"
                    >
                      <Search size={14} />
                    </div>
                    <input
                      type="text"
                      value={search}
                      placeholder="Search Customer..."
                      disabled={mutation.isPending}
                      onFocus={() => setShowDropdown(true)}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                      }}
                      className="w-full border rounded-lg px-3 py-1 text-xs pl-7"
                    />
                    {showDropdown && (
                      <div className="absolute z-10 w-full bg-white dark:bg-dark-mode border mt-1 rounded-md shadow max-h-60 overflow-auto">
                        {linkedOrders.filter((item) =>
                          item.label
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                        ).length > 0 ? (
                          linkedOrders
                            .filter((item) =>
                              item.label
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                            )
                            .map((item, index) => (
                              <div
                                key={index}
                                className="py-1 px-2 hover:bg-gray-100 hover:dark:bg-gray-600 cursor-pointer text-xs"
                                onClick={() => {
                                  setSearch(item.label);
                                  setShowDropdown(false);

                                  props.setFieldValue(
                                    "linked_order_id",
                                    item.value,
                                  );
                                  props.setFieldValue(
                                    "linked_order",
                                    item.label,
                                  );
                                  setSelectedItems(
                                    item.items.map((i) => ({
                                      ...i,
                                      selected: false,
                                      qty: 0,
                                    })),
                                  );
                                }}
                              >
                                {item.label}
                              </div>
                            ))
                        ) : (
                          <p className="p-2 text-sm text-gray-400">
                            No results found
                          </p>
                        )}
                      </div>
                    )}

                    {selectedItems.length > 0 && (
                      <div className="relative">
                        <p className="text-xs font-medium mt-3 mb-1">
                          Select Items to Return
                        </p>
                        <div className=" border border-gray-300 rounded-xl p-4 bg-gray-50 dark:bg-dark-mode">
                          {selectedItems.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between mb-2"
                            >
                              {/* Toggle */}
                              <div className="flex items-center gap-3">
                                {/* Toggle Switch */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...selectedItems];
                                    updated[index].selected =
                                      !updated[index].selected;
                                    setSelectedItems(updated);
                                  }}
                                  className={`w-11 h-5.5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                                    item.selected
                                      ? "bg-green-600"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                                      item.selected
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </button>

                                <span className="text-sm">{item.name}</span>
                              </div>

                              {/* Ordered + Qty */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 dark:text-light">
                                  Ordered: {item.ordered}
                                </span>

                                {item.selected && (
                                  <div className="flex gap-1 ">
                                    <input
                                      type="number"
                                      min={0}
                                      max={item.ordered}
                                      value={item.qty}
                                      onChange={(e) => {
                                        const updated = [...selectedItems];
                                        updated[index].qty = e.target.value;
                                        setSelectedItems(updated);
                                      }}
                                      className="w-16 h-7 border rounded px-2 py-1 text-sm mt-0"
                                      placeholder="pcs"
                                    />
                                    <p className="content-end mb-0">.pcs</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="relative">
                      <InputSelect
                        label="Return Reason"
                        type="text"
                        name="user_account_role_id"
                        disabled={mutation.isPending}
                        isLoading={isLoading || isFetching}
                      >
                        <option value="">Select Return Reason</option>
                        <option value="damage">Damage</option>
                      </InputSelect>
                    </div>
                    <div className="bg-[#F5F5EC] dark:bg-gray-600 w-full place-self-end my-5 p-2">
                      <p className="flex flex-col place-self-end text-primary text-lg text-right">
                        <span className="text-black dark:text-light text-sm">
                          Return Amount
                        </span>
                        ₱ 0.00
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <InputTextArea
                      label="Note"
                      type="text"
                      name="user_account_email"
                      placeholder={`${itemEdit ? "Update notes" : "Enter notes"}`}
                      disabled={mutation.isPending}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setIsSelected((prev) => !prev)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        isSelected ? "bg-green-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                          isSelected ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-black text-sm dark:text-light">
                      Restock returned items
                    </span>
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

export default ModalReturns;
