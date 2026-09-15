import { AmountWithPesoSign } from "@/components/PesoSign";

const MiniStatCard = ({ icon, iconColor, label, amount }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-transparent hover:border-gray-300 hover:shadow-md transition-all duration-300 ease-in-out">
    <p className="xs:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <span className={iconColor}>{icon}</span>
      {label}
    </p>
    <p className={`${iconColor} font-semibold`}>
      <AmountWithPesoSign classN={"size-3"} amount={amount} />
    </p>
  </div>
);

export default MiniStatCard;
