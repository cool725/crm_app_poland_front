import { useRef, useState, useEffect } from "react";

import { Modal, message, Button } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

interface CProps {
  visible: boolean;
  onCancel: () => void;
}

const ForgotPasswordModal: React.FC<CProps> = (props) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [wrongEmailMessage, setWrongEmailMessage] = useState('');

  const formSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const res = await axios.post('/auth/send-reset-password-email', values).then(res => res.data);

        if (res.success) {
          message.success(
            "Email has been sent successfully. Please check your inbox."
          );
          props.onCancel();
        } else {
          setWrongEmailMessage('The email was not found in the database!');
        }

      } catch (err: any) {
        console.log(err.message);
        setWrongEmailMessage('Wrong email or something went wrong on server. Please try again later.');
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (props.visible) {
      if (emailInputRef.current) emailInputRef.current.focus();
    } else {
      formik.resetForm();
      setWrongEmailMessage('');
    }
  }, [props.visible]);

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    formik;

  return (
    <Modal
      closable={true}
      visible={props.visible}
      footer={false}
      width={800}
      centered
      className="modal-confirm"
      onCancel={() => props.onCancel()}
    >
      <form
        onSubmit={handleSubmit}
        className="px-5 mt-6 flex flex-col items-center"
      >
        <div className="text-center text-base mb-8">
          If you have forgotten the password for your account, then enter your
          email and we will send you link for enter with new password.
        </div>

        <input
          placeholder="Email"
          className={`ant-input ant-input-lg h-13 mb-3 pl-5 ${
            touched.email && errors.email && "border-red-500"
          }`}
          name="email"
          onChange={handleChange}
          value={values.email}
          autoFocus={true}
          ref={emailInputRef}
        />

        <div className="text-red-500 mb-7 text-center">{wrongEmailMessage}</div>

        <Button
          htmlType="submit"
          size="large"
          className="btn-yellow hvr-float-shadow w-1/2 h-13 mx-auto"
          disabled={isSubmitting}
        >
          {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
          {!isSubmitting && "SEND"}
        </Button>
      </form>
    </Modal>
  );
};

export default ForgotPasswordModal;
