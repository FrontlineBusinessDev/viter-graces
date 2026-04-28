import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalProducts from "./ModalProducts";
const Products = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "status",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
    },
    {
      accessorKey: "name",
      header: "Products",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "category",
      header: "Category",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "price",
      header: "Price",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "cost",
      header: "Cost",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "stocks",
      header: "Stocks",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: [
        {
          name: "edit",
          path: "purchase orders",
          icon: <Edit className="md:size-3 size-5" />,
          isActive: 1,
        },
        {
          name: "archive",
          path: "active",
          icon: <ArchiveRestore className="md:size-3 size-5" />,
          isActive: 1,
        },
        {
          name: "restore",
          path: "active",
          icon: <RotateCcw className="md:size-3 size-5" />,
          isActive: 0,
        },
        {
          name: "delete",
          path: "purchase orders",
          icon: <Trash className="md:size-3 size-5" />,
          isActive: 0,
        },
      ],
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  const mockUsers = [
    {
      id: 1,
      status: "Active",
      name: "John Doe",
      sku: "MBP14-001",
      category: "Electronics",
      price: "1,999.00",
      cost: "₱1500.00",
      stocks: "11",
    },
    {
      id: 2,
      status: "Inactive",
      name: "Jane Smith",
      sku: "IP15P-001",
      category: "Electronics",
      price: "1,500.00",
      cost: "₱1300.00",
      stocks: "4",
    },
  ];

  return (
    <>
      <HeaderNav menu={"products"} activeTab="products">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-100px)] h-[calc(97dvh-250px)]`}
          path="product"
          setItemEdit={setItemEdit}
          // mockData={}
          // isStatic={false}
        />
      </HeaderNav>
      {store.isAdd && <ModalProducts itemEdit={itemEdit} />}
    </>
  );
};

export default Products;
