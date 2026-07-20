import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import {
  ActionTableList,
  ActiveInActiveStatus,
  PaymentMethodList,
  PaymentTermsList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfinitePerTabs from "@/layout/table/InfinitePerTabs";
import { StoreContext } from "@/store/StoreContext";
import { MapPin, Phone } from "lucide-react";
import React from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import ModalCustomer from "./ModalCustomer";
import ModalSalesOrders from "./ModalSalesOrders";
import ViewSalesDetails from "../sales-orders/ViewSalesDetails";
import { setIsAdd } from "@/store/StoreAction";
import {
  getAdminDeveloperRole,
  getProductOwnerRole,
} from "@/utilities/roleValidation";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { devNavUrl } from "@/config/config";

const Customers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);
  const [itemVal, setItemVal] = React.useState(null);
  const userRole = store.credentials?.data?.role;
  // Columns
  const columns = [
    {
      accessorKey: "customer_name",
      header: "name",
      link: `${devNavUrl}/${userRole}/sales-orders`,
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "customer_email",
      header: "email",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "customer_phone",
      header: "contact",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "customer_address",
      header: "address",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "messenger",
      header: "messenger",
      link: "https://www.facebook.com/",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "whatsapp",
      header: "whatsapp",
      link: "https://www.whatsapp.com/",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "other",
      header: "other social",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("customer"),
      header: "action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  React.useEffect(() => {
    if (window.sessionStorage.getItem("quickAdd")) {
      dispatch(setIsAdd(true));
    }
  }, [window.sessionStorage.getItem("quickAdd")]);

  return (
    <>
      <HeaderNav menu={"customers"} activeTab="customers">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="customer"
          setItemEdit={setItemEdit}
          productMobile={true}
          haveFilterTable={true}
          dataTestidAddButton="add-product-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalCustomer itemEdit={itemEdit} />}
      {store.isSubAdd && <ModalSalesOrders itemEdit={itemEdit} />}

      {store.isView && <ViewSalesDetails itemEdit={itemEdit} />}
    </>
  );
};

export default Customers;
