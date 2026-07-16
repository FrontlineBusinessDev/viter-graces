import ModalButton from "@/components/buttons/ModalButton";
import { InputPhotoUpload } from "@/components/inputs/InputFilePhoto";
import { InputSelectArray } from "@/components/inputs/InputSelect";
import { InputNumber, InputText } from "@/components/inputs/InputText";
import { InputTextArea } from "@/components/inputs/InputTextArea";
import LoadImages from "@/components/LoadImages";
import MessageError from "@/components/MessageError";
import { apiVersion, devBaseImgUrl } from "@/config/config";
import useUploadMultipleFiles from "@/custom-hooks/useUploadMultipleFiles";
import useUploadPhoto from "@/custom-hooks/useUploadPhoto";
import { ActivityLogDetails } from "@/layout/ArrayValue";
import ModalWrapper from "@/layout/modal/ModalWrapper";
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
import {
  ProductOwnerId,
  ProductOwnerName,
} from "@/utilities/productOwnerToken";
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
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  const {
    uploadMultipleFiles,
    handleChangeMultipleFiles,
    setFilesArrayList,
    filesArrayList,
  } = useUploadMultipleFiles(`${apiVersion}/upload-multiple-files`, dispatch);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        itemEdit
          ? `${apiVersion}/products/${itemEdit?.id}`
          : `${apiVersion}/products`,
        itemEdit ? "put" : "post",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stock-movement"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stock-overview"] });
      queryClient.invalidateQueries({ queryKey: ["sales-order"] });

      if (data.success) {
        dispatch(setIsAdd(false));
        dispatch(setSuccess(true));
        dispatch(
          setMessage(
            itemEdit ? "Updated successfully." : "Created successfully.",
          ),
        );
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const initVal = {
    products_name: isEmptyItem(itemEdit?.products_name, ""),
    // products_image: isEmptyItem(itemEdit?.products_image, ""),
    products_image: isEmptyItem(itemEdit?.products_image, []),
    products_sku: isEmptyItem(itemEdit?.products_sku, ""),
    products_category: isEmptyItem(itemEdit?.products_category, ""),
    products_price: isEmptyItem(itemEdit?.products_price, ""),
    products_cost: isEmptyItem(itemEdit?.products_cost, ""),
    products_stocks: isEmptyItem(itemEdit?.products_stocks, ""),
    products_owner_id:
      Number(ProductOwnerId(store)) > 0
        ? Number(ProductOwnerId(store))
        : isEmptyItem(itemEdit?.products_owner_id, ""),
    products_owner_name:
      Number(ProductOwnerId(store)) > 0
        ? ProductOwnerName(store)
        : isEmptyItem(itemEdit?.products_owner_name, ""),
    products_suppliers_id: isEmptyItem(itemEdit?.products_suppliers_id, "0"),
    products_suppliers_name: isEmptyItem(itemEdit?.products_suppliers_name, ""),
    products_sales: isEmptyItem(itemEdit?.products_sales, ""),
    products_unit: isEmptyItem(itemEdit?.products_unit, ""),
    products_barcode: isEmptyItem(itemEdit?.products_barcode, ""),
    stock_movement_location: "",
    products_low_stock_threshold: isEmptyItem(
      itemEdit?.products_low_stock_threshold,
      "",
    ),
    products_description: isEmptyItem(itemEdit?.products_description, ""),
    products_owner_id_old:
      Number(ProductOwnerId(store)) > 0
        ? Number(ProductOwnerId(store))
        : isEmptyItem(itemEdit?.products_owner_id, ""),
    val_name_old: isEmptyItem(itemEdit?.products_name, ""),
    products_name_old: isEmptyItem(itemEdit?.products_name, ""),
    products_image_old: isEmptyItem(itemEdit?.products_image, ""),

    pendingDeleteFile: [],
  };

  const yupSchema = Yup.object({
    products_name: Yup.string().trim().required("Required"),
    products_price: Yup.string().trim().required("Required"),
    products_owner_id:
      Number(ProductOwnerId(store)) > 0
        ? ""
        : Yup.string().trim().required("Required"),
    products_unit: Yup.string().trim().required("Required"),
    products_low_stock_threshold: Yup.string().trim().required("Required"),
  });

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

              let data = {
                ...ActivityLogDetails(
                  "products",
                  itemEdit ? "update" : "create",
                  store,
                  values,
                ),
                ...values,
              };
              setLoading(true);
              // console.log(data);

              const filesUpload = await uploadMultipleFiles();
              if (filesUpload?.success) setLoading(false);
              if (!loading) mutation.mutate(data); // mutate data
            }}
          >
            {(props) => {
              return (
                <Form>
                  <div className="relative ">
                    <InputText
                      label="Product Name"
                      type="text"
                      name="products_name"
                      placeholder={`${itemEdit ? "Update product" : "Product Name"}`}
                      disabled={mutation.isPending || loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative mt-3">
                      <InputText
                        label="Category"
                        type="text"
                        name="products_category"
                        disabled={mutation.isPending || loading}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputSelectArray
                        label="Suppliers"
                        type="text"
                        path="suppliers/read-in-modal"
                        name="products_suppliers_id"
                        dataTestIdSelect="select-supplier"
                        onChange={(e) => {
                          props.values.products_suppliers_id = e.target.value;
                          props.values.products_suppliers_name =
                            e.target.options[e.target.selectedIndex].text;
                          return e;
                        }}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputNumber
                        label="Cost Price"
                        name="products_cost"
                        placeholder={`${itemEdit ? "0.00" : "0.00"}`}
                        disabled={mutation.isPending || loading}
                        required={false}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputNumber
                        label="Selling Price"
                        name="products_price"
                        placeholder={`${itemEdit ? "0.00" : "0.00"}`}
                        disabled={mutation.isPending || loading}
                      />
                    </div>
                    {!itemEdit ? (
                      <div className="relative mt-3">
                        <InputNumber
                          label="Stock Quantity"
                          name="products_stocks"
                          placeholder={`${itemEdit ? "0" : "0"}`}
                          disabled={mutation.isPending || loading}
                          required={false}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="relative mt-3">
                      <InputNumber
                        label="Low Stock Threshold"
                        name="products_low_stock_threshold"
                        placeholder={`${itemEdit ? "0" : "0"}`}
                        disabled={mutation.isPending || loading}
                      />
                    </div>
                    <div className="relative mt-3">
                      <InputText
                        label="Unit of measure"
                        name="products_unit"
                        placeholder="e.g., pcs, kilograms, pack"
                        disabled={mutation.isPending || loading}
                        required={true}
                      />
                    </div>
                    {Number(ProductOwnerId(store)) > 0 ? (
                      ""
                    ) : (
                      <div className="relative mt-3">
                        <InputSelectArray
                          label="Product Owner"
                          path="product-owner/read-by-product-owner"
                          type="text"
                          name="products_owner_id"
                          dataTestIdSelect="select-product-owner"
                          onChange={(e) => {
                            props.values.products_owner_id = e.target.value;
                            props.values.products_owner_name =
                              e.target.options[e.target.selectedIndex].text;
                            return e;
                          }}
                        />
                      </div>
                    )}
                    {itemEdit ? (
                      ""
                    ) : (
                      <div className="relative mt-3">
                        <InputText
                          label="Location"
                          type="text"
                          name="stock_movement_location"
                          disabled={mutation.isPending || loading}
                          required={false}
                        />
                      </div>
                    )}
                  </div>

                  <div className="relative mt-3">
                    <InputTextArea
                      label="Description"
                      type="text"
                      name="products_description"
                      placeholder={`${itemEdit ? "Update description" : "Enter description"}`}
                      disabled={mutation.isPending || loading}
                      required={false}
                    />
                  </div>

                  {/* <div className="relative mt-5 mb-6">
                    <div className="relative w-fit m-auto mb-6 mt-1 group cursor-pointer">
                      {filesArrayList?.length === 0 ? (
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
                            className="absolute top-1/2 left-1/2 object-cover -translate-x-1/2 -translate-y-1/2 w-full h-full z-20 aspect-square"
                            isTableSpinner={true}
                          />
                        </div>
                      )}
                      <Upload className="opacity-0 duration-200 group-hover:opacity-100 fill-dark/70 absolute top-0 right-0 bottom-0 left-0 min-h-8 max-h-8 m-auto cursor-pointer" />
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
                            "products_image", // field value
                            1, // file limit
                            true,
                            200000, // limit per file
                            filesArrayList,
                          )
                        }
                        className="opacity-0 absolute top-0 right-0 bottom-0 left-0 min-w-[155px] min-h-[250px] max-w-[155px] max-h-[250px] m-auto cursor-pointer"
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
                  </div> */}

                  {store.error && <MessageError />}
                  <div className="modal-action">
                    <ModalButton
                      disabled={mutation.isPending || loading}
                      loading={mutation.isPending || loading}
                      itemEdit={itemEdit}
                      type="button"
                      handleClose={handleClose}
                    />
                    <ModalButton
                      disabled={mutation.isPending || loading}
                      loading={mutation.isPending || loading}
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
