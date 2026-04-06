import HeaderNav from "@/layout/headers/HeaderNav";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
const Products = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      <HeaderNav menu={"products"}>
        <p>Ongoing development</p>
      </HeaderNav>
    </>
  );
};

export default Products;
