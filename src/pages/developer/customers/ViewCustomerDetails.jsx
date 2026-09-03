import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { devNavUrl } from "@/config/config";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";
import { useNavigate } from "react-router-dom";

// one row of a simple mobile key/value list
const InfoRow = ({ label, children }) => (
  <li className="grid grid-cols-[8rem_1fr] items-center gap-3 ">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span className="text-black dark:text-light font-semibold break-all">
      {children}
    </span>
  </li>
);

// mobile social row - same active-link/placeholder rule as SocialLink, but
// laid out as a single key/value row to match the rest of the mobile list
const MobileSocialRow = ({ label, value }) => {
  const hasValue = isEmptyItem(value, "") !== "";

  return (
    <li className="grid grid-cols-[8rem_1fr] items-center gap-3 ">
      <span className="text-gray-500 shrink-0">{label}</span>
      {hasValue ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline break-all "
        >
          {value}
        </a>
      ) : (
        <span className="text-gray-400 dark:text-gray-500 ">Not provided</span>
      )}
    </li>
  );
};

const ViewCustomerDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const navigate = useNavigate();
  const userRole = store.credentials?.data?.role;

  const handleClose = () => {
    dispatch(setIsView(false));
  };

  // Action A: filter the Returns page by this customer AND resolution type
  // "credit memo"
  const handleOpenCreditMemoLabelClick = () => {
    sessionStorage.setItem(
      "filter",
      JSON.stringify([
        {
          id: "return_product_customer_name",
          value: itemEdit?.customer_name,
        },
        { id: "return_product_resolution_type", value: "credit memo" },
      ]),
    );
    dispatch(setIsView(false));
    navigate(`${devNavUrl}/${userRole}/returns`);
  };

  return (
    <ModalWrapper
      val={`Customer Details - ${itemEdit?.customer_name}`}
      itemEdit={itemEdit}
      mutation={false}
      isOpen={true}
      handleClose={handleClose}
    >
      <div className="modal-body">
        <ul className=" ">
          <InfoRow label="Status">
            <Pills
              variant={
                Number(itemEdit?.is_active) === 1 ? "active" : "inactive"
              }
            >
              {Number(itemEdit?.is_active) === 1 ? "active" : "inactive"}
            </Pills>
          </InfoRow>
          <InfoRow label="Email">
            {isEmptyItem(itemEdit?.customer_email, "--")}
          </InfoRow>
          <InfoRow label="Contact number">
            {isEmptyItem(itemEdit?.customer_phone, "--")}
          </InfoRow>
          <InfoRow label="Address">
            {isEmptyItem(itemEdit?.customer_address, "--")}
          </InfoRow>
          <MobileSocialRow
            label="Messenger"
            value={itemEdit?.customer_messenger}
          />
          <MobileSocialRow
            label="WhatsApp"
            value={itemEdit?.customer_whatsapp}
          />
          <MobileSocialRow label="Other" value={itemEdit?.customer_other} />
          <InfoRow label="Notes">
            {isEmptyItem(itemEdit?.customer_notes, "--")}
          </InfoRow>
          <InfoRow label="Number of Orders">
            {isEmptyItem(itemEdit?.number_of_orders, 0)}
          </InfoRow>
          <InfoRow label="Total Amount Spent">
            <AmountWithPesoSign
              classAmnt="justify-start! "
              classN="size-3 "
              amount={`${isEmptyItem(itemEdit?.total_amount_spent, 0)}`}
            />
          </InfoRow>
          <InfoRow label="Outstanding Balance">
            <AmountWithPesoSign
              classAmnt="justify-start! "
              classN="size-3"
              amount={`${isEmptyItem(itemEdit?.outstanding_balance, 0)}`}
            />
          </InfoRow>
          <li className="grid grid-cols-[8rem_1fr] items-center gap-3 ">
            <button
              type="button"
              className="text-gray-500 shrink-0 text-left underline decoration-dotted hover:text-primary cursor-pointer bg-transparent! p-0!"
            >
              Open Credit Memo
            </button>
            <button
              type="button"
              className="text-black dark:text-light font-semibold break-all text-left hover:text-primary cursor-pointer bg-transparent! p-0!"
            >
              <AmountWithPesoSign
                classAmnt="justify-start! "
                classN="size-3"
                amount={`${isEmptyItem(itemEdit?.open_credit_memo, 0)}`}
              />
            </button>
          </li>
        </ul>
      </div>
    </ModalWrapper>
  );
};

export default ViewCustomerDetails;
