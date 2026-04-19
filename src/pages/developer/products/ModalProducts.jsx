import ModalButton from "@/components/buttons/ModalButton";
import { InputPhotoUpload } from "@/components/inputs/InputFilePhoto";
import { InputSelectArray } from "@/components/inputs/InputSelect";
import { InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import LoadImages from "@/components/LoadImages";
import MessageError from "@/components/MessageError";
import { apiVersion, devNavUrl } from "@/config/config";
import useUploadMultipleFiles from "@/custom-hooks/useUploadMultipleFiles";
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
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { FileText, Upload } from "lucide-react";
import React from "react";
import * as Yup from "yup";

const ModalProducts = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  const {
    uploadMultipleFiles,
    handleChangeMultipleFiles,
    setFilesArrayList,
    filesArrayList,
  } = useUploadMultipleFiles(`${apiVersion}/upload-multiple-files`, dispatch);

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
    if (itemEdit) {
      const files = getConvertStringToJSONparseData(itemEdit.product_photo);
      setFilesArrayList(files);
    }
  }, [itemEdit?.product_photo]);

  return (
    <>
      <ModalWrapper
        val="Product"
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
              setLoading(true);
              const filesUpload = await uploadMultipleFiles();
              if (filesUpload?.success) setLoading(false);
              if (!loading) mutation.mutate(values);
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="relative ">
                    <InputText
                      label="Product Name"
                      type="text"
                      name="user_account_first_name"
                      placeholder={`${itemEdit ? "Update product" : "Product Name"}`}
                      disabled={mutation.isPending}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative mt-3">
                      <InputText
                        label="SKU"
                        type="text"
                        name="user_account_first_name"
                        placeholder={`${itemEdit ? "Update SKU code" : "SKU code"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Barcode"
                        type="text"
                        name="user_account_first_name"
                        placeholder={`${itemEdit ? "Update Barcode" : "Barcode"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputSelectArray
                        label="Category"
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
                      <InputSelectArray
                        label="Supplier"
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
                        label="Cost Price"
                        type="number"
                        name="user_account_first_name"
                        placeholder={`${itemEdit ? "0.00" : "0.00"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Selling Price"
                        type="number"
                        name="user_account_first_name"
                        placeholder={`${itemEdit ? "0.00" : "0.00"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Unit"
                        type="number"
                        name="user_account_first_name"
                        placeholder={`${itemEdit ? "pcs" : "pcs"}`}
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputSelectArray
                        label="Product Owner"
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
                  </div>

                  <div className="relative mt-3">
                    <InputTextArea
                      label="Description"
                      type="text"
                      name="user_account_email"
                      placeholder={`${itemEdit ? "Update description" : "Enter description"}`}
                      disabled={mutation.isPending}
                    />
                  </div>

                  <div className="relative mt-5 mb-6">
                    <div className="relative w-fit m-auto mb-6 mt-1 group cursor-pointer">
                      {filesArrayList?.length == 0 ? (
                        <>
                          <FileText className="group-hover:opacity-30 duration-200 relative size-[200px] object-cover object-[50%_50%] m-auto fill-gray-400 border p-14" />
                        </>
                      ) : (
                        <div className="group-hover:opacity-30 duration-200 relative size-[150px] m-auto">
                          <LoadImages
                            url={filesArrayList[filesArrayList?.length - 1]}
                            alt={
                              filesArrayList[filesArrayList?.length - 1]?.name
                            }
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-20 aspect-square"
                            isTableSpinner={true}
                          />
                        </div>
                      )}
                      <Upload className="opacity-0 duration-200 group-hover:opacity-100 fill-dark/70 absolute top-0 right-0 bottom-0 left-0 min-w-[2rem] min-h-[2rem] max-w-[2rem] max-h-[2rem] m-auto cursor-pointer" />
                      <InputPhotoUpload
                        name="photo"
                        type="file"
                        id="myFile"
                        accept="image/*"
                        title="Upload photo"
                        onChange={(e) =>
                          handleChangeMultipleFiles(
                            e, // event
                            props, // props field
                            setFilesArrayList, // onchange file state
                            "product_photo", // field value
                            1, // file limit
                            true,
                            200000,
                          )
                        }
                        className="opacity-0 absolute top-0 right-0 bottom-0 left-0 min-w-[155px] min-h-[150px] max-w-[155px] max-h-[150px] m-auto cursor-pointer"
                        disabled={loading || mutation.isPending}
                      />

                      <div className="relative py-2 mb-6 leading-tight">
                        <span className="block text-center italic ">
                          Upload Photo
                        </span>
                        <span className="block text-center text-[10px]">
                          Suggested size is 315x350 pixels
                        </span>
                        <span className="block text-center text-[10px]">
                          Less than or equal to{" "}
                          <span className="font-bold">200KB</span>
                        </span>
                      </div>
                    </div>
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

export default ModalProducts;
