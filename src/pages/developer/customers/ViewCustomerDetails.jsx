import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { devNavUrl } from "@/config/config";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import {
  FileText,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Phone,
  PhilippinePeso,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

// One of the 4 top metric cards (Total Orders / Total Spent / Outstanding
// Balance / Credit Memo) - icon + label stacked over the value.
const MetricCard = ({ icon, label, children, onClick }) => {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex items-start gap-3 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-left bg-light dark:bg-gray-900 w-full ${
        onClick ? "cursor-pointer hover:border-primary" : ""
      }`}
    >
      <span className="text-primary shrink-0 mt-0.5">{icon}</span>
      <span className="flex flex-col min-w-0">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-black dark:text-light font-bold break-all">
          {children}
        </span>
      </span>
    </Tag>
  );
};

// One row under "Contact Information" - icon + value, with a shared
// "Not provided" empty state for anything the customer didn't fill in.
const ContactRow = ({ icon, value, href }) => {
  const hasValue = isEmptyItem(value, "") !== "";

  return (
    <li className="flex items-center gap-3">
      <span className="text-primary shrink-0">{icon}</span>
      {hasValue ? (
        href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-light underline decoration-dotted break-all"
          >
            {value}
          </a>
        ) : (
          <span className="text-black dark:text-light break-all">
            {value}
          </span>
        )
      ) : (
        <span className="text-gray-400 dark:text-gray-500">
          Not provided
        </span>
      )}
    </li>
  );
};

const ViewCustomerDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const navigate = useNavigate();
  const userRole = store.credentials?.data?.role;
  const isActive = Number(itemEdit?.is_active) === 1;

  const handleClose = () => {
    dispatch(setIsView(false));
  };

  // Filters the Returns page by this customer AND resolution type "credit
  // memo" - matches the same click-through the Customers table's own
  // "Open Credit Memo" column already does.
  const handleOpenCreditMemoClick = () => {
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
      itemEdit={itemEdit}
      mutation={false}
      isOpen={true}
      handleClose={handleClose}
      width="max-w-2xl!"
    >
      <div className="modal-body">
        {/* HEADER: name + status badge, address underneath */}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-black dark:text-light m-0!">
            {itemEdit?.customer_name}
          </h2>
          <Pills variant={isActive ? "active" : "inactive"}>
            {isActive ? "active" : "inactive"}
          </Pills>
        </div>
        <p className="text-gray-500 text-sm mt-1 mb-5">
          {isEmptyItem(itemEdit?.customer_address, "Not provided")}
        </p>

        {/* METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <MetricCard icon={<ShoppingBag size={18} />} label="Total Orders">
            {isEmptyItem(itemEdit?.number_of_orders, 0)}
          </MetricCard>
          <MetricCard icon={<PhilippinePeso size={18} />} label="Total Spent">
            <AmountWithPesoSign
              classAmnt="justify-start! "
              classN="size-3 "
              amount={`${isEmptyItem(itemEdit?.total_amount_spent, 0)}`}
            />
          </MetricCard>
          <MetricCard icon={<Wallet size={18} />} label="Outstanding Balance">
            <AmountWithPesoSign
              classAmnt="justify-start! "
              classN="size-3"
              amount={`${isEmptyItem(itemEdit?.outstanding_balance, 0)}`}
            />
          </MetricCard>
          <MetricCard
            icon={<FileText size={18} />}
            label="Credit Memo"
            onClick={handleOpenCreditMemoClick}
          >
            <AmountWithPesoSign
              classAmnt="justify-start! "
              classN="size-3"
              amount={`${isEmptyItem(itemEdit?.open_credit_memo, 0)}`}
            />
          </MetricCard>
        </div>

        {/* CONTACT INFORMATION */}
        <h3 className="font-bold text-black dark:text-light text-base mb-3">
          Contact Information
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-6">
          <ContactRow
            icon={<Mail size={16} />}
            value={itemEdit?.customer_email}
            href={
              itemEdit?.customer_email
                ? `mailto:${itemEdit.customer_email}`
                : undefined
            }
          />
          <ContactRow
            icon={<Phone size={16} />}
            value={itemEdit?.customer_phone}
          />
          <ContactRow
            icon={<MessageCircle size={16} />}
            value={itemEdit?.customer_messenger}
            href={itemEdit?.customer_messenger}
          />
          <ContactRow
            icon={<MessageSquare size={16} />}
            value={itemEdit?.customer_whatsapp}
            href={itemEdit?.customer_whatsapp}
          />
          <ContactRow
            icon={<MoreHorizontal size={16} />}
            value={itemEdit?.customer_other}
            href={itemEdit?.customer_other}
          />
        </ul>

        {/* NOTES */}
        <h3 className="font-bold text-black dark:text-light text-base mb-2">
          Notes
        </h3>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 min-h-20 bg-light dark:bg-gray-900">
          {isEmptyItem(itemEdit?.customer_notes, "") !== "" ? (
            <p className="text-black dark:text-light text-sm m-0! wrap-break-word">
              {itemEdit?.customer_notes}
            </p>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm m-0!">
              Not provided
            </p>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewCustomerDetails;
