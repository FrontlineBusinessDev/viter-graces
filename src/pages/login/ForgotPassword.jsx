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
import { User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const ForgotPassword = () => {
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
    password: Yup.string().trim().required("Required"),
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

            <p className="mt-8 mb-0 text-lg font-bold uppercase text-white font-inter-bold">
              forgot password?
            </p>
            <small className="uppercase text-gray-300">
              Don't worry! It happens. Please enter the email address associated
              With YOur account.
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
                    <div className="relative mb-2">
                      <InputLogin
                        placeholder="ENTER EMAIL ADDRESS"
                        icon={<User className="text-white" />}
                        type="text"
                        name="user_other_email"
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
                        className="btn-modal-submit p-3 uppercase "
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
    </>
  );
};

export default ForgotPassword;
