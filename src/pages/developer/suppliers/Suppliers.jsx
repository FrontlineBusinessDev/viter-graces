import {
  ActiveInActiveStatus,
  DefaultActionTableList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfinitePerTabs from "@/layout/table/InfinitePerTabs";
import { StoreContext } from "@/store/StoreContext";
import { MapPin, Phone } from "lucide-react";
import React from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import ModalAddItem from "./modal/ModalAddItem";
import ModalSuppliers from "./modal/ModalSuppliers";
import { SearchableSelectFilter } from "@/components/inputs/InputSelect";

const Suppliers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [itemVal, setItemVal] = React.useState(null);
  const [isView, setView] = React.useState(false);
  // Columns
  const columns = [
    {
      accessorKey: "suppliers_name",
      header: "name",
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_email",
      header: "second_column",
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_phone",
      header: "contact",
      icon: <Phone size={14} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_address",
      header: "contact",
      icon: <MapPin size={14} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "messenger",
      header: "social",
      link: "https://www.facebook.com/",
      icon: <FaFacebookMessenger className="text-blue-500 size-4" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "whatsapp",
      header: "social",
      link: "https://www.whatsapp.com/",
      icon: <IoLogoWhatsapp className="text-green-500 size-4.5" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "other",
      header: "social",
      link: "#",
      icon: <AiFillMessage className="text-green-500 size-4.5" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_contact_person",
      header: "stringArray",
      label: "Other Contacts",
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_delivery",
      header: "suppliers_delivery",
      label: "Delivery",
      icon: "",
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
      accessorKey: "suppliers_product_is_active",
      header: "status",
      classTh: "w-[10rem]! p-0!",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            options={ActiveInActiveStatus()}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "suppliers_product_name",
      header: "Items(s)",
      isViewItems: false,
      classTh: "",
      classTd: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "suppliers_product_unit",
      header: "Unit",
      isViewItems: false,
      classTh: "",
      classTd: "",
      isSubTitle: true,
    },
    {
      accessorKey: "suppliers_product_price",
      header: "Estimated Cost",
      isViewItems: false,
      classTh: "",
      classTd: "",
      isPrice: true,
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
          path={"suppliers"}
          subPath={"suppliers-product"}
          itemEdit={itemEdit}
          setItemEdit={setItemEdit}
          setItemVal={setItemVal}
          isView={isView}
          setView={setView}
          isSearch={false}
          ishaveAdd={false}
          ishaveSubAdd={true}
          isDefaultMobile="suppliers"
        />
      </HeaderNav>
      {store.isAdd && <ModalSuppliers itemEdit={itemEdit} />}
      {store.isSubAdd && <ModalAddItem itemEdit={itemEdit} item={itemVal} />}
    </>
  );
};

export default Suppliers;
