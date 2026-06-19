import {
  DefaultActionTableList,
  EditDeleteActionTableList,
  PaymentStatus,
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
import ViewDetails from "./ViewDetails";
import ModalSalesOrders from "./ModalSalesOrders";

const Customers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);
  const [itemVal, setItemVal] = React.useState(null);
  // Columns
  const columns = [
    {
      accessorKey: "customer_name",
      header: "name",
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_email",
      header: "second_column",
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_phone",
      header: "contact",
      icon: <Phone size={14} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_address",
      header: "address",
      icon: <MapPin size={14} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_messenger",
      header: "social",
      link: "https://www.facebook.com/",
      icon: <FaFacebookMessenger className="text-blue-500 size-4" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_whatsapp",
      header: "social",
      link: "https://www.whatsapp.com/",
      icon: <IoLogoWhatsapp className="text-green-500 size-4.5" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_other",
      header: "social",
      link: "#",
      icon: <AiFillMessage className="text-green-500 size-4.5" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList("customer"),
      header: "Action",
      icon: "",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  // SUB Columns Tables
  const subColumnsTable = [
    {
      accessorKey: "sales_order_status",
      header: "status",
      classTh: "",
      classTd: "",
      status_option: PaymentStatus(),
    },
    {
      accessorKey: "sales_order_number",
      header: "Order Number",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "Date",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_phone",
      header: "Items",
      isViewItems: true,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "total_paid",
      amount: true,
      header: "Paid",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "sales_order_payment_method",
      header: "Method",
      isViewItems: false,
      classTh: "",
      classTd: " uppercase ",
    },
    {
      accessorKey: "total_amount",
      amount: true,
      header: "Total",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: EditDeleteActionTableList("sales-order"),
      header: "Action",
      icon: "",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"customers"} activeTab="customers">
        <InfinitePerTabs
          columns={columns}
          subColumnsTable={subColumnsTable}
          path={"customer"}
          subPath={"sales-order"}
          itemEdit={itemEdit}
          setItemEdit={setItemEdit}
          setItemVal={setItemVal}
          isView={isView}
          setView={setView}
          isSearch={false}
          ishaveAdd={false}
          ishaveSubAdd={false}
          dataTestidAddButton="add-customer-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalCustomer itemEdit={itemEdit} />}
      {store.isSubAdd && <ModalSalesOrders itemEdit={itemEdit} />}

      {store.isView && <ViewDetails itemEdit={itemEdit} item={itemVal} />}
    </>
  );
};

export default Customers;
