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
      name: ["default-status"],
      label: "Active",
      value: 1,
    },
    {
      name: ["default-status"],
      label: "Inactive",
      value: 0,
    },
    {
      name: ["restocked-status"],
      label: "Restock returned",
      value: 1,
    },
    {
      name: ["restocked-status"],
      label: "",
      value: 0,
    },
    {
      name: ["installment-status"],
      label: "paid",
      value: 1,
    },
    {
      name: ["installment-status"],
      label: "overdue",
      value: 0,
    },
    {
      name: ["stock-overview"],
      label: "out of stock",
      value: "out of stock",
    },
    {
      name: ["purchase-order-status"],
      label: "for delivery",
      value: "for delivery",
    },
    {
      name: ["purchase-order-status"],
      label: "delivered - incomplete / paid",
      value: "delivered - incomplete / paid",
    },
    {
      name: ["purchase-order-status"],
      label: "delivered - incomplete / unpaid",
      value: "delivered - incomplete / unpaid",
    },
    {
      name: ["purchase-order-status"],
      label: "delivered - completed / paid",
      value: "delivered - completed / paid",
    },
    {
      name: ["purchase-order-status"],
      label: "delivered - completed / unpaid",
      value: "delivered - completed / unpaid",
    },
    {
      name: ["purchase-order-status"],
      label: "not delivered / paid",
      value: "not delivered / paid",
    },
    {
      name: ["purchase-order-status"],
      label: "not delivered / unpaid",
      value: "not delivered / unpaid",
    },
    {
      name: ["stock-overview"],
      label: "in stock",
      value: "in stock",
    },
    {
      name: ["stock-overview"],
      label: "low stock",
      value: "low stock",
    },

    {
      name: ["default-status-words"],
      label: "active",
      value: "active",
    },
    {
      name: ["default-status-words"],
      label: "inactive",
      value: "inactive",
    },
    {
      name: ["payment-status"],
      label: "unpaid",
      value: "unpaid",
    },
    {
      name: ["payment-status"],
      label: "paid",
      value: "paid",
    },
    {
      name: ["payment-status"],
      label: "partial",
      value: "partial",
    },
    {
      name: ["payment-status", "purchase-order-status"],
      label: "inactive",
      value: "inactive",
    },
    {
      name: ["payment-status"],
      label: "overdue",
      value: "overdue",
    },

    {
      name: ["stock-type-status"],
      label: "IN STOCK",
      value: "in stock",
    },
    {
      name: ["stock-type-status"],
      label: "PURCHASES",
      value: "purchases",
    },
    {
      name: ["stock-type-status"],
      label: "STOCK IN ADJUSTMENTS",
      value: "stock in adjustments",
    },
    {
      name: ["stock-type-status"],
      label: "STOCK OUT - SALES",
      value: "stock out - sales",
    },
    {
      name: ["stock-type-status"],
      label: "STOCK OUT - REJECT/DEFECTIVE ITEMS",
      value: "stock out - reject/defective items",
    },
    {
      name: ["return-status"],
      label: "pending",
      value: "pending",
    },
  ];

  return result.filter((item) => item.name.includes(val));
};
export const variantsStatus = (val = "active") => {
  const variants = {
    // default-status || default-status-words
    active: "bg-success/20 text-success",
    inactive: "bg-gray-100 text-gray-500",
    // stock-overview
    out_of_stock: "bg-gray-100 text-gray-500",
    in_stock: "bg-success/20 text-success",
    low_stock: "bg-warning/10 text-warning",
    // payment-status
    unpaid: "bg-gray-300 text-gray-700",
    paid: "bg-success/20 text-success",
    partial: "bg-blue-300 text-blue-700",
    overdue: "bg-red-100 text-red-500",
    // stock-type-status
    stock_in_adjustments: "bg-blue-300 text-blue-700",
    purchases: "bg-violet-300 text-violet-700 ",
    stock_out__sales: "bg-gray-100 text-gray-500",
    stock_out__reject_defectiveitems: "bg-warning/10 text-warning",
    // other
    draft: "bg-gray-300 text-gray-700",
    warning: "bg-warning/10 text-warning",
    alert: "bg-alert/10 text-alert",
    for_delivery: "bg-orange-100 text-orange-500",
    delivered__completed__paid: "bg-green-100 text-green-500",
    delivered__completed__unpaid: "bg-blue-100 text-blue-500",
    delivered__incomplete__paid: "bg-purple-100 text-purple-500",
    delivered__incomplete__unpaid: "bg-teal-100 text-teal-500",
    not_delivered__paid: "bg-gray-100 text-gray-500",
    not_delivered__unpaid: "bg-red-100 text-red-500",
    // return-status
    pending: "bg-warning/10 text-warning",
  };

  return variants[
    val
      ?.toLowerCase()
      ?.replaceAll(" ", "_")
      ?.replaceAll("-", "")
      ?.replaceAll("/", "")
  ];
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
