import {
  ArchiveRestore,
  Edit,
  KeySquare,
  LucideTableOfContents,
  RotateCcw,
  Trash,
} from "lucide-react";

export const ActiveInActiveStatus = () => {
  return [
    { label: "Active", value: 1 },
    { label: "Inactive", value: 0 },
  ];
};

export const PaymentStatus = () => {
  return [
    { label: "unpaid", value: "unpaid" },
    { label: "paid", value: "paid" },
    { label: "partial", value: "partial" },
  ];
};

export const StockTypeArray = () => {
  return [
    { label: "in stock", value: "in stock" },
    { label: "purchases", value: "purchases" },
    { label: "stock in adjustments", value: "stock in adjustments" },
    { label: "stock out - sales", value: "stock out - sales" },
    {
      label: "stock out - reject/defective items",
      value: "stock out - reject/defective items",
    },
  ];
};

// FOR TABLE ACTION
export const ActionTableList = ({ path }) => {
  return [
    {
      name: "view",
      path: path,
      icon: <LucideTableOfContents className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-view",
    },
    {
      name: "edit",
      path: path,
      icon: <Edit className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-edit",
    },
    {
      name: "archive",
      path: "active",
      icon: <ArchiveRestore className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-archive",
    },
    {
      name: "restore",
      path: "active",
      icon: <RotateCcw className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-restore",
    },
    {
      name: "delete",
      path: path,
      icon: <Trash className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-delete",
    },
  ];
};

// FOR TABLE ACTION
export const DefaultActionTableList = ({ path }) => {
  return [
    {
      name: "edit",
      path: path,
      icon: <Edit className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-edit",
    },
    {
      name: "archive",
      path: "active",
      icon: <ArchiveRestore className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-archive",
    },
    {
      name: "restore",
      path: "active",
      icon: <RotateCcw className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-restore",
    },
    {
      name: "delete",
      path: path,
      icon: <Trash className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-delete",
    },
  ];
};

// FOR TABLE ACTION
export const UserActionTableList = ({ path }) => {
  return [
    {
      name: "edit",
      path: path,
      icon: <Edit className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-edit",
    },
    {
      name: "archive",
      path: "active",
      icon: <ArchiveRestore className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-archive",
    },
    {
      name: "reset",
      path: "reset-password",
      icon: <KeySquare className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-reset",
    },
    {
      name: "restore",
      path: "active",
      icon: <RotateCcw className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-restore",
    },
    {
      name: "delete",
      path: path,
      icon: <Trash className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-delete",
    },
  ];
};

export const EditDeleteActionTableList = ({ path }) => {
  return [
    {
      name: "edit",
      path: path,
      icon: <Edit className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-edit",
    },
    {
      name: "delete",
      path: path,
      icon: <Trash className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-delete",
    },
  ];
};

export const ActivityLogDetails = (path, action, store, values) => {
  const data = {
    activity_log_menu: path,
    activity_log_action: action,
    activity_log_user_id: store?.credentials?.data?.id,
    activity_log_user_name: store?.credentials?.data?.name,
    activity_log_user_role: store?.credentials?.data?.role,
    activity_log_description: JSON.stringify([{ values }]),
  };

  return data;
};

export const ActivityLogResetPassDetails = (path, action, values) => {
  const data = {
    activity_log_menu: path,
    activity_log_action: action,
    activity_log_user_id: values?.id,
    activity_log_user_name: values?.name,
    activity_log_user_role: values?.role,
    activity_log_description: "",
  };

  return data;
};
