import { devNavUrl } from "../config/config";

export const checkRoleToRedirect = (navigate, data) => {
  navigate(`${devNavUrl}/${data.role?.toLowerCase()}/dashboard`);
};
