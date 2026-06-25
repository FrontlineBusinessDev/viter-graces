import {
  ArchiveRestore,
  Edit,
  KeySquare,
  LucideTableOfContents,
  RotateCcw,
  Trash,
} from "lucide-react";

export const ActiveInActiveStatus = (val = "default-status") => {
  const result = [
    {
      name: "default-status",
      status: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
    },
    {
      name: "installment-status",
      status: [
        { label: "paid", value: 1 },
        { label: "overdue", value: 0 },
      ],
    },
    {
      name: "stock-overview",
      status: [
        { label: "out of stock", value: "out of stock" },
        { label: "in stock", value: "in stock" },
        { label: "low stock", value: "low stock" },
      ],
    },
    {
      name: "default-status-words",
      status: [
        { label: "active", value: "active" },
        { label: "inactive", value: "inactive" },
      ],
    },
    {
      name: "payment-status",
      status: [
        { label: "unpaid", value: "unpaid" },
        { label: "paid", value: "paid" },
        { label: "partial", value: "partial" },
        { label: "inactive", value: "inactive" },
        { label: "overdue", value: "overdue" },
      ],
    },
    {
      name: "stock-type-status",
      status: [
        { label: "IN STOCK", value: "in stock" },
        { label: "PURCHASES", value: "purchases" },
        { label: "STOCK IN ADJUSTMENTS", value: "stock in adjustments" },
        { label: "STOCK OUT - SALES", value: "stock out - sales" },
        {
          label: "STOCK OUT - REJECT/DEFECTIVE ITEMS",
          value: "stock out - reject/defective items",
        },
      ],
    },
  ];

  return result.find((item) => item.name === val)?.status ?? [];
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
