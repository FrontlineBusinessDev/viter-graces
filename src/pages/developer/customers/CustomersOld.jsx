{
  isOpen && (
    <div className="border-t border-gray-400 px-4 lg:px-5 pb-4 pt-3  ">
      <InfiniteTable
        columns={columns}
        className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(100dvh-200px)]`}
        path="customer"
        setItemEdit={setItemEdit}
        haveFilterTable={false}
        isSearch={false}
        ishaveAdd={false}
      />
      <div className=" bg-white dark:bg-[#0b111e] overflow-x-hidden dark:border-gray-700 max-h-[300px] ">
        {/* desktop header */}

        <div className="hidden sticky top-0 lg:grid lg:grid-cols-7 lg:items-center border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 dark:bg-[#0b111e]">
          <div>#</div>
          <div>Order Number</div>
          <div>Date</div>
          <div>Items</div>
          <div>Paid</div>
          <div>Method</div>
          <div>Total</div>
        </div>

        {/* row */}
        <ul className="py-4 px-0 lg:py-4 lg:px-4 border-b lg:border-b-0">
          {/* mobile */}
          <li className="lg:hidden rounded-2xl border border-gray-200 bg-gray-50/80 dark:bg-[#101827] dark:border-gray-700 p-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-light">
                  {item.order_no}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.date}
                </p>
              </div>

              <p className="font-semibold text-gray-900 dark:text-light">
                ₱ {item.total}
              </p>
            </div>

            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
              <span>{item.method}</span>
              <span>₱ {item.paid}</span>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                className="text-green-700 hover:text-green-800 hover:underline"
                onClick={() => handleView(item)}
              >
                View Items
              </button>
            </div>
          </li>

          {/* desktop */}
          <li className="hidden lg:grid lg:grid-cols-7 gap-0 text-sm">
            <div>1</div>

            <div>{item.order_no}</div>

            <div>{item.date}</div>

            <div>
              <button
                className="text-green-700 hover:text-green-800 hover:underline"
                onClick={() => handleView(item)}
              >
                View Items
              </button>
            </div>

            <div>₱ {item.paid}</div>

            <div>{item.method}</div>

            <div className="font-semibold">₱ {item.total}</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
