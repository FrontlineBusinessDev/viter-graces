import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, Plus, RotateCcw, Trash } from "lucide-react";
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

const Suppliers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [openRow, setOpenRow] = React.useState(null);
  const [dataItem, setData] = React.useState(null);
  const search = React.useRef(null);
  const [onSearch, setOnSearch] = React.useState(false);
  const [isView, setView] = React.useState(false);
  const [addItem, setAddItem] = React.useState(false);

  // ACTIONS ADD
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

  const handleView = (item) => {
    setView(true);
    setItemEdit(item);
  };

  const handleAddItem = () => {
    setAddItem((prev) => !prev);
  };

  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
    },
    {
      accessorKey: "name",
      header: "Name",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "contact no",
      header: "Contact no",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "email",
      header: "Email",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "address",
      header: "address",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList("suppliers"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
    {
      accessorKey: "add-delete-action",
      action_array: EditDeleteActionTableList("suppliers"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  const actionColumn = columns.find((col) => col.accessorKey === "action");
  const addDeleteActionColumn = columns.find(
    (col) => col.accessorKey === "add-delete-action",
  );

  const data = [
    {
      id: 1,
      name: "Jose Herrero",
      phone: "+63 974-036-8638",
      email: "jairo47@vonrueden.com",
      address: "05 Monahan Run, Arayat 5189 Basilan",
      facebook: "https://www.facebook.com/frontline.business",
      whatsapp: "https://www.facebook.com/frontline.business",
      other: "https://www.facebook.com/frontline.business",
      items: "Cooking Oil",
      unit: "Gallon",
      estimated_cost: "320.00",
    },
  ];

  return (
    <>
      <HeaderNav menu={"suppliers"} activeTab="suppliers">
        <div className="sm:flex justify-between flex-row-reverse mb-3 gap-4 ">
          <div className="flex justify-end sm:mb-0! mb-3 ">
            <AddButton value={"Supplier"} onClick={handleAdd} />
          </div>
          <div className={`w-full lg:max-w-1/4 `}>
            <SearchBar
              search={search}
              dispatch={dispatch}
              setOnSearch={setOnSearch}
              onSearch={onSearch}
              label={"Search..."}
            />
          </div>
        </div>
        <div className="py-4">
          <div className="space-y-3">
            {data.map((item) => {
              const isOpen = openRow === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-300 bg-white shadow-sm dark:border-[#0b111e] dark:bg-[#0b111e] "
                >
                  <div className="px-4 py-4 lg:px-5">
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[40px_1.5fr_1fr_1fr_1.3fr_140px_80px] lg:items-center">
                      <div className="hidden lg:block text-gray-500 text-sm dark:text-light">
                        {item.id}
                      </div>

                      <div className="flex items-start justify-between gap-3 lg:contents">
                        <button
                          type="button"
                          onClick={() => setOpenRow(isOpen ? null : item.id)}
                          className="flex flex-1 items-center gap-2 text-left"
                        >
                          <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800 dark:text-light">
                                {item.name}
                              </span>

                              <svg
                                className={`h-4 w-4 text-gray-600 dark:text-light font-bold transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                              </svg>
                            </div>

                            <p className="text-xs text-gray-500 lg:hidden dark:text-light">
                              #{item.id}
                            </p>
                          </div>
                        </button>

                        <div className="lg:hidden">
                          <ActionButtonTable
                            item={actionColumn}
                            dataArray={item}
                            setData={setData}
                            setItemEdit={setItemEdit}
                          />
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-light">
                        <p className="text-xs text-gray-400 lg:hidden">Phone</p>
                        {item.phone}
                      </div>

                      <div className="text-sm text-gray-700 wrap-break-word dark:text-light">
                        <p className="text-xs text-gray-400 lg:hidden">Email</p>
                        {item.email}
                      </div>

                      <div className="text-sm text-gray-700 wrap-break-word dark:text-light">
                        <p className="text-xs text-gray-400 lg:hidden">
                          Address
                        </p>
                        {item.address}
                      </div>

                      <div className="flex items-center gap-3">
                        <a href={`${item.facebook}`} target="_black">
                          <FaFacebookMessenger className="text-blue-500 size-4" />
                        </a>
                        <a href={`${item.whatsapp}`} target="_black">
                          <IoLogoWhatsapp className="text-green-500 size-4.5" />
                        </a>
                        <a href={`tel:${item.other}`}>
                          <AiFillMessage className="text-green-500 size-4.5" />
                        </a>
                      </div>

                      <div className="hidden lg:flex items-center justify-end text-gray-700 dark:text-light">
                        <ActionButtonTable
                          item={actionColumn}
                          dataArray={item}
                          setData={setData}
                          setItemEdit={setItemEdit}
                        />
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div>
                      <div className="border-t border-gray-400 px-4 lg:px-5 pb-4 pt-3  ">
                        <div className="grid lg:grid-cols-3 my-3">
                          <div className="flex gap-2">
                            <p>Other Contacts:</p>
                            <div className="text-black dark:text-light">
                              <p>Manny (+63 912-465-1234)</p>
                              <p>Leo Reyes (+63 985-165-8965)</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <p>Delivery:</p>
                            <div className="text-black dark:text-light">
                              <p className="font-semibold">Twice a week</p>
                              <p>(Tuesday & Thursday)</p>
                            </div>
                          </div>
                          <div className="place-self-end">
                            <button
                              className="btn--green flex items-center py-2! "
                              onClick={handleAddItem}
                            >
                              <Plus size={15} />
                              <span className="capitalize leading-0">
                                Add Item
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-gray-300 bg-white dark:bg-[#0b111e] overflow-x-hidden dark:border-gray-700 max-h-[300px] ">
                          {/* desktop header */}
                          <div className="hidden sticky top-0 lg:grid lg:grid-cols-5 lg:items-center border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 dark:bg-[#0b111e]">
                            <div>#</div>
                            <div>Items(s)</div>
                            <div>Unit</div>
                            <div>Estimated Cost</div>
                            <div className="text-right">Action</div>
                          </div>

                          {/* row */}
                          <ul className="p-4 grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 text-sm border-b lg:border-b-0">
                            <li>
                              <p className="text-xs text-gray-400 lg:hidden">
                                #
                              </p>
                              1
                            </li>

                            <li>
                              <p className="text-xs text-gray-400 lg:hidden">
                                Items(s)
                              </p>
                              {item.items}
                            </li>

                            <li>
                              <p className="text-xs text-gray-400 lg:hidden">
                                Unit
                              </p>
                              {item.unit}
                            </li>

                            <li>
                              <p className="text-xs text-gray-400 lg:hidden">
                                Estimated Cost
                              </p>
                              ₱ {item.estimated_cost}
                            </li>

                            <li>
                              <p className="text-xs text-gray-400 lg:hidden">
                                Action
                              </p>
                              <div className=" lg:flex items-center justify-end text-gray-700 dark:text-light">
                                <ActionButtonTable
                                  item={addDeleteActionColumn}
                                  dataArray={item}
                                  setData={setData}
                                  setItemEdit={setItemEdit}
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </HeaderNav>
      {store.isAdd && <ModalSuppliers itemEdit={itemEdit} />}
      {addItem && <ModalAddItem itemEdit={itemEdit} setAddItem={setAddItem} />}
    </>
  );
};

export default Suppliers;
