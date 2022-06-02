import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, message, Input, Modal } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MinusSquareFilled,
} from "@ant-design/icons";
import AppLockAndText from "./AppLockAndText";
import { RootState } from "../../store";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../@types/user";
import moment from "moment";

const formInitialValues = {
  OwnerID: "",
  FirstName: "",
  LastName: "",
  Mobile: "",
  Landline: "",
  NIP: "",
  Email: "",
  Email2: "",
  Password: "",
  StartDate: "",
  RenewalDate: "",
  Company: "",
  AutoPassword: "",
};

const SuperAdminSetting: React.FC = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<string>("");
  const [text, setText] = useState<any>("");
  const user = useSelector((state: RootState) => state.auth.user);
  const [initialValues, setInitialValues] = useState(formInitialValues);
  const [admins, setAdmins] = useState<any>([]);

  const fetchSetting = async (key: string = "APP_LOCK") => {
    try {
      const res = await axios.get(`/settings/${key}`).then((res) => res.data);

      if (key === "APP_LOCK") {
        setChecked(res.value);
      } else {
        setText(res.value);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeAppSetting = (key: string, value: boolean | string) => {
    if (key === "APP_LOCK") {
      setChecked(value ? "active" : "inactive");
    } else {
      setText(value);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios
        .get(`/users/profile/${user?.OwnerID}`)
        .then((res) => res.data);
      setInitialValues(res);
    } catch (err) {
      console.log(err);
      message.error("Something went wrong. Please try again later.");
    }
  };

  const formSchema = Yup.object().shape({
    FirstName: Yup.string().required(),
    LastName: Yup.string().required(),
    Mobile: Yup.string().required(),
    Landline: Yup.string(),
    NIP: Yup.string(),
    Company: Yup.string(),
    Email: Yup.string().email().required(),
    Email2: Yup.string().email().nullable(),
    Password: Yup.string().test(
      "required",
      "Password is required",
      function (value) {
        return Boolean(user?.OwnerID) || Boolean(value);
      }
    ),
    StartDate: Yup.string().nullable(),
    RenewalDate: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("FirstName", values.FirstName);
        formData.append("LastName", values.LastName);
        formData.append("Mobile", values.Mobile);
        formData.append("Landline", values.Landline);
        formData.append("Email", values.Email);
        formData.append("Email2", values.Email2);
        formData.append("Password", values.AutoPassword);
        formData.append("AutoPassword", values.AutoPassword);
        formData.append("NIP", values.NIP);
        formData.append("Company", values.Company);
        formData.append("Role", "super-admin");

        const res = await axios
          .put(`/users/profile/${user?.OwnerID}`, formData)
          .then((res) => res.data);

        if (res?.id) {
          message.success("Saved super admin profile successfully.");
          navigate("/owners");
        }
      } catch (err: any) {
        console.log(err);
      }
      setSubmitting(false);
    },
  });

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("/users/list-admins").then((res) => res.data);
      setAdmins(res);
    } catch (err: any) {
      console.log(err);
    }
  };

  const addAdmin = () => {
    setAdmins((prev: any) => [
      ...prev,
      { ...formInitialValues, Email: "", AutoPassword: "", Password: "" },
    ]);
  };

  const onChangeAdmin = (index: number) => (e: any) => {
    const { name, value } = e.target;
    let editingAdmin = admins[index];
    editingAdmin[name] = value;

    if (name === "AutoPassword") {
      editingAdmin["Password"] = value;
    }

    const newArr = [...admins];
    newArr.splice(index, 1, editingAdmin);

    setAdmins(newArr);
  };

  const handleSave = async () => {
    const sendData = [...admins];
    sendData.forEach((admin: any) => {
      admin.Role = "admin";
      admin.StartDate = admin?.StartDate
        ? moment(admin?.StartDate).format("YYYY-MM-DD HH:mm:ss")
        : "";
      admin.RenewalDate = admin?.RenewalDate
        ? moment(admin?.RenewalDate).format("YYYY-MM-DD HH:mm:ss")
        : "";
    });

    try {
      await axios
        .post(`/settings`, { key: "APP_LOCK", value: checked })
        .then((res) => res.data);

      await axios
        .post(`/settings`, { key: "LOCK_TEXT", value: text })
        .then((res) => res.data);

      const res = await axios
        .post("/settings/upsert-admins", { admins: sendData })
        .then((res) => res.data);

      message.success("Saved successfully!");
      navigate("/owners");
    } catch (err) {
      console.log(err);
      message.error("Please fill exact admin fields.");
    }
  };

  const confirmDelete = (index: number) => {
    Modal.confirm({
      title: (
        <div className="text-white text-center">Do you want to delete?</div>
      ),
      okText: "YES",
      icon: null,
      cancelText: "NO",
      width: 340,
      okButtonProps: {
        className: "btn-yellow hvr-float-shadow w-28 h-10 text-xs ml-3.5",
      },
      cancelButtonProps: {
        className: "btn-danger hvr-float-shadow w-28 h-10 text-xs",
      },
      onOk: async () => {
        try {
          if (admins[index]?.OwnerID) {
            const res = await axios
              .delete(`/users/profile/${admins[index]?.OwnerID}`)
              .then((res) => res.data);
          }

          message.success("Deleted successfully.");

          const newArr = [...admins];
          newArr.splice(index, 1);
          setAdmins(newArr);
        } catch (err) {
          message.error("Something went wrong. Please try again later.");
        }
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    fetchSetting("APP_LOCK");
    fetchSetting("LOCK_TEXT");
    fetchProfile();
    fetchAdmins();
  }, []);

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    formik;

  return (
    <div className="container mx-auto flex flex-col mt-14">
      <div className="flex flex-wrap space-x-3 bg-[#E1E8F1] mb-3">
        <div className="w-96 pr-16 border-r border-[#BBBBBB]">
          <div className="pl-16 py-14">
            <img
              alt="super admin logo"
              className="w-7 h-9"
              src="images/super-admin.png"
            />
            <div className="text-lg text-c-black font-semibold -mt-1 mb-2">
              Super Admin:
            </div>

            <form className="mb-10" onSubmit={handleSubmit} autoComplete="off">
              <Input
                placeholder="Login"
                name="Email"
                value={values.Email}
                className={`mb-3 ${
                  touched.Email && errors.Email && "border-red-500"
                }`}
                autoComplete="off"
                list="autocompleteOff"
                onChange={handleChange}
              />

              <Input.Password
                placeholder="Password"
                className={`mb-4 ${
                  touched.AutoPassword &&
                  errors.AutoPassword &&
                  "border-red-500"
                }`}
                name="AutoPassword"
                value={values.AutoPassword}
                onChange={handleChange}
                autoComplete="new-password"
                list="autocompleteOff"
                iconRender={(visiblea) =>
                  visiblea ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />

              <Button
                htmlType="submit"
                className="btn-yellow hvr-float-shadow w-full h-8"
                disabled={isSubmitting}
              >
                {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
                {!isSubmitting && "SAVE"}
              </Button>
            </form>

            <AppLockAndText
              checked={checked}
              text={text}
              onChange={onChangeAppSetting}
            />
          </div>
        </div>

        <div className="pl-16 py-14 mt-9">
          <div className="text-lg text-c-black font-semibold -mt-1 mb-2 ml-[23px]">
            Admins:
          </div>

          {admins?.map((a: User, index: number) => {
            return (
              <div className="flex items-center mb-2" key={index}>
                <MinusSquareFilled
                  onClick={() => confirmDelete(index)}
                  className="mr-2"
                />
                <Input
                  placeholder="Login"
                  name="Email"
                  value={a?.Email}
                  className={`mr-3 w-64`}
                  autoComplete="off"
                  list="autocompleteOff"
                  onChange={onChangeAdmin(index)}
                />
                <Input.Password
                  iconRender={(visiblea) =>
                    visiblea ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Password"
                  name="AutoPassword"
                  value={a.AutoPassword || ""}
                  autoComplete="new-password"
                  list="autocompleteOff"
                  className="w-64"
                  onChange={onChangeAdmin(index)}
                />
              </div>
            );
          })}

          <Button
            onClick={addAdmin}
            className="btn-dark hvr-float-shadow w-64 h-8 text-white ml-[23px]"
          >
            Add Admin
          </Button>
        </div>
      </div>

      <div className="text-right">
        <Button
          onClick={handleSave}
          className="btn-yellow hvr-float-shadow w-40 h-10"
        >
          SAVE
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminSetting;
