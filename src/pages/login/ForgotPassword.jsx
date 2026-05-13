import LogoFull from "@/assets/svg/LogoFull";
import { InputLogin } from "@/components/inputs/InputText";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import { apiVersion, devNavUrl } from "@/config/config";
import { checkRoleToRedirect } from "@/custom-hooks/login-functions";
import { queryData } from "@/services/queryData";
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
import { Check, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const ForgotPassword = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [passwordShown, setPasswordShown] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(`${apiVersion}/users/forget-password`, "post", values),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["other"] });

      // show error box
      if (!data.success) {
        // success
      } else {
        setIsSuccess(true);
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
  };

  const yupSchema = Yup.object({
    user_account_email: Yup.string().trim().email("Invalid email"),
  });

  React.useEffect(() => {
    dispatch(setError(false));
    dispatch(setSuccess(false));
    dispatch(setMessage(""));
  }, []);

  return (
    <>
      {isSuccess ? (
        <div
          className="relative flex justify-center items-center "
          style={{ transform: "translateY(clamp(5rem,12vw,8rem))" }}
        >
          <div className="w-96 p-6">
            <div className="flex justify-center items-center flex-col">
              <LogoFull />
            </div>
            <Check className="h-16 w-16 mx-auto mt-8" color="rgb(0 145 38)" />
            <h2 className="mb-4 mt-2 text-lg text-center">Success!</h2>
            <p className="text-sm text-justify mb-6">
              We have sent instructions to reset your password. If you haven't
              received the email, please check your spam or junk folder as well.
            </p>

            <p className="mt-2 text-sm">
              Go back to{" "}
              <a href={`${devNavUrl}/login`} className="w-full text-primary">
                <u> login</u>
              </a>
            </p>
          </div>
        </div>
      ) : (
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

              <p className="mt-8 mb-0 text-lg font-bold uppercase text-white font-inter-bold">
                forgot password?
              </p>
              <small className="uppercase text-gray-300">
                Don't worry! It happens. Please enter the email address
                associated With YOur account.
              </small>
              <Formik
                initialValues={initVal}
                validationSchema={yupSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  // mutate data
                  dispatch(setError(false));

                  mutation.mutate(values);
                }}
              >
                {(props) => {
                  return (
                    <Form className="text-sm mt-8">
                      <div className="relative mb-2">
                        <InputLogin
                          placeholder="ENTER EMAIL ADDRESS"
                          icon={<User className="text-white" />}
                          type="text"
                          name="user_account_email"
                          className="text-white"
                          disabled={mutation.isPending}
                        />
                      </div>

                      {store.error && (
                        <div className="bg-light p-2 rounded-sm mb-3 border-b border-b-red-600">
                          <p className="m-0 text-red-600">
                            Invalid email.
                            <br />
                            <br /> In case you forgot your account,
                            <br /> please contact administrator
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-1 pt-3">
                        <button
                          type="submit"
                          disabled={mutation.isPending || !props.dirty}
                          className="btn-modal-submit-login p-3 uppercase "
                        >
                          {mutation.isPending ? <ButtonSpinner /> : "reset"}
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
              <p className="mt-4 text-xs text-white text-right ">
                Back to{" "}
                <Link
                  className="cursor-pointer hover:text-accent-light underline font-inter-regular"
                  to={`${devNavUrl}/`}
                >
                  login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
