import {
  ArchiveRestore,
  Edit,
  KeySquare,
  RotateCcw,
  Trash,
} from "lucide-react";

export const ActiveInActiveStatus = () => {
  return [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];
};
// FOR TABLE ACTION
export const DefaultActionTableList = () => {
  return [
    {
      name: "edit",
      path: "roles",
      icon: <Edit className="h-3 w-3" />,
      isActive: 1,
    },
    {
      name: "archieve",
      path: "active",
      icon: <ArchiveRestore className="h-3 w-3" />,
      isActive: 1,
    },
    {
      name: "delete",
      path: "roles",
      icon: <Trash className="h-3 w-3" />,
      isActive: 0,
    },
  ];
};
// FOR TABLE ACTION
export const UserActionTableList = () => {
  return [
    {
      name: "edit",
      path: "roles",
      icon: <Edit className="h-3 w-3" />,
      isActive: 1,
    },
    {
      name: "archieve",
      path: "active",
      icon: <ArchiveRestore className="h-3 w-3" />,
      isActive: 1,
    },
    {
      name: "reset",
      path: "active",
      icon: <KeySquare className="h-3 w-3" />,
      isActive: 1,
    },
    {
      name: "restore",
      path: "active",
      icon: <RotateCcw className="h-3 w-3" />,
      isActive: 0,
    },
    {
      name: "delete",
      path: "roles",
      icon: <Trash className="h-3 w-3" />,
      isActive: 0,
    },
  ];
};
