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
      classTh: "min-w-[7rem]",
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
      header: "order #",
      classTh: "min-w-[5rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_due_date",
      header: "Due Date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_total_receivable_amount",
      header: "total",
      amount: true,
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_paid_amount",
      header: "paid",
      paid_amount: true,
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_total_balance_amount",
      header: "balance",
      amount: true,
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_payment_method",
      header: "method",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={PaymentMethodList()}
          />
        ),
      },
      status_option: PaymentMethodList(),
    },
    {
      accessorKey: "sales_order_payment_terms",
      header: "payment terms",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={PaymentTermsList()}
          />
        ),
      },
      status_option: PaymentTermsList(),
    },
    ...(getAdminDeveloperRole(store)
      ? [
          {
            accessorKey: "action",
            action_array: ActionTableList("sales-order", "status-with-view"),
            header: "Action",
            classTh: "text-center w-[7rem]",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]
      : []),
  ];

  React.useEffect(() => {
    if (window.sessionStorage.getItem("quickAdd")) {
      dispatch(setIsAdd(true));
    }
  }, [window.sessionStorage.getItem("quickAdd")]);

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
          ishaveAdd={getAdminDeveloperRole(store)}
          haveFilterTable={true}
          ishaveSubAdd={false}
          dataTestidAddButton="add-customer-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalCustomer itemEdit={itemEdit} />}
      {store.isSubAdd && <ModalSalesOrders itemEdit={itemEdit} />}

      {store.isView && <ViewSalesDetails itemEdit={itemEdit} />}
    </>
  );
};

export default Customers;
