import { useExport } from "@/store/ExportContext";
import { CheckCircle, CircleX, Download, X } from "lucide-react";
import React from "react";

const ExportProgressWidget = () => {
  const {
    isExporting,
    isDone,
    error,
    fetchedCount,
    totalCount,
    progress,
    fileName,
    cancelExport,
    dismiss,
  } = useExport() || {};

  if (!isExporting && !isDone && !error) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-999999! w-72 bg-light dark:bg-dark-mode rounded-lg shadow-lg border border-line animate-fadeIn"
      data-testid="export-progress-widget"
    >
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`size-7 rounded-full grid place-content-center shrink-0 ${
              error
                ? "bg-alert/20"
                : isDone
                  ? "bg-success/20"
                  : "bg-primary/20"
            }`}
          >
            {error ? (
              <CircleX className="stroke-alert" size={14} />
            ) : isDone ? (
              <CheckCircle className="stroke-success" size={14} />
            ) : (
              <Download className="stroke-primary" size={14} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-0 truncate">
              {error ? "Export failed" : isDone ? "Export complete" : "Exporting…"}
            </p>
            <p className="text-xs text-gray-500 mb-0 truncate">{fileName}</p>
          </div>
          {(isDone || error) && (
            <button
              onClick={dismiss}
              className="hover:bg-primary/20 hover:rounded-sm p-1 shrink-0"
              data-testid="export-widget-dismiss"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {isExporting && (
          <>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {fetchedCount} / {totalCount || "…"} rows
              </span>
              <button
                onClick={cancelExport}
                className="text-xs text-alert hover:underline"
                data-testid="export-widget-cancel"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {error && <p className="text-xs text-alert mb-0">{error}</p>}
      </div>
    </div>
  );
};

export default ExportProgressWidget;
