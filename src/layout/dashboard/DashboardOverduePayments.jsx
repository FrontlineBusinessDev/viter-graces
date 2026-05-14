import { StoreContext } from "@/store/StoreContext";
import { TrendingDown } from "lucide-react";
import React from "react";
const DashboardOverduePayments = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const dashboardData = {
    overduePayments: [
      {
        name: "Carol Williams",
        order: "ORD-003",
        date: "Jan 15, 2026",
        amount: 699,
      },
      {
        name: "Juan Dela Cruz",
        order: "ORD-013",
        date: "Jan 18, 2026",
        amount: 2599,
      },
      {
        name: "Robert Samson",
        order: "ORD-018",
        date: "Feb 5, 2026",
        amount: 12599,
      },
    ],
  };

  return (
    <>
      {/* Overdue Payments */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow relative">
        <h2 className="flex gap-2 items-center font-semibold text-sm text-red-600 mb-4">
          <TrendingDown size={16} /> Overdue Payments
        </h2>
        <ul className="space-y-3 min-h-[300px]">
          {dashboardData.overduePayments.map((payment, idx) => (
            <li key={idx} className="flex justify-between">
              <div>
                <span className="font-medium text-xs text-black dark:text-light">
                  {payment.name} -{" "}
                  <span className="text-gray-500">{payment.order}</span>
                </span>
                <p className="text-gray-500 text-sm">{payment.date}</p>
              </div>
              <span className="text-red-600 font-semibold">
                ₱{payment.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="absolute bottom-3 text-orange-500 pt-3 inline-block"
        >
          Click to view →
        </a>
      </div>
    </>
  );
};

export default DashboardOverduePayments;
