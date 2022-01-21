import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { signInWithEmail } from "../../store/authSlice";
import { AppDispatch } from "../../store";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import CustomScrollbar from "../common/CustomScrollbar";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { selectOwner } from "../../store/commonSlice";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [signInFailed, setSignInFailed] = useState(false);
  const [isForgotPasswordModalOpened, setForgotPasswordModalOpened] =
    useState(false);
  const emailInputRef = useRef<Input>(null);

  const formSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const res = await dispatch(signInWithEmail(values));

        if (res.payload?.user) {
          if (res.payload.user.Role === "owner") {
            dispatch(selectOwner(res.payload.user));
          } else {
            dispatch(selectOwner(null));
          }

          message.success("Welcome to Baltichome.");
          navigate("/");
        } else {
          setSignInFailed(true);
        }
      } catch (err: any) {
        console.log(err);
        setSignInFailed(true);
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    formik;

  return (
    <CustomScrollbar>
      <div
        className="w-full max-w-screen h-screen bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url(images/login-background.png)" }}
      >
        <div className="max-w-87.5 w-full min-h-screen mx-auto flex flex-col h-full py-16">
          <form
            onSubmit={handleSubmit}
            className="flex-grow flex flex-col items-center w-full"
          >
            <Link to="/">
              <img
                alt="Logo"
                className="w-32 h-32 mb-3"
                src="images/logo.png"
              />
            </Link>

            <h1 className="text-5xl font-bold font-baloo text-white mb-1 uppercase">
              Baltichome
            </h1>
            <h3 className="text-base text-white mb-12">ADMIN MODE</h3>

            <Input
              size="large"
              placeholder="Login"
              className={`h-13 mb-3 pl-5 ${
                touched.email && errors.email && "border-red-500"
              }`}
              name="email"
              onChange={handleChange}
              value={values.email}
              ref={emailInputRef}
            />

            <Input
              size="large"
              placeholder="Password"
              className={`h-13 mb-8 pl-5 ${
                touched.password && errors.password && "border-red-500"
              }`}
              type="password"
              name="password"
              onChange={handleChange}
              value={values.password}
            />

            <Button
              htmlType="submit"
              size="large"
              className="btn-yellow hvr-float-shadow w-full h-13 mb-6"
              disabled={isSubmitting}
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
              {!isSubmitting && "LOGIN"}
            </Button>

            <div className="flex justify-center w-full mb-8">
              <div className="text-white">
                Forgot password?
                <span
                  className="underline cursor-pointer ml-1"
                  onClick={() => setForgotPasswordModalOpened(true)}
                >
                  Click here
                </span>
              </div>
            </div>

            {signInFailed && (
              <div className="text-center text-red-500">
                Wrong Email or Password !
              </div>
            )}
          </form>

          <div className="flex-none text-center text-white mt-10">
            © 2022 «Baltichome»
          </div>
        </div>

        <ForgotPasswordModal
          visible={isForgotPasswordModalOpened}
          onCancel={() => setForgotPasswordModalOpened(false)}
        />
      </div>
    </CustomScrollbar>
  );
}
