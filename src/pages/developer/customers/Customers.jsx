import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
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
import ViewDetails from "./ViewDetails";
import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";

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
      header: "email",
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
      accessorKey: "messenger",
      header: "messenger",
      link: "https://www.facebook.com/",
      icon: <FaFacebookMessenger className="text-blue-500 size-4" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "whatsapp",
      header: "whatsapp",
      link: "https://www.whatsapp.com/",
      icon: <IoLogoWhatsapp className="text-green-500 size-4.5" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "other",
      header: "other social",
      link: "#",
      icon: <AiFillMessage className="text-green-500 size-4.5" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("customer"),
      header: "action",
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
      classTh: "min-w-[5rem] ",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("payment-status")}
          />
        ),
      },
      status_option: ActiveInActiveStatus("payment-status"),
    },
    {
      accessorKey: "sales_order_number",
      header: "Order #",
      classTh: "min-w-[6rem] ",
      isViewItems: false,
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "Date",
      isViewItems: false,
      classTh: " ",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "customer_phone",
      header: "Items",
      isViewItems: true,
      classTh: "min-w-[6rem] ",
      classTd: "",
    },
    {
      accessorKey: "total_paid",
      amount: true,
      header: "Paid",
      isViewItems: false,
      classTh: "min-w-[10rem] ",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_order_payment_method",
      header: "Method",
      isViewItems: false,
      classTh: "",
      classTd: " uppercase ",
      meta: "",
    },
    {
      accessorKey: "total_amount",
      amount: true,
      header: "Total",
      isViewItems: false,
      classTh: "min-w-[10rem] ",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("sales-order", "edit-delete-status"),
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
          haveFilterTable={true}
          ishaveSubAdd={false}
          dataTestidAddButton="add-customer-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalCustomer itemEdit={itemEdit} />}
      {store.isSubAdd && <ModalSalesOrders itemEdit={itemEdit} />}

      {store.isView && <ViewDetails itemEdit={itemVal} />}
    </>
  );
};

export default Customers;
