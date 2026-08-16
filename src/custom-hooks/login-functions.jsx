import { devNavUrl } from "../config/config";

export const checkRoleToRedirect = (navigate, data) => {
  navigate(
    data.role?.toLowerCase().replaceAll(" ", "_") === "cashier"
      ? `${devNavUrl}/${data.role?.toLowerCase().replaceAll(" ", "_")}/sales`
      : `${devNavUrl}/${data.role?.toLowerCase().replaceAll(" ", "_")}/dashboard`,
  );
};
