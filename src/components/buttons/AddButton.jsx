import { Plus } from "lucide-react";

const AddButton = ({ value = "Add" }) => {
  return (
    <>
      <button className="btn--green ">
        <Plus size={16} />
        <span>{value}</span>
      </button>
    </>
  );
};

export default AddButton;
