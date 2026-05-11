import { DefaultActionTableList } from "@/layout/ArrayValue";
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

const Customers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);
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
      header: "contact",
      icon: <MapPin size={14} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_messenger",
      header: "social",
      icon: <FaFacebookMessenger className="text-blue-500 size-4" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_whatsapp",
      header: "social",
      icon: <IoLogoWhatsapp className="text-green-500 size-4.5" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_other",
      header: "social",
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
      accessorKey: "customer_name",
      header: "Order Number",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_email",
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
      accessorKey: "customer_address",
      header: "Paid",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_messenger",
      header: "Method",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_whatsapp",
      header: "Total",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"customers"} activeTab="customers">
        <InfinitePerTabs
          columns={columns}
          subColumnsTable={subColumnsTable}
          path={"customer"}
          itemEdit={itemEdit}
          setItemEdit={setItemEdit}
          isView={isView}
          setView={setView}
          isSearch={false}
          ishaveAdd={false}
          isDefaultMobile="customer"
        />
      </HeaderNav>
      {store.isAdd && <ModalCustomer itemEdit={itemEdit} />}

      {store.isView && <ViewDetails itemEdit={itemEdit} />}
    </>
  );
};

export default Customers;
