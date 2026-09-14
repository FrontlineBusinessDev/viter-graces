import {
  MultiSelectCheckboxFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteFilterWithDropDown from "@/layout/table/InfiniteFilterWithDropDown";
import { StoreContext } from "@/store/StoreContext";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import { MapPin, Phone } from "lucide-react";
import React from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import ModalAddItem from "./modal/ModalAddItem";
import ModalSuppliers from "./modal/ModalSuppliers";

const Suppliers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [itemVal, setItemVal] = React.useState(null);
  const [isView, setView] = React.useState(false);
  // Columns
  const columns = [
    {
      accessorKey: "suppliers_name",
      header: "Supplier Name",
      icon: "",
      isHaveLink: false,
      isPrimaryRow: true,
      isMobileTitle: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="suppliers/read-group-by-filter?type=name"
            testFilterId={"filter-supplier"}
          />
        ),
      },
    },
    {
      accessorKey: "suppliers_description_value",
      header: "supplier description",
      icon: "",
      isHaveLink: false,
      isPrimaryRow: true,
      classTh: "min-w-70",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="suppliers/read-group-by-filter?type=description"
            testFilterId={"filter-supplier"}
          />
        ),
      },
    },
    {
      accessorKey: "suppliers_email",
      header: "email",
      link: "mailto:",
      isHaveLink: true,
      icon: <MdEmail size={12} />,
      classTh: "min-w-40",
      classTd: " normal-case! ",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="suppliers/read-group-by-filter?type=email"
            testFilterId={"filter-supplier"}
          />
        ),
      },
    },
    {
      accessorKey: "suppliers_phone",
      header: "Contact",
      icon: <Phone size={10} />,
      isPrimaryRow: true,
      classTh: "min-w-40",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "suppliers_address",
      header: "Address",
      isHaveLink: false,
      icon: <MapPin size={10} />,
      isPrimaryRow: true,
      classTh: "min-w-40",
      classTd: "",
      meta: "",
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
      classTh: "min-w-40",
      classTd: "",
      meta: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "suppliers_product_unit",
      header: "Unit",
      isViewItems: false,
      classTh: "min-w-40",
      classTd: "",
      meta: "",
      isSubTitle: true,
    },
    {
      accessorKey: "suppliers_product_price",
      header: "Estimated Cost",
      isViewItems: false,
      classTh: "min-w-40",
      classTd: "",
      meta: "",
      filterFn: "between",
      isPrice: true,
      amount: true,
    },
    ...(getAdminDeveloperRole(store)
      ? [
          {
            accessorKey: "action",
            action_array: ActionTableList("roles"),
            header: "Action",
            classTh: " text-center w-[5rem] ",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]
      : []),
  ];

  return (
    <>
      <HeaderNav menu={"suppliers"} activeTab="suppliers">
        <InfiniteFilterWithDropDown
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="suppliers"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          ishaveAdd={getAdminDeveloperRole(store)}
          subColumnsTable={subColumnsTable}
          subPath="suppliers-product"
          setItemVal={setItemVal}
          ishaveSubTableAdd={getAdminDeveloperRole(store)}
        />
      </HeaderNav>
      {store.isAdd && <ModalSuppliers itemEdit={itemEdit} />}
      {store.isSubAdd && <ModalAddItem itemEdit={itemEdit} item={itemVal} />}
    </>
  );
};

export default Suppliers;
