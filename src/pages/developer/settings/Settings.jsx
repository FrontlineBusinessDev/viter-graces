import Pills from "@/components/Pills";
import { apiVersion } from "@/config/config";
import HeaderNav from "@/layout/header/HeaderNav";
import TableDefaultPage from "@/layout/table/TableDefaultPage";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { useInView } from "react-intersection-observer";
const Settings = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [dataItem, setData] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const search = React.useRef({ value: "" });
  const { ref, inView } = useInView();
  let counter = 1;
  let theadList = [
    {
      class: "",
      name: "Status",
    },
  ];

  const {
    isLoading,
    isFetching,
    error,
    data: roles,
  } = useQueryData(
    `${apiVersion}/roles`, // endpoint
    "get", // method
    "roles", // key
  );

  return (
    <>
      <HeaderNav menu={"settings"} activeTab="user">
        <TableDefaultPage
          theadList={theadList}
          search={search}
          result={{
            loading: false,
            isFetching: false,
            error: false,
            setPage,
            page,
            ref,
            key: "children",
            path: "children",
          }}
          classname="h-[calc(85dvh-180px)]! "
          dataItem={dataItem}
        >
          {Array?.from({ length: 3 }, (_, i) => (
            <tr key={i} className="sm:table-row group relative ">
              <td className="">{counter++}.</td>
              <td className="">
                <Pills variant="active">Active</Pills>
              </td>
            </tr>
          ))}
        </TableDefaultPage>
      </HeaderNav>
    </>
  );
};

export default Settings;
