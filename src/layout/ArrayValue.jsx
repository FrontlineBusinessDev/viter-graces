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
      label: "Active",
      value: 1,
    },
    {
      name: "default-status",
      label: "Inactive",
      value: 0,
    },
    {
      name: "installment-status",
      label: "paid",
      value: 1,
    },
    {
      name: "installment-status",
      label: "overdue",
      value: 0,
    },

    {
      name: "stock-overview",
      label: "out of stock",
      value: "out of stock",
    },
    {
      name: "stock-overview",
      label: "in stock",
      value: "in stock",
    },
    {
      name: "stock-overview",
      label: "low stock",
      value: "low stock",
    },

    {
      name: "default-status-words",
      label: "active",
      value: "active",
    },
    {
      name: "default-status-words",
      label: "inactive",
      value: "inactive",
    },
    {
      name: "payment-status",
      label: "unpaid",
      value: "unpaid",
    },
    {
      name: "payment-status",
      label: "paid",
      value: "paid",
    },
    {
      name: "payment-status",
      label: "partial",
      value: "partial",
    },
    {
      name: "payment-status",
      label: "inactive",
      value: "inactive",
    },
    {
      name: "payment-status",
      label: "overdue",
      value: "overdue",
    },

    {
      name: "stock-type-status",
      label: "IN STOCK",
      value: "in stock",
    },
    {
      name: "stock-type-status",
      label: "PURCHASES",
      value: "purchases",
    },
    {
      name: "stock-type-status",
      label: "STOCK IN ADJUSTMENTS",
      value: "stock in adjustments",
    },
    {
      name: "stock-type-status",
      label: "STOCK OUT - SALES",
      value: "stock out - sales",
    },
    {
      name: "stock-type-status",
      label: "STOCK OUT - REJECT/DEFECTIVE ITEMS",
      value: "stock out - reject/defective items",
    },
  ];

  return result.filter((item) => item.name === val);
};

export const ActionTableList = (path, val = "default-status") => {
  const result = [
    {
      filter_status: ["status-with-view"],
      name: "view",
      path: path,
      icon: <LucideTableOfContents className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-view",
    },
    {
      filter_status: [
        "status-with-view",
        "default-status",
        "user-status",
        "edit-delete-status",
      ],
      name: "edit",
      path: path,
      icon: <Edit className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-edit",
    },
    {
      filter_status: ["status-with-view", "default-status", "user-status"],
      name: "archive",
      path: "active",
      icon: <ArchiveRestore className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-archive",
    },
    {
      filter_status: ["user-status"],
      name: "reset",
      path: "reset-password",
      icon: <KeySquare className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-reset",
    },
    {
      filter_status: ["status-with-view", "default-status", "user-status"],
      name: "restore",
      path: "active",
      icon: <RotateCcw className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-restore",
    },
    {
      filter_status: ["edit-delete-status"],
      name: "delete",
      path: path,
      icon: <Trash className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-delete",
    },
    {
      filter_status: [
        "status-with-view",
        "default-status",
        "user-status",
        "edit-delete-status",
      ],
      name: "delete",
      path: path,
      icon: <Trash className="size-5 lg:size-4" />,
      isActive: 0,
      testId: "action-delete",
    },
  ];

  return result.filter((item) => item.filter_status.includes(val));
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
