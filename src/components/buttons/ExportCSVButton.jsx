import { Download } from "lucide-react";
import React from "react";

const ExportCSVButton = () => {
  return (
    <div className="my-4 place-self-center">
      <button className="btn--outline--gray flex items-center gap-2">
        <Download size={15} />
        Export CSV
      </button>
    </div>
  );
};

export default ExportCSVButton;
