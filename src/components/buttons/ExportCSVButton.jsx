import { Download } from "lucide-react";
import React from "react";

const ExportCSVButton = ({ onClick = () => {} }) => {
  return (
    <div className="my-4 place-self-center">
      <button
        type="button"
        onClick={onClick}
        className="btn--outline--gray flex items-center gap-2"
        data-testid="export-csv-button"
      >
        <Download size={15} />
        Export CSV
      </button>
    </div>
  );
};

export default ExportCSVButton;
