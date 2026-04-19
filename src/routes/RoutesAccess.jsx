import { devNavUrl } from "@/config/config";
import CreatePassword from "@/pages/login/CreatePassword";
import ForgotPassword from "@/pages/login/ForgotPassword";
import Login from "@/pages/login/Login";
import ResetPassword from "@/pages/login/ResetPassword";

export const routesAccess = [
  {
    path: `${devNavUrl}/`,
    element: <Login />,
  },
  {
    path: `${devNavUrl}/login`,
    element: <Login />,
  },
  {
    path: `${devNavUrl}/forgot-password`,
    element: <ForgotPassword />,
  },
  {
    path: `${devNavUrl}/create-password`,
    element: <CreatePassword />,
  },
  {
    path: `${devNavUrl}/reset-password`,
    element: <ResetPassword />,
  },
];
