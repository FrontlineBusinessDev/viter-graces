import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalProducts from "./ModalProducts";
import { SearchableSelectFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
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
      accessorKey: "image",
      header: "Image",
      classTh: "",
      classTd: "",
      isImage: true,
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
      isTag: true,
    },
    {
      accessorKey: "category",
      header: "Category",
      classTh: "",
      classTd: "",
      isSubTitle: true,
    },
    {
      accessorKey: "price",
      header: "Price",
      classTh: "",
      classTd: "",
      isPrice: true,
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

  const mockData = [
    {
      id: 1,
      status: 1,
      name: "Banana Chips",
      sku: "MBP14-001",
      category: "Chips",
      price: "1,999.00",
      cost: "₱1500.00",
      stocks: "11",
    },
    {
      id: 2,
      status: 1,
      name: "Chips",
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
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="products"
          setItemEdit={setItemEdit}
          productMobile={true}
          mockData={mockData}
          isStatic={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalProducts itemEdit={itemEdit} />}
    </>
  );
};

export default Products;
