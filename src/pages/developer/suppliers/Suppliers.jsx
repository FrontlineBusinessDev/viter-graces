import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus, ActionTableList } from "@/layout/ArrayValue";
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
import { MdEmail } from "react-icons/md";

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
      isHaveLink: false,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_email",
      header: "email",
      link: "mailto:",
      isHaveLink: true,
      icon: <MdEmail size={12} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_phone",
      header: "contact",
      icon: <Phone size={10} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_address",
      header: "address",
      isHaveLink: false,
      icon: <MapPin size={10} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "messenger ",
      header: "messenger",
      link: "",
      isHaveLink: true,
      icon: <FaFacebookMessenger className="text-blue-500 size-3" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "whatsapp",
      header: "whatsapp",
      link: "https://wa.me/63",
      isHaveLink: true,
      icon: <IoLogoWhatsapp className="text-green-500 size-3" />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "other",
      header: "other social",
      link: "",
      isHaveLink: true,
      icon: <AiFillMessage className="text-green-500 size-3 " />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_delivery",
      header: "suppliers_delivery",
      label: "Delivery",
      isHaveLink: false,
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "suppliers_contact_person",
      header: "stringArray",
      label: "Other Contacts",
      isHaveLink: false,
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("customer"),
      header: "action",
      isHaveLink: false,
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
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus()}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "suppliers_product_name",
      header: "Item(s)",
      isViewItems: false,
      classTh: "",
      classTd: "",
      meta: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "suppliers_product_unit",
      header: "Unit",
      isViewItems: false,
      classTh: "",
      classTd: "",
      meta: "",
      isSubTitle: true,
    },
    {
      accessorKey: "suppliers_product_price",
      header: "Estimated Cost",
      isViewItems: false,
      classTh: "",
      classTd: "",
      meta: "",
      filterFn: "between",
      isPrice: true,
      amount: true,
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("roles"),
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
          haveFilterTable={true}
          isDefaultMobile="suppliers"
        />
      </HeaderNav>
      {store.isAdd && <ModalSuppliers itemEdit={itemEdit} />}
      {store.isSubAdd && <ModalAddItem itemEdit={itemEdit} item={itemVal} />}
    </>
  );
};

export default Suppliers;
