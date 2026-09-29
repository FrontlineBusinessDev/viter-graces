import { exportRowsToXlsx } from "@/utilities/exportWorkbook";

// keeps all amount cells as real numbers (not pre-formatted currency strings)
// so they import cleanly into a spreadsheet and never trip up a CSV parser
const toAmount = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? Math.round(num * 100) / 100 : 0;
};

// builds and downloads an Excel snapshot of the Sales Order Details modal,
// mirroring the metadata / line items / financial summary sections shown there
export async function exportSalesOrderCsv(itemEdit) {
  if (!itemEdit) {
    return;
  }

  const items = itemEdit.items ?? [];
  const totalBalance = toAmount(itemEdit.total_amount) - toAmount(itemEdit.total_paid);

  const metaRows = [
    ["Order ID", itemEdit.sales_order_number ?? ""],
    ["Customer Name", itemEdit.sales_order_customer_name ?? ""],
    ["Order Date", itemEdit.sales_order_date ?? ""],
    ["Received By", itemEdit.sales_order_received_by_name ?? ""],
    ["Payment Method", itemEdit.sales_order_payment_method ?? ""],
    ["Payment Status", itemEdit.sales_order_status ?? ""],
    ["Payment Terms", itemEdit.sales_order_payment_terms ?? ""],
    ["Notes", itemEdit.sales_order_notes ?? ""],
  ];
  const tableHeaderRow = ["#", "Products", "QTY", "Price Per Unit", "Total"];

  const rows = [
    ...metaRows,
    [],
    tableHeaderRow,
    ...items.map((item, index) => [
      index + 1,
      item?.sales_order_product_name ?? "",
      toAmount(item?.sales_order_qty),
      toAmount(item?.sales_order_price),
      toAmount(item?.sales_order_total),
    ]),
    [],
    ["Subtotal", "", "", "", toAmount(itemEdit.total_sub_amount)],
    ["Discount", "", "", "", toAmount(itemEdit.sales_order_discount)],
    ["Tax", "", "", "", toAmount(itemEdit.sales_order_tax_amount)],
    ["Total Amount", "", "", "", toAmount(itemEdit.total_amount)],
    ["Total Paid", "", "", "", toAmount(itemEdit.total_paid)],
    ["Balance Due", "", "", "", totalBalance < 0 ? 0 : totalBalance],
  ];

  const fileName = `sales-order-${String(itemEdit.sales_order_number ?? "order").replaceAll("/", "-")}`;
  await exportRowsToXlsx({
    rows,
    fileName,
    title: `Sales Order ${itemEdit.sales_order_number ?? ""}`,
    sheetName: "Order",
    headerRowIndexes: [...metaRows.keys(), metaRows.length + 1],
  });
}
