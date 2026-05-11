import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import {
  ArchiveRestore,
  Edit,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Trash,
} from "lucide-react";
import React from "react";
import ModalSuppliers from "./modal/ModalSuppliers";
import HeaderNav from "@/layout/headers/HeaderNav";
import ActionButtonTable from "@/layout/ActionButtonTable";
import SearchBar from "@/components/SearchBar";
import AddButton from "@/components/buttons/AddButton";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import {
  DefaultActionTableList,
  EditDeleteActionTableList,
} from "@/layout/ArrayValue";
import { setIsAdd } from "@/store/StoreAction";
import ModalAddItem from "./modal/ModalAddItem";
import InfinitePerTabs from "@/layout/table/InfinitePerTabs";

const Suppliers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);
  const [addItem, setAddItem] = React.useState(false);
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
      header: "Items(s)",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_email",
      header: "Unit",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_phone",
      header: "Estimated Cost",
      isViewItems: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList("roles"),
      header: "Action",
      classTh: " text-center w-[5rem] ",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"suppliers"} activeTab="suppliers">
        <InfinitePerTabs
          columns={columns}
          subColumnsTable={subColumnsTable}
          path={"customer"}
          itemEdit={itemEdit}
          setItemEdit={setItemEdit}
          isView={isView}
          setView={setView}
          isSearch={false}
          ishaveAdd={true}
          isDefaultMobile="customer"
        />
      </HeaderNav>
      {store.isAdd && <ModalSuppliers itemEdit={itemEdit} />}
      {addItem && <ModalAddItem itemEdit={itemEdit} setAddItem={setAddItem} />}
    </>
  );
};

export default Suppliers;
