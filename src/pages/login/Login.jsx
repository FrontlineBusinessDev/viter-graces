import LogoFull from "@/assets/svg/LogoFull";
import { InputLogin } from "@/components/inputs/InputText";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import FetchingSpinner from "@/components/spinners/FetchingSpinner";
import { apiVersion, devNavUrl, isDemoMode } from "@/config/config";
import { checkRoleToRedirect } from "@/custom-hooks/login-functions";
import { queryData } from "@/services/queryData";
import userAccountLogin from "@/services/userAccountLogin";
import {
  setCredentials,
  setError,
  setIsLogin,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { setStorageRoute } from "@/utilities/setStorageRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import {
  Banknote,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const demoAccounts = [
  {
    role: "admin",
    label: "Admin",
    icon: ShieldCheck,
    email: "cyrene.lumabas@frontlinebusiness.com.ph",
    password: "A!a123123123",
  },
  {
    role: "product_owner",
    label: "Product Owner",
    icon: Briefcase,
    email: "thealyconsignadoo@gmail.com",
    password: "A!a123123123",
  },
  {
    role: "cashier",
    label: "Cashier",
    icon: Banknote,
    email: "thea.consignado@frontlinebusiness.com.ph",
    password: "A!a123123123",
  },
];

const Login = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [passwordShown, setPasswordShown] = React.useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = React.useState(null);
  const navigate = useNavigate();
  const { loginLoading } = userAccountLogin(navigate);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(`${apiVersion}/users/login`, "post", values),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["other"] });

      // show error box
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      } else {
        if (store.isLogin) {
          dispatch(setCredentials(data.data[0]));
          setStorageRoute(data.data[1]);
          dispatch(setIsLogin(false));
          checkRoleToRedirect(navigate, data.data[0]);
        }
      }
    },
  });

  const initVal = {
    user_account_email: "",
    password: "",
  };

  const yupSchema = Yup.object({
    user_account_email: Yup.string().trim().email("Invalid email"),
    password: Yup.string().trim(),
  });

  React.useEffect(() => {
    dispatch(setError(false));
    dispatch(setSuccess(false));
    dispatch(setMessage(""));
  }, []);

  return (
    <>
      <div className="bg-dark-bg h-dvh ">
        {loginLoading ? (
          <FetchingSpinner />
        ) : (
          <div
            className="flex justify-center items-center bg-dark-bg "
            style={{ transform: "translateY(clamp(5rem,12vw,8rem))" }}
          >
            <div className="m-auto p-6">
              <div className="flex justify-center items-center flex-col">
                <LogoFull />
              </div>
              <div className="w-88! m-auto!  ">
                <p className="mt-8 mb-0 text-xl uppercase text-white font-inter-bold font-bold">
                  LOG IN
                </p>
                <small className="uppercase text-gray-300">
                  Please Login using your account{" "}
                </small>
              </div>
              <Formik
                initialValues={initVal}
                validationSchema={yupSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  dispatch(setError(false));

                  // mutate data
                  mutation.mutate(values);
                }}
              >
                {(props) => {
                  return (
                    <Form className="text-sm mt-8">
                      <div className="w-88! m-auto! ">
                        <div className="relative mb-5">
                          <InputLogin
                            placeholder="EMAIL"
                            icon={<User className="text-gray-400!" />}
                            type="text"
                            name="user_account_email"
                            className="text-white disabled:text-gray-400!"
                            disabled={mutation.isPending}
                          />
                        </div>
                        <div className="relative mb-6">
                          <InputLogin
                            placeholder="PASSWORD"
                            icon={<Lock className="text-gray-400! " />}
                            type={passwordShown ? "text" : "password"}
                            name="password"
                            className="text-white disabled:text-gray-400!"
                            disabled={mutation.isPending}
                          />
                          {props.values.password && (
                            <span
                              className="text-base absolute bottom-1/2 right-2 translate-y-1/2 cursor-pointer"
                              onClick={togglePassword}
                            >
                              {passwordShown ? (
                                <Eye className="text-gray-400!" />
                              ) : (
                                <EyeOff className="text-gray-400!" />
                              )}
                            </span>
                          )}
                        </div>

                        {store.error && (
                          <div className="bg-light p-2 rounded-sm mb-3 border-b border-b-red-600">
                            <p className="m-0 text-red-600">
                              Invalid email or password.
                              <br />
                              <br /> In case you forgot your password,
                              <br /> please reset your password by clicking the
                              reset password link below.
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-1 pt-3">
                          <button
                            type="submit"
                            disabled={mutation.isPending || !props.dirty}
                            className="btn-modal-submit-login p-3 uppercase "
                          >
                            {mutation.isPending ? <ButtonSpinner /> : "Login"}
                          </button>
                        </div>
                        <p className="mt-4 text-xs text-white text-right  ">
                          <Link
                            className="cursor-pointer hover:text-accent-light font-inter-regular"
                            to={`${devNavUrl}/forgot-password`}
                          >
                            Forgot password?
                          </Link>
                        </p>
                      </div>
                      {isDemoMode ? (
                        <div className="mt-6 p-3 rounded-lg border border-gray-600 bg-white/5 w-100!">
                          <span className="block mb-2 text-xs uppercase text-gray-300">
                            Quick Demo Login
                          </span>
                          <div className="flex flex-col gap-2">
                            {demoAccounts.map((account) => {
                              const Icon = account.icon;
                              const isSelected =
                                selectedDemoRole === account.role;
                              return (
                                <button
                                  key={account.role}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDemoRole(account.role);
                                    props.setFieldValue(
                                      "user_account_email",
                                      account.email,
                                      true,
                                    );
                                    props.setFieldValue(
                                      "password",
                                      account.password,
                                      true,
                                    );
                                    props.setFieldTouched(
                                      "user_account_email",
                                      true,
                                    );
                                    props.setFieldTouched("password", true);
                                  }}
                                  className={`flex items-center gap-2 p-2 rounded-md text-left border transition-colors duration-150 ${
                                    isSelected
                                      ? "border-primary bg-primary/10"
                                      : "border-gray-600 hover:border-gray-400"
                                  }`}
                                >
                                  <Icon
                                    size={16}
                                    className={
                                      isSelected
                                        ? "text-primary"
                                        : "text-gray-400!"
                                    }
                                  />
                                  <span className="text-xs text-white font-inter-bold">
                                    {account.label}
                                  </span>
                                  <span className="text-xs text-gray-400 truncate">
                                    {account.email}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
