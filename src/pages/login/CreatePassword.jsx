import LogoFull from "@/assets/svg/LogoFull";
import { InputText } from "@/components/inputs/InputText";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import { apiVersion } from "@/config/config";
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
import { CircleCheck, Eye, EyeOff } from "lucide-react";
import React from "react";
import * as Yup from "yup";

const CreatePassword = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [passwordShown, setPasswordShown] = React.useState(false);
  const [newPasswordShown, setNewPasswordShown] = React.useState(false);
  const [lowerValidated, setLowerValidated] = React.useState(false);
  const [upperValidated, setUpperValidated] = React.useState(false);
  const [numberValidated, setNumberValidated] = React.useState(false);
  const [specialValidated, setSpecialValidated] = React.useState(false);
  const [lengthValidated, setLengthValidated] = React.useState(false);

  const togglePassword = (val = "") => {
    if (val !== "new") {
      setPasswordShown(!passwordShown);
    } else {
      setNewPasswordShown(!newPasswordShown);
    }
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
    new_password: "",
    confirm_password: "",
  };

  const yupSchema = Yup.object({
    new_password: Yup.string()
      .trim()
      .required("Required")
      .min(8, "Password must be at least 8 characters.")
      .matches(/[a-z]/, "At least one lowercase letter.")
      .matches(/[A-Z]/, "At least one uppercase letter.")
      .matches("(?=.*[!@#$%^&*`{;:',<.>/?}_-])", "Atleast 1 special character.")
      .matches("(?=.*[0-9])", "Atleast 1 number."),
    confirm_password: Yup.string()
      .trim()
      .required("Required")
      .oneOf([Yup.ref("new_password"), null], "Passwords does not match."),
  });
  const handleChange = (value) => {
    const lower = new RegExp("(?=.*[a-z])");
    const upper = new RegExp("(?=.*[A-Z])");
    const number = new RegExp("(?=.*[0-9])");
    const special = new RegExp("(?=.*[!@#$%^&*`{;:',<.>/?}_-])");
    const length = new RegExp("(?=.{8,})");

    if (lower.test(value)) {
      setLowerValidated(true);
    } else {
      setLowerValidated(false);
    }
    if (upper.test(value)) {
      setUpperValidated(true);
    } else {
      setUpperValidated(false);
    }
    if (number.test(value)) {
      setNumberValidated(true);
    } else {
      setNumberValidated(false);
    }
    if (special.test(value)) {
      setSpecialValidated(true);
    } else {
      setSpecialValidated(false);
    }
    if (length.test(value)) {
      setLengthValidated(true);
    } else {
      setLengthValidated(false);
    }
  };

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

            <p className="mt-8 mb-0 text-lg font-bold uppercase text-white font-inter-bold ">
              create password
            </p>
            <small className="uppercase text-gray-300">
              Create a new password to regain access to your account. Make sure
              it's strong and secure.
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
                      <InputText
                        placeholder="CREATE PASSWORD"
                        name="new_password"
                        type={newPasswordShown ? "text" : "password"}
                        className="text-white"
                        disabled={mutation.isPending}
                        onChange={(e) => handleChange(e.target.value)}
                      />
                      {props.values.new_password && (
                        <span
                          className="text-base absolute bottom-1/2 right-2 translate-y-1/2 cursor-pointer"
                          onClick={() => togglePassword("new")}
                        >
                          {newPasswordShown ? <Eye /> : <EyeOff />}
                        </span>
                      )}
                    </div>
                    <div className="relative mb-6">
                      <InputText
                        placeholder="RE-ENTER PASSWORD"
                        type={passwordShown ? "text" : "password"}
                        name="confirm_password"
                        className="text-white"
                        disabled={mutation.isPending}
                        onChange={(e) => handleChange(e.target.value)}
                      />
                      {props.values.confirm_password && (
                        <span
                          className="text-base absolute bottom-1/2 right-2 translate-y-1/2 cursor-pointer"
                          onClick={() => togglePassword("")}
                        >
                          {passwordShown ? <Eye /> : <EyeOff />}
                        </span>
                      )}
                    </div>

                    <div className="py-3 rounded-sm mt-3 mb-6 text-sm">
                      <span className="block mb-1 italic">
                        Password Strength
                      </span>

                      <div className="w-full flex items-center gap-x-1">
                        {lengthValidated ? (
                          <>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/60 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/60 text-white text-center whitespace-nowrap transition duration-500"></div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                          </>
                        )}

                        {upperValidated && lowerValidated ? (
                          <>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/75 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/75 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/75 text-white text-center whitespace-nowrap transition duration-500"></div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                          </>
                        )}

                        {numberValidated && specialValidated ? (
                          <>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/90 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/90 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/90 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/90 text-white text-center whitespace-nowrap transition duration-500"></div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                            <div className="w-full h-1 flex flex-col justify-center overflow-hidden bg-success/10 text-white text-center whitespace-nowrap transition duration-500"></div>
                          </>
                        )}
                      </div>
                      <ul className="text-sm mt-5">
                        <li
                          className={`${
                            lengthValidated ? "text-light" : ""
                          } text-body italic flex gap-2 items-center mb-2 `}
                        >
                          <CircleCheck
                            className={`duration-200 ${
                              lengthValidated
                                ? "fill-green-700 text-white"
                                : "opacity-50"
                            }`}
                          />
                          Must have 8 characters
                        </li>
                        <li
                          className={`${
                            upperValidated ? "text-light" : ""
                          } text-body italic flex gap-2 items-center mb-2 `}
                        >
                          <CircleCheck
                            className={`duration-200 ${
                              upperValidated
                                ? "fill-green-700 text-white"
                                : "opacity-50"
                            }`}
                          />
                          At least 1 uppercase
                        </li>
                        <li
                          className={`${
                            lowerValidated ? "text-light" : ""
                          } text-body italic flex gap-2 items-center mb-2 `}
                        >
                          <CircleCheck
                            className={`duration-200 ${
                              lowerValidated
                                ? "fill-green-700 text-white"
                                : "opacity-50"
                            }`}
                          />
                          At least 1 lowercase
                        </li>
                        <li
                          className={`${
                            numberValidated ? "text-light" : ""
                          } text-body italic flex gap-2 items-center mb-2 `}
                        >
                          <CircleCheck
                            className={`duration-200 ${
                              numberValidated
                                ? "fill-green-700 text-white"
                                : "opacity-50"
                            }`}
                          />
                          At least 1 number
                        </li>
                        <li
                          className={`${
                            specialValidated ? "text-light" : ""
                          } text-body italic flex gap-2 items-center mb-2 `}
                        >
                          <CircleCheck
                            className={`duration-200 ${
                              specialValidated
                                ? "fill-green-700 text-white"
                                : "opacity-50"
                            }`}
                          />
                          At least 1 symbol
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-1 pt-3">
                      <button
                        type="submit"
                        disabled={mutation.isPending || !props.dirty}
                        className="btn-modal-submit p-3 uppercase "
                      >
                        {mutation.isPending ? (
                          <ButtonSpinner />
                        ) : (
                          "confirm password"
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePassword;
