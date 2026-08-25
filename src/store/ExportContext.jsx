import { createContext, useContext, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { apiVersion } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";

const ExportContext = createContext();

const initState = {
  isExporting: false,
  isDone: false,
  error: null,
  fetchedCount: 0,
  totalCount: 0,
  progress: 0,
  fileName: "",
};

export function ExportProvider({ children }) {
  const [state, setState] = useState(initState);
  const cancelRef = useRef(false);

  const dismiss = () => setState(initState);

  const cancelExport = () => {
    cancelRef.current = true;
  };

  const startExport = async ({
    path,
    columns = [],
    selectedKeys = [],
    columnFilters = [],
    searchValue = "",
    isDeveloper = "0",
    userId = "",
    fileName = "export",
  }) => {
    cancelRef.current = false;

    setState({
      ...initState,
      isExporting: true,
      fileName,
    });

    const fields = columns.filter((col) =>
      selectedKeys.includes(col.accessorKey),
    );

    let rows = [];
    let pageParam = 1;
    let total = 0;

    try {
      while (true) {
        if (cancelRef.current) {
          setState(initState);
          return;
        }

        const result = await queryDataInfinite(
          null,
          `${apiVersion}/${path}/page/${pageParam}`,
          false,
          {
            searchValue,
            isDeveloper,
            id: "",
            userId,
            columnFilters,
          },
          "post",
        );

        total = result?.total ?? 0;
        rows = rows.concat(result?.data ?? []);

        setState((prev) => ({
          ...prev,
          fetchedCount: rows.length,
          totalCount: total,
          progress: total > 0 ? Math.min(100, Math.round((rows.length / total) * 100)) : 0,
        }));

        if (!result?.count || result.page >= total) {
          break;
        }
        pageParam = result.page + result.count;
      }

      if (cancelRef.current) {
        setState(initState);
        return;
      }

      const exportRows = rows.map((row) => {
        const exportRow = {};
        fields.forEach((col) => {
          exportRow[col.header || col.accessorKey] = row[col.accessorKey];
        });
        return exportRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
      XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: "csv" });

      setState((prev) => ({
        ...prev,
        isExporting: false,
        isDone: true,
        progress: 100,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isExporting: false,
        error: err?.message || "Export failed.",
      }));
    }
  };

  return (
    <ExportContext.Provider
      value={{ ...state, startExport, cancelExport, dismiss }}
    >
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  return useContext(ExportContext);
}
