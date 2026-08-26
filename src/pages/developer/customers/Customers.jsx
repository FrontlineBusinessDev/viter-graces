import { devNavUrl } from "@/config/config";
import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ViewSalesDetails from "../sales-orders/ViewSalesDetails";
import ModalCustomer from "./ModalCustomer";
import ModalSalesOrders from "./ModalSalesOrders";
import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import { ProductOwnerId } from "@/utilities/productOwnerToken";

const Customers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const userRole = store.credentials?.data?.role;
  // Columns
  const columns = [
    {
      accessorKey: "is_active",
      header: "status",
      classTh: "",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus()}
            testFilterStatusId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
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
      accessorKey: "customer_phone",
      header: "Number of Orders",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "customer_phone",
      header: "Total Amount Spent",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "customer_phone",
      header: "Outstanding Balance",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "customer_phone",
      header: "Open Credit Memo",
      classTh: "",
      classTd: "",
      meta: "",
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "action",
            action_array: ActionTableList("customer"),
            header: "action",
            classTh: "text-center w-[7rem]",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]),
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
          ishaveAdd={getAdminDeveloperRole(store)}
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
