import { useRef, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, message } from "antd";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import CustomScrollbar from "../common/CustomScrollbar";

export default function ResetPassword() {
  const navigate = useNavigate();
  const passwordInputRef = useRef<Input>(null);
  const params = useParams();

  const formSchema = Yup.object().shape({
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const res = await axios.post('/auth/reset-password', {
          password: values.password,
          token: params.token
        }).then(res => res.data);

        if (res?.success) {
          navigate('/login');
          message.success('Successfully reset the password.');
        } else {
          message.error(res.message);
        }
        
      } catch (err: any) {
        message.error(err);
      }
      setSubmitting(false);
    },
  });

  const checkToken = async () => {
    try {
      const res = await axios
        .post("/auth/check-reset-password-token", {
          token: params.token,
        })
        .then((res) => res.data);

      if (!res?.success) navigate("/not-found");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (passwordInputRef.current) passwordInputRef.current.focus();

    // check if token is correct
    checkToken();
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
            <img alt="Logo" className="w-32 h-32 mb-3" src="images/logo.png" />

            <h1 className="text-5xl font-bold font-baloo text-white mb-1 uppercase">
              Baltichome
            </h1>
            <h3 className="text-base text-white mb-12">ADMIN MODE</h3>

            <Input
              size="large"
              placeholder="Password"
              className={`h-13 mb-5 pl-5 ${
                touched.password && errors.password && "border-red-500"
              }`}
              type="password"
              name="password"
              onChange={handleChange}
              value={values.password}
              ref={passwordInputRef}
            />

            <Button
              htmlType="submit"
              size="large"
              className="btn-yellow hvr-float-shadow w-full h-13 mb-6"
              disabled={isSubmitting}
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
              {!isSubmitting && "ENTER"}
            </Button>
          </form>

          <div className="flex-none text-center text-white mt-10">
            © 2022 «Baltichome»
          </div>
        </div>
      </div>
    </CustomScrollbar>
  );
}
