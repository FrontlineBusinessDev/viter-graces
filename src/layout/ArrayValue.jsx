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
      name: ["ar-finance"],
      label: "Due soon",
      value: "Due soon",
    },
    {
      name: ["ar-finance"],
      label: "Due tomorrow",
      value: "Due tomorrow",
    },
    {
      name: ["ar-finance"],
      label: "Due today",
      value: "Due today",
    },
    {
      name: ["ar-finance"],
      label: "Pending",
      value: "Pending",
    },
    {
      name: ["ar-finance"],
      label: "Overdue",
      value: "Overdue",
    },
    {
      name: ["ar-finance"],
      label: "Partial",
      value: "Partial",
    },
    {
      name: ["stock-overview"],
      label: "out of stock",
      value: "out of stock",
    },
    {
      name: ["purchase-order-status"],
      label: "draft",
      value: "draft",
    },
    {
      name: ["purchase-order-status"],
      label: "sent",
      value: "sent",
    },
    {
      name: ["purchase-order-status"],
      label: "confirmed",
      value: "confirmed",
    },
    {
      name: ["purchase-order-status"],
      label: "partially received",
      value: "partially received",
    },
    {
      name: ["purchase-order-status"],
      label: "received",
      value: "received",
    },
    // {
    //   name: ["purchase-order-status"],
    //   label: "open",
    //   value: "open",
    // },
    //
    // Draft, Sent, Confirmed, Received, Cancelled
    {
      name: [
        "payment-status",
        // "purchase-order-status",
        "purchase-order-payment-status",
      ],
      label: "paid",
      value: "paid",
    },
    // {
    //   name: ["purchase-order-status"],
    //   label: "partial",
    //   value: "partial",
    // },
    // {
    //   name: ["purchase-order-status"],
    //   label: "completed",
    //   value: "completed",
    // },
    {
      name: ["purchase-order-status"],
      label: "cancelled",
      value: "cancelled",
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
      name: ["payment-status", "purchase-order-payment-status"],
      label: "unpaid",
      value: "unpaid",
    },
    {
      name: ["purchase-order-payment-status"],
      label: "partially paid",
      value: "partially paid",
    },
    {
      name: ["payment-status"],
      label: "partial",
      value: "partial",
    },
    {
      // name: ["payment-status", "purchase-order-status"],
      name: ["payment-status"],
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
    // {
    //   name: ["stock-type-status"],
    //   label: "PURCHASES",
    //   value: "purchases",
    // },
    // {
    //   name: ["stock-type-status"],
    //   label: "STOCK IN ADJUSTMENTS",
    //   value: "stock in adjustments",
    // },
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
      name: ["stock-type-status"],
      label: "STOCK IN - RETURN",
      value: "stock in - return",
    },
    {
      name: ["return-status"],
      label: "pending",
      value: "pending",
    },
    {
      name: ["return-status"],
      label: "rejected",
      value: "rejected",
    },
    {
      name: ["return-status"],
      label: "processed",
      value: "processed",
    },
    {
      name: ["resolution-type"],
      label: "Refund",
      value: "refund",
    },
    {
      name: ["resolution-type"],
      label: "Credit Memo",
      value: "credit memo",
    },
    {
      name: ["resolution-type"],
      label: "Replacement",
      value: "replacement",
    },
    {
      name: ["return-display-status"],
      label: "Pending",
      value: "pending",
    },
    {
      name: ["return-display-status"],
      label: "Refunded",
      value: "refunded",
    },
    {
      name: ["return-display-status"],
      label: "Open",
      value: "open",
    },
    {
      name: ["return-display-status"],
      label: "Completed",
      value: "completed",
    },
    {
      name: ["return-display-status"],
      label: "Rejected",
      value: "rejected",
    },
    {
      // Fallback for legacy rows processed before resolution type existed on
      // this table - the backend CASE falls through to the raw status.
      name: ["return-display-status"],
      label: "Processed",
      value: "processed",
    },
    {
      // return_product_is_restocked is stored as 0/1 in the DB (see isYesOrNo
      // utility), not "yes"/"no" strings - values must match the raw column
      // for the server-side LIKE filter to find anything.
      name: ["restocked-status"],
      label: "YES",
      value: "1",
    },
    {
      name: ["restocked-status"],
      label: "NO",
      value: "0",
    },
    {
      name: ["purchase-movement-status"],
      label: "STOCK IN",
      value: "stock in",
    },
    {
      name: ["purchase-movement-status"],
      label: "TRANSFERRED",
      value: "transferred",
    },
  ];

  return result.filter((item) => item.name.includes(val));
};

export const PaymentTermsList = () => {
  const result = [
    {
      label: "due on receipt - due on the same day the sales order",
      value: "due on receipt - due on the same day the sales order",
    },
    { label: "installment", value: "Installment" },
    {
      label: "net 10 - due within 10 days",
      value: "net 10 - due within 10 days",
    },
    {
      label: "net 15 - due within 15 days",
      value: "net 15 - due within 15 days",
    },
    {
      label: "net 20 - due within 20 days",
      value: "net 20 - due within 20 days",
    },
    {
      label: "net 25 - due within 25 days",
      value: "net 25 - due within 25 days",
    },
    {
      label: "net 30 - due within 30 days",
      value: "net 30 - due within 30 days",
    },
  ];

  return result;
  // return result.filter((item) => item.id.includes(val));
};

export const PaymentMethodList = () => {
  const result = [
    { label: "cash", value: "cash" },
    { label: "check", value: "check" },
    { label: "online transaction", value: "online transaction" },
    { label: "mutiple payment", value: "mutiple payment" },
    { label: "credit memo", value: "credit memo" },
  ];

  return result;
};

export const RefundMethodList = () => {
  const result = [
    { label: "cash", value: "cash" },
    { label: "check", value: "check" },
    { label: "online transaction", value: "online transaction" },
  ];

  return result;
};

export const PaymentMethodInArList = () => {
  const result = [
    { label: "cash", value: "cash" },
    { label: "check", value: "check" },
    { label: "online transaction", value: "online transaction" },
    { label: "credit memo", value: "credit memo" },
    // { label: "mutiple payment", value: "mutiple payment" },
  ];

  return result;
};

export const InstallmentType = () => {
  const result = [
    { label: "monthly", value: "monthly" },
    { label: "weekly", value: "weekly" },
  ];

  return result;
};

export const InstallmentByType = (val = "monthly") => {
  if (val === "monthly") {
    let result = [];
    for (let i = 1; i <= 31; i++) {
      result.push({ value: i, label: i });
    }

    return result;
  }
  if (val === "weekly") {
    const result = [
      { label: "monday", value: "monday" },
      { label: "tuesday", value: "tuesday" },
      { label: "wednesday", value: "wednesday" },
      { label: "thursday", value: "thursday" },
      { label: "friday", value: "friday" },
    ];

    return result;
  }
};

export const variantsStatus = (val = "active") => {
  const variants = {
    // default-status || default-status-words
    active: "bg-success/20 text-success",
    inactive: "bg-gray-100 text-gray-500",
    // stock-overview
    out_of_stock: "bg-gray-100 text-gray-500",
    in_stock: "bg-success/20 text-success",
    stock_in: "bg-success/20 text-success",
    low_stock: "bg-warning/10 text-warning",
    transferred: "bg-blue-300 text-blue-700",
    // payment-status
    unpaid: "bg-gray-300 text-gray-700",
    paid: "bg-success/20 text-success",
    partial: "bg-blue-300 text-blue-700",
    partially_paid: "bg-blue-300 text-blue-700",
    overdue: "bg-red-100 text-red-500",
    due_soon: "bg-warning/10 text-warning",
    due_today: "bg-orange-100 text-orange-500",
    due_tomorrow: "bg-blue-300 text-blue-700",
    // stock-type-status
    stock_in_adjustments: "bg-blue-300 text-blue-700",
    purchases: "bg-violet-300 text-violet-700 ",
    stock_out__sales: "bg-gray-100 text-gray-500",
    stock_in__return: "bg-success/20 text-success",
    stock_out__reject_defectiveitems: "bg-warning/10 text-warning",
    // other
    draft: "bg-gray-300 text-gray-700",
    warning: "bg-warning/10 text-warning",
    alert: "bg-alert/10 text-alert",
    // purchase order status
    cancelled: "bg-orange-100 text-orange-500",
    open: "bg-purple-100 text-purple-500",
    completed: "bg-teal-100 text-teal-500",
    sent: "bg-blue-300 text-blue-700",
    confirmed: "bg-violet-300 text-violet-700 ",
    partially_received: "bg-blue-300 text-blue-700",
    received: "bg-success/20 text-success",
    // return-status
    pending: "bg-warning/10 text-warning",
    processed: "bg-primary/10 text-primary",
    approved: "bg-success/20 text-success",
    rejected: "bg-blue-100 text-blue-500",
    // return-display-status (open/completed already covered by purchase-order-status above)
    refunded: "bg-primary/10 text-primary",
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
      filter_status: [
        "status-with-view",
        "product_owner_sales_order",
        "po_product_owner",
        "finance_ar_product_owner",
        "finance_ap_product_owner",
        "customer-status",
      ],
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
        "finance-ar",
        "finance-ap",
        "edit-delete-status",
        "customer-status",
      ],
      name: "edit",
      path: path,
      icon: <Edit className="size-5 lg:size-4" />,
      isActive: 1,
      testId: "action-edit",
    },
    {
      filter_status: [
        "status-with-view",
        "finance-expenses",
        "default-status",
        "user-status",
        "customer-status",
      ],
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
      filter_status: [
        "status-with-view",
        "default-status",
        "finance-expenses",
        "user-status",
        "customer-status",
      ],
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
        "finance-expenses",
        "edit-delete-status",
        "customer-status",
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

export const taxOption = () => {
  let data = [
    { id: 0, name: "--" },
    { id: 1.12, name: "inclusive" },
    { id: 0.12, name: "exclusive" },
  ];

  return data;
};

export const discountTypeOption = () => {
  let data = [
    { id: "--", name: "--" },
    { id: "percentage", name: "percentage" },
    { id: "amount", name: "amount" },
  ];

  return data;
};
