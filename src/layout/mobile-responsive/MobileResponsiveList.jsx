import CustomerMobile from "./CustomerMobile";
import InfiniteDefaultTableMobileCard from "./InfiniteDefaultTableMobileCard";
import ProductsMobileResponsive from "./ProductsMobileResponsive";

const MobileResponsiveList = ({
  rows,
  lastRowRef,
  setData = "",
  setItemEdit,
  isDefaultMobile = "default",
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
      {/* DEFAULT RESPONSIVE */}
      <InfiniteDefaultTableMobileCard
        rows={rows}
        lastRowRef={lastRowRef}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* CUSTOMER RESPONSIVE */}
      <CustomerMobile
        rows={rows}
        lastRowRef={lastRowRef}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
    </>
  );
};

export default MobileResponsiveList;
