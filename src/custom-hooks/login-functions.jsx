import { devNavUrl } from "../config/config";

export const checkRoleToRedirect = (navigate, data) => {
  navigate(`${devNavUrl}/${data.user_account_role?.toLowerCase()}/dashboard`);
};
