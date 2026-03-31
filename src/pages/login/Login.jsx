import LogoFull from "@/assets/svg/LogoFull";
import { InputLogin } from "@/components/inputs/InputText";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import { apiVersion, devNavUrl } from "@/config/config";
import { checkRoleToRedirect } from "@/custom-hooks/login-functions";
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
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const Login = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [passwordShown, setPasswordShown] = React.useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) => queryData(`${apiVersion}/null`, "post", values),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["other"] });

      // show error box
      if (!data.success) {
        // success
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
    user_other_email: "",
    password: "",
  };

  const yupSchema = Yup.object({
    user_other_email: Yup.string().trim().email("Invalid email"),
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
        {/* <FetchingSpinner /> */}
        <div
          className="flex justify-center items-center bg-dark-bg "
          style={{ transform: "translateY(clamp(5rem,12vw,8rem))" }}
        >
          <div className="w-88 p-6">
            <div className="flex justify-center items-center flex-col">
              <LogoFull />
            </div>

            <p className="mt-8 mb-0 text-xl uppercase text-white font-inter-bold font-bold">
              LOG IN
            </p>
            <small className="uppercase text-gray-300">
              Please Login using your account{" "}
            </small>
            <Formik
              initialValues={initVal}
              validationSchema={yupSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                // mutate data
                mutation.mutate(values);
                dispatch(setError(false));
              }}
            >
              {(props) => {
                return (
                  <Form className="text-sm mt-8">
                    <div className="relative mb-5">
                      <InputLogin
                        placeholder="EMAIL"
                        icon={<User className="text-white" />}
                        type="text"
                        name="user_other_email"
                        className="text-white"
                        disabled={mutation.isPending}
                      />
                    </div>
                    <div className="relative mb-6">
                      <InputLogin
                        placeholder="PASSWORD"
                        icon={<Lock className="text-white" />}
                        type={passwordShown ? "text" : "password"}
                        name="password"
                        className="text-white"
                        disabled={mutation.isPending}
                      />
                      {props.values.password && (
                        <span
                          className="text-base absolute bottom-1/2 right-2 translate-y-1/2 cursor-pointer"
                          onClick={togglePassword}
                        >
                          {passwordShown ? <Eye /> : <EyeOff />}
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
                        className="btn-modal-submit p-3 uppercase "
                      >
                        {mutation.isPending ? <ButtonSpinner /> : "Login"}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <p className="mt-4 text-xs text-white text-right  ">
              <Link
                className="cursor-pointer hover:text-accent-light font-inter-regular"
                to={`${devNavUrl}/forgot-password`}
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
