import { Plus } from "lucide-react";

const AddButton = ({ value = "Add", onClick = (e) => e }) => {
  return (
    <>
      <button className="btn--green " onClick={onClick}>
        <Plus size={16} />
        <span className="capitalize">{value}</span>
      </button>
    </>
  );
};

export default AddButton;
