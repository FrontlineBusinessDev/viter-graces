import { Plus } from "lucide-react";

const AddButton = ({ value = "Add", onClick = (e) => e }) => {
  return (
    <>
      <button className="btn--green flex items-center py-2! " onClick={onClick}>
        <Plus size={15} />
        <span className="capitalize leading-0">{value}</span>
      </button>
    </>
  );
};

export default AddButton;
