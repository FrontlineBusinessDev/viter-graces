import CustomerMobileReponsive from "./CustomerMobileReponsive";
import InfiniteDefaultTableMobileCard from "./InfiniteDefaultTableMobileCard";
import OverviewMobileResponsive from "./OverviewMobileResponsive";
import ProductsMobileResponsive from "./ProductsMobileResponsive";

const MobileResponsiveList = ({
  rows,
  lastRowRef,
  setData = "",
  setItemEdit,
  setItemVal,
  isDefaultMobile = "",
  ishaveSubAdd = false,
}) => {
  return (
    <>
      {/* PRODUCT RESPONSIVE */}
      <ProductsMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        lastRowRef={lastRowRef}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* CUSTOMER RESPONSIVE */}
      <CustomerMobileReponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* STOCK OVERVIEW RESPONSIVE */}
      <OverviewMobileResponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* DEFAULT RESPONSIVE */}
      <InfiniteDefaultTableMobileCard
        rows={rows}
        lastRowRef={lastRowRef}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
    </>
  );
};

export default MobileResponsiveList;
