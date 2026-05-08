import HeaderNav from "@/layout/headers/HeaderNav";
import React from "react";
import ReportsStats from "../ReportsStats";

const ProfitAddLoss = () => {
  return (
    <HeaderNav menu={"reports"} activeTab="profit-&-loss">
      <ReportsStats />
      <div className="max-w-2xl my-4 place-self-center text-sm ">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="" className="text-black dark:text-light">
              From
            </label>
            <input type="date" />
          </div>
          <div>
            <label htmlFor="" className="text-black dark:text-light">
              To
            </label>
            <input type="date" />
          </div>
          <div>
            <label htmlFor="" className="text-black dark:text-light">
              Product Owner
            </label>
            <select name="" id="">
              <option value="">Louren Rubico</option>
              <option value="">Cyrene Lumabas</option>
            </select>
          </div>
        </div>

        <div className="my-3 space-y-3">
          {/* Profit and loss */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full `}
          >
            <h1 className="text-black dark:text-light md:text-2xl text-lg">
              Profit and Loss
            </h1>
            <div className="flex justify-between mt-3">
              <p>As of April 13, 2026</p>
              <p>
                Product Owner:{" "}
                <span className="text-black dark:text-light font-semibold">
                  Louren Rubico
                </span>
              </p>
            </div>
          </div>

          {/* Income */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full `}
          >
            <p className="text-yellow-500 font-semibold">INCOME</p>
            <ul className="grid grid-cols-2 indent-3 gap-2 border-b pb-2">
              <li>Gross Sales</li>
              <li className="text-black dark:text-light text-right">
                ₱6,722.00
              </li>
              <li className="text-red-500">Less: Discounts</li>
              <li className="text-red-500 text-right">₱-10.00</li>
            </ul>
            <div className="flex justify-between mt-3 text-black dark:text-white font-semibold">
              <p>Net Sales</p>
              <p>₱6,722.00</p>
            </div>
          </div>

          {/* Cost of goods sold */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full `}
          >
            <p className="text-orange-500 font-semibold">COST OF GOODS SOLD</p>
            <ul className="grid grid-cols-2 indent-3 gap-2 border-b pb-2">
              <li>Cost of Goods Sold</li>
              <li className="text-black dark:text-light text-right">
                ₱3,100.00
              </li>
            </ul>
            <div className="flex justify-between mt-3 text-black dark:text-white font-semibold">
              <p>Total Cost of Goods Sold</p>
              <p>₱3,100.00</p>
            </div>
          </div>

          {/* Gross Profit */}
          <div
            className={`bg-[#ECFDF5] dark:bg-[#ECFDF5]/30 rounded-xl p-5 shadow-xs w-full flex justify-between items-center `}
          >
            <div>
              <p className=" text-black dark:text-white font-semibold">
                Gross Profit
              </p>
              <p>Gross Margin: 53.8%</p>
            </div>
            <p className="text-green-500 md:text-xl text-lg font-semibold ">
              ₱3,612.00
            </p>
          </div>

          {/* Operating Expenses */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full `}
          >
            <p className="text-red-500 font-semibold">OPERATING EXPENSES</p>
            <ul className="grid grid-cols-2 indent-3 gap-2 border-b pb-2">
              <li>Rent</li>
              <li className="text-black dark:text-light text-right">
                ₱2,500.00
              </li>
              <li>Salaries</li>
              <li className="text-black dark:text-light text-right">
                ₱8,000.00
              </li>
              <li>Utilities</li>
              <li className="text-black dark:text-light text-right">₱350.00</li>
              <li>Marketing</li>
              <li className="text-black dark:text-light text-right">₱600.00</li>
              <li>Supplies</li>
              <li className="text-black dark:text-light text-right">₱180.00</li>
            </ul>
            <div className="flex justify-between mt-3 text-black dark:text-white font-semibold">
              <p>Total Operating Expenses</p>
              <p>₱11,630.00</p>
            </div>
          </div>

          {/* Operating Income */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full flex justify-between `}
          >
            <p className="text-red-500 font-semibold">Operating Income</p>
            <p className="text-red-500 font-semibold">₱-8,018.00</p>
          </div>

          {/* Net Income */}
          <div
            className={`bg-red-500 dark:bg-red-500/30 rounded-xl p-5  shadow-xs w-full flex justify-between `}
          >
            <p className="text-light font-semibold md:text-lg text-base">
              Net Income
            </p>
            <p className="text-light font-semibold md:text-xl text-lg">
              ₱-8,018.00
            </p>
          </div>
        </div>
      </div>
    </HeaderNav>
  );
};

export default ProfitAddLoss;
