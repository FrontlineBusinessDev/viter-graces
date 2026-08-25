import CloseButton from "@/components/buttons/CloseButton";
import { useExport } from "@/store/ExportContext";
import React from "react";

const ExportModal = ({
  columns = [],
  path,
  columnFilters = [],
  searchValue = "",
  isDeveloper = "0",
  userId = "",
  defaultFileName = "export",
  onClose = () => {},
}) => {
  const { startExport } = useExport();

  const exportableColumns = columns.filter(
    (col) => col.accessorKey && col.accessorKey !== "action",
  );

  const [selectedKeys, setSelectedKeys] = React.useState(
    exportableColumns.map((col) => col.accessorKey),
  );
  const [fileName, setFileName] = React.useState(
    defaultFileName.replaceAll("/", "-"),
  );

  const toggleKey = (accessorKey) => {
    setSelectedKeys((prev) =>
      prev.includes(accessorKey)
        ? prev.filter((key) => key !== accessorKey)
        : [...prev, accessorKey],
    );
  };

  const toggleAll = () => {
    setSelectedKeys((prev) =>
      prev.length === exportableColumns.length
        ? []
        : exportableColumns.map((col) => col.accessorKey),
    );
  };

  const handleExport = () => {
    startExport({
      path,
      columns: exportableColumns,
      selectedKeys,
      columnFilters,
      searchValue,
      isDeveloper,
      userId,
      fileName: fileName || "export",
    });
    onClose();
  };

  return (
    <div className="bg-dark/50 dark:bg-dark-mode/90 fixed inset-0 z-999 flex justify-center items-center overflow-y-auto animate-fadeIn">
      <div
        className="p-1 min-w-[350px] animate-slideUp w-full max-w-lg my-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col max-h-[90vh]">
          <div className="modal-header relative p-4">
            <CloseButton handleClose={onClose} disabled={false} />
            <h3 className="text-dark dark:text-light text-sm">Export data</h3>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <label className="text-xs font-bold block mb-1">File name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full mb-4 text-sm h-9 px-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0b111e] rounded"
              data-testid="export-filename"
            />

            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold">Fields to export</label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-primary hover:underline"
                data-testid="export-toggle-all"
              >
                {selectedKeys.length === exportableColumns.length
                  ? "Deselect all"
                  : "Select all"}
              </button>
            </div>

            <ul className="grid grid-cols-2 gap-2">
              {exportableColumns.map((col) => (
                <li key={col.accessorKey}>
                  <label className="grid grid-cols-[1rem_1fr] items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedKeys.includes(col.accessorKey)}
                      onChange={() => toggleKey(col.accessorKey)}
                      data-testid={`export-field-${col.accessorKey}`}
                    />
                    <span className="capitalize truncate">{col.header}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="btn--outline--gray"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={selectedKeys.length === 0}
              className="btn--green disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="export-submit"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
