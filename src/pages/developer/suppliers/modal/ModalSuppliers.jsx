import ModalButton from "@/components/buttons/ModalButton";
import { InputSelectWeeksArray } from "@/components/inputs/InputSelect";
import { InputNumber, InputText } from "@/components/inputs/InputText";
import MessageError from "@/components/MessageError";
import { apiVersion } from "@/config/config";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { queryData } from "@/services/queryData";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { Plus } from "lucide-react";
import React from "react";
import * as Yup from "yup";

const ModalSuppliers = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemsContact, setItemsContact] = React.useState(
    itemEdit
      ? getConvertStringToJSONparseData(itemEdit?.suppliers_contact_person)
      : [],
  );
  const [items, setItems] = React.useState([]);

  const handleContactChange = (index, field, value) => {
    const updatedContact = [...itemsContact];

    updatedContact[index][field] = value;

    setItemsContact(updatedContact);
  };

  const handleAddItemContact = () => {
    setItemsContact([
      ...itemsContact,
      {
        contact_name: "",
        contact_phone: "",
      },
    ]);
  };

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/suppliers/${itemEdit?.id}`
          : `${apiVersion}/suppliers`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });

      if (data.success) {
        dispatch(setIsAdd(false));
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

  const handleChange = (index, field, value) => {
    const updated = [...items];

    updated[index][field] = value;

    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        product_name: "",
        price: "",
        unit: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const initVal = {
    suppliers_name: isEmptyItem(itemEdit?.suppliers_name, ""),
    suppliers_email: isEmptyItem(itemEdit?.suppliers_email, ""),
    suppliers_phone: isEmptyItem(itemEdit?.suppliers_phone, ""),
    suppliers_address: isEmptyItem(itemEdit?.suppliers_address, ""),
    suppliers_messenger: isEmptyItem(itemEdit?.suppliers_messenger, ""),
    suppliers_whatsapp: isEmptyItem(itemEdit?.suppliers_whatsapp, ""),
    suppliers_other: isEmptyItem(itemEdit?.suppliers_other, ""),
    suppliers_delivery: isEmptyItem(itemEdit?.suppliers_delivery, ""),
    suppliers_contact_person: "",
    suppliers_notes: isEmptyItem(itemEdit?.suppliers_notes, ""),

    suppliers_name_old: isEmptyItem(itemEdit?.suppliers_name, ""),
  };

  const yupSchema = Yup.object({
    suppliers_name: Yup.string().trim().required("Required"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <ModalWrapper
        val="Supplier"
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
              const data = {
                ...values,
                suppliers_contact_person: JSON.stringify(itemsContact),
                suppliers_products: items,
              };

              mutation.mutate(data);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <InputText
                        label="Name"
                        type="text"
                        name="suppliers_name"
                        placeholder={`${itemEdit ? "Update name" : "Enter name"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative ">
                      <InputNumber
                        label="Phone"
                        name="suppliers_phone"
                        placeholder={`${itemEdit ? "Update phone" : "Enter phone"}`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Email"
                        type="text"
                        name="suppliers_email"
                        placeholder={`${itemEdit ? "Update user email" : "Enter new user email"}`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Address"
                        type="text"
                        name="suppliers_address"
                        placeholder={`${itemEdit ? "Update Address" : "Enter Address"}`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-2">
                    <div className="relative mt-3">
                      <InputText
                        label="Messenger"
                        type="text"
                        name="suppliers_messenger"
                        placeholder={`Messenger`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="WhatsApp"
                        type="text"
                        name="suppliers_whatsapp"
                        placeholder={`WhatsApp`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Other"
                        type="text"
                        name="suppliers_other"
                        placeholder={`Other`}
                        disabled={mutation.isPending}
                        required={false}
                      />
                    </div>
                  </div>

                  <div className="flex my-7 justify-center">
                    <a
                      className={`btn--green flex items-center justify-center text-black gap-2 px-3 py-2! bg-transparent rounded-md border border-gray-300 min-w-20
                        ${
                          itemsContact.length >= 2
                            ? "opacity-50 pointer-events-none cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      onClick={handleAddItemContact}
                    >
                      <Plus size={15} />
                      <span className="capitalize leading-0">
                        Add Contact Person
                      </span>
                    </a>
                  </div>

                  {itemsContact.map((item, key) => (
                    <div key={key} className="grid grid-cols-2 gap-2 mb-3">
                      <div className="relative">
                        <label>Contact Name</label>
                        <input
                          defaultValue={item?.contact_name}
                          onChange={(e) =>
                            handleContactChange(
                              key,
                              "contact_name",
                              e.target.value || item?.contact_name,
                            )
                          }
                        />
                      </div>
                      <div className="relative">
                        <label>Contact Phone</label>
                        <input
                          defaultValue={item?.contact_phone}
                          type="number"
                          onChange={(e) =>
                            handleContactChange(
                              key,
                              "contact_phone",
                              e.target.value || item?.contact_phone,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}

                  {itemEdit ? (
                    ""
                  ) : (
                    <>
                      <div className="flex my-7 justify-between">
                        <label htmlFor="">Items</label>
                        <a
                          className="flex items-center justify-center text-black gap-2 px-3 py-1.5 bg-transparent rounded-md border-gray-300 border min-w-20 hover:bg-primary transition-all duration-300 ease-in-out hover:text-light dark:text-light cursor-pointer"
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
                            <ul className="hidden md:grid grid-cols-[2.2fr_1fr_1fr_2rem] px-3 mt-2 text-dark">
                              <li>Item(s)</li>
                              <li>Unit</li>
                              <li>Est. Cost</li>
                            </ul>
                            {items.map((item, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-2 md:grid md:grid-cols-[2.2fr_1fr_1fr_2rem] gap-2 items-center px-3 pb-3 mt-1"
                              >
                                <input
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "product_name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Product Name"
                                />
                                <input
                                  onChange={(e) =>
                                    handleChange(index, "unit", e.target.value)
                                  }
                                  placeholder="Unit"
                                  className="input"
                                />
                                <input
                                  type="number"
                                  onChange={(e) =>
                                    handleChange(index, "price", e.target.value)
                                  }
                                  placeholder="Price"
                                  className="input"
                                />
                                {/* <span className="font-semibold text-black dark:text-light">
                                  <AmountWithPesoSign
                                    classN={"size-3 "}
                                    classAmnt={"font-bold "}
                                    amount={numberWithCommasToFixed(
                                      Number(isEmptyItem(item.price, 0)) *
                                        Number(isEmptyItem(item.qty, 0)),
                                      2,
                                    )}
                                  />
                                </span> */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-red-500 text-xl"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="relative mt-3">
                    <InputSelectWeeksArray
                      label="Delivery"
                      path="Weeks"
                      type="text"
                      name="suppliers_delivery"
                      disabled={mutation.isPending}
                      onChange={(e) => {
                        props.values.suppliers_delivery = e.target.value;
                        return e;
                      }}
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

export default ModalSuppliers;
