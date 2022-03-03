import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../store";
import { Button, DatePicker, Input, Upload, message, Modal } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import axios from "axios";
import helpers from "../../services/helpers";
import { BASE_URL } from "../../services/config";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  companyWebsite: "",
};

export default function UserForm() {
  const { ownerId, companyID } = useParams();
  const [attachments, setAttachments] = useState<any>([]);
  const [deletedFiles, setDeletedFiles] = useState<any>([]);
  const [ownerStatus, setOwnerStatus] = useState("inactive");
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const user = useSelector((state: RootState) => state.auth.user);
  const company = useSelector((state: RootState) => state.common.company);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(formInitialValues);
  const [t] = useTranslation("common");

  const fetchProfile = async () => {
    const res = await axios
      .get(`/users/profile/${ownerId}`)
      .then((res) => res.data);

    setOwnerStatus(res.Status || "inactive");
    setInitialValues({ ...res, Password: "" });
    setAttachments(
      res.Attachments.map((file: any) => {
        return {
          id: file.Id,
          uid: file.Id,
          url: `${BASE_URL}${file.download}`,
          name: file.Name,
          size: file.Size,
          type: file.Type,
          status: "done",
        };
      })
    );
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
        return Boolean(ownerId) || Boolean(value);
      }
    ),
    StartDate: Yup.string().nullable(),
    RenewalDate: Yup.string().nullable(),
    companyWebsite: Yup.string(),
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
        formData.append("Password", values.Password);
        formData.append("NIP", values.NIP);
        formData.append("Company", values.Company);
        formData.append(
          "StartDate",
          values.StartDate
            ? moment(values.StartDate).format("YYYY-MM-DD HH:mm:ss")
            : ""
        );
        formData.append(
          "RenewalDate",
          values.RenewalDate
            ? moment(values.RenewalDate).format("YYYY-MM-DD HH:mm:ss")
            : ""
        );

        if (curUser && deletedFiles.length > 0) {
          deletedFiles.forEach((file: any) =>
            formData.append("DeletedFiles", file)
          );
        }

        attachments
          .filter((file: any) => !Boolean(file.id))
          .forEach((file: any) => {
            formData.append("Attachments", file);
          });

        if (company?.Website) {
          formData.append("companyWebsite", company.Website);
        }

        const res = await axios[curUser ? "put" : "post"](
          `/users/profile${companyID ? "/" + companyID : ""}${
            curUser?.OwnerID ? "/" + curUser?.OwnerID : ""
          }`,
          { ...formData, companyWebsite: company?.Website },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => res.data);

        if (res?.id) {
          message.success(t("Saved successfully."));
          if (user?.Role === "admin") {
            navigate("/owners");
          } else if (user?.Role === "super-admin") {
            navigate(`/companies/${companyID}/admins`);
          } else {
            fetchProfile();
          }
        }
      } catch (err: any) {
        console.log(err);
      }
      setSubmitting(false);
    },
  });

  const setStatus = async (Status = "active") => {
    setOwnerStatus(Status);
    try {
      const res = await axios
        .patch(
          `/users/status${companyID ? "/" + companyID : ""}${
            ownerId ? "/" + ownerId : ""
          }`,
          {
            Status,
            companyWebsite: company?.Website,
          }
        )
        .then((res) => res.data);

      if (res.id) {
        fetchProfile();
        message.success(t("Saved successfully."));
      } else {
        throw new Error("Server error.");
      }
    } catch (err) {
      message.error(t("Something went wrong. Please try again later."));
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: (
        <div className="text-white text-center">
          {t("Do you want to delete")} {t("Owner")} "{curUser?.FirstName}{" "}
          {curUser?.LastName}" ?
        </div>
      ),
      okText: t("YES"),
      icon: null,
      cancelText: t("NO"),
      width: 340,
      okButtonProps: {
        className: "btn-yellow hvr-float-shadow w-28 h-10 text-xs ml-3.5",
      },
      cancelButtonProps: {
        className: "btn-danger hvr-float-shadow w-28 h-10 text-xs",
      },
      onOk: async () => {
        try {
          const res = await axios
            .delete(
              `/users/profile/${companyID ? "/" + companyID : ""}${
                ownerId ? "/" + ownerId : ""
              }`,
              {
                data: {
                  companyWebsite: company?.Website,
                },
              }
            )
            .then((res) => res.data);

          if (res.id) {
            message.success(t("Deleted successfully."));

            if (user?.Role === "admin") {
              navigate("/owners");
            } else if (user?.Role === "super-admin") {
              navigate(`/companies/${companyID}/admins`);
            }
          } else {
            message.error(res.message);
          }
        } catch (err) {
          message.error(t("Something went wrong. Please try again later."));
        }
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (ownerId) {
      fetchProfile();
    } else {
      setInitialValues(formInitialValues);
      setAttachments([]);
    }
  }, []);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = formik;

  return (
    <form
      className="container mx-auto px-3 mt-7"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="bg-c-light rounded py-4 pl-6 flex flex-col mb-5">
        <div className="relative text-center text-xl font-bold mt-3 mb-7">
          {user?.Role === "admin" && (
            <Link to="/owners">
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                className="text-3xl cursor-pointer absolute -top-3 left-0"
              />
            </Link>
          )}

          {curUser
            ? `${curUser.FirstName} ${curUser.LastName}`
            : t("owners.profile.New User")}
        </div>

        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto"
          style={{ maxWidth: "640px" }}
        >
          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="OwnerID">
                {t("owners.profile.ID")}:
              </label>
              <Input
                placeholder={t("owners.profile.ID")}
                name="OwnerID"
                disabled
                value={values.OwnerID}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="FirstName">
                {t("owners.profile.Name")}:
              </label>
              <Input
                placeholder={t("owners.profile.Name")}
                className={`${
                  touched.FirstName && errors.FirstName && "border-red-500"
                }`}
                name="FirstName"
                value={values.FirstName}
                onChange={handleChange}
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="LastName">
                {t("owners.profile.Surname")}:
              </label>
              <Input
                placeholder={t("owners.profile.Surname")}
                className={`${
                  touched.LastName && errors.LastName && "border-red-500"
                }`}
                name="LastName"
                value={values.LastName}
                onChange={handleChange}
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Phone">
                {t("owners.profile.Phone")}:
              </label>
              <Input
                placeholder={t("owners.profile.Phone")}
                className={`${
                  touched.Mobile && errors.Mobile && "border-red-500"
                }`}
                name="Mobile"
                value={values.Mobile}
                onChange={handleChange}
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Landline">
                {t("owners.profile.Landline")}:
              </label>
              <Input
                placeholder={t("owners.profile.Landline")}
                className={`${
                  touched.Landline && errors.Landline && "border-red-500"
                }`}
                name="Landline"
                value={values.Landline}
                onChange={handleChange}
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="NIP">
                {t("owners.profile.NIP")}:
              </label>
              <Input
                placeholder={t("owners.profile.NIP")}
                className={`${touched.NIP && errors.NIP && "border-red-500"}`}
                name="NIP"
                value={values.NIP}
                onChange={handleChange}
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Email">
                {t("owners.profile.Email/Login")}:
              </label>
              <Input
                placeholder={t("owners.profile.Email/Login")}
                className={`${
                  touched.Email && errors.Email && "border-red-500"
                }`}
                name="Email"
                value={values.Email}
                onChange={handleChange}
                autoComplete="off"
                list="autocompleteOff"
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Email">
                {t("owners.profile.Email2")}:
              </label>
              <Input
                placeholder={t("owners.profile.Email2")}
                className={`${
                  touched.Email2 && errors.Email2 && "border-red-500"
                }`}
                name="Email2"
                value={values.Email2}
                onChange={handleChange}
                autoComplete="off"
                list="autocompleteOff"
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Password">
                {t("owners.profile.Password")}:
              </label>
              <Input.Password
                placeholder={t("owners.profile.Password")}
                className={`${
                  touched.Password && errors.Password && "border-red-500"
                }`}
                name="Password"
                value={values.Password}
                onChange={handleChange}
                autoComplete="new-password"
                list="autocompleteOff"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Company">
                {t("owners.profile.Company")}:
              </label>
              <Input
                placeholder={t("owners.profile.Company")}
                className={`${
                  touched.Company && errors.Company && "border-red-500"
                }`}
                name="Company"
                value={values.Company}
                onChange={handleChange}
                disabled={
                  user?.OwnerID === curUser?.OwnerID ||
                  user?.Role === "admin" ||
                  user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            {!ownerId && (
              <>
                <div className="flex items-center mb-3">
                  <label className="w-24 flex-none" htmlFor="StartDate">
                    {t("owners.profile.Start date")}:
                  </label>
                  <DatePicker
                    placeholder={t("owners.profile.Start date")}
                    className={`w-full ${
                      touched.StartDate && errors.StartDate && "border-red-500"
                    }`}
                    name="StartDate"
                    value={values.StartDate ? moment(values.StartDate) : null}
                    disabled={
                      user?.OwnerID === curUser?.OwnerID ||
                      user?.Role === "admin" ||
                      user?.Role === "super-admin"
                        ? false
                        : true
                    }
                    onChange={(value) =>
                      setFieldValue(
                        "StartDate",
                        value ? value.format("YYYY-MM-DD") : null
                      )
                    }
                  />
                </div>

                <div className="flex items-center mb-3">
                  <label className="w-24 flex-none" htmlFor="RenewalDate">
                    {t("owners.profile.Renewal date")}:
                  </label>
                  <DatePicker
                    placeholder={t("owners.profile.Renewal date")}
                    className={`w-full ${
                      touched.RenewalDate &&
                      errors.RenewalDate &&
                      "border-red-500"
                    }`}
                    name="RenewalDate"
                    disabled={
                      user?.OwnerID === curUser?.OwnerID ||
                      user?.Role === "admin" ||
                      user?.Role === "super-admin"
                        ? false
                        : true
                    }
                    value={
                      values.RenewalDate ? moment(values.RenewalDate) : null
                    }
                    onChange={(value) =>
                      setFieldValue(
                        "RenewalDate",
                        value ? value.format("YYYY-MM-DD") : null
                      )
                    }
                  />
                </div>
              </>
            )}

            <div className="flex items-start mb-3">
              <label className="w-24 flex-none">
                {t("owners.profile.Attachment")}:
              </label>

              <div className="flex-grow">
                <Upload
                  disabled={
                    user?.OwnerID === curUser?.OwnerID ||
                    user?.Role === "admin" ||
                    user?.Role === "super-admin"
                      ? false
                      : true
                  }
                  className="rounded flex-none"
                  fileList={attachments}
                  beforeUpload={async (file: any) => {
                    file.url = await helpers.getBase64(file);
                    setAttachments([...attachments, file]);
                    return false;
                  }}
                  onRemove={(file: any) => {
                    if (file.id) setDeletedFiles([...deletedFiles, file.id]);

                    const index = attachments.indexOf(file);
                    const newAttachments = [...attachments];
                    newAttachments.splice(index, 1);
                    setAttachments(newAttachments);
                  }}
                >
                  <Button icon={<UploadOutlined />}>{t("Upload")}</Button>
                </Upload>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end">
        {(user?.Role === "admin" || user?.Role === "super-admin") && (
          <>
            <Button
              key="delete"
              onClick={confirmDelete}
              className="btn-danger hvr-float-shadow h-10 w-40 mb-6 ml-2"
              disabled={isSubmitting}
            >
              {t("DELETE")}
            </Button>

            {ownerStatus === "active" && (
              <Button
                onClick={() => {
                  setStatus("inactive");
                }}
                className="btn-dark hvr-float-shadow h-10 w-40 mb-6 ml-2"
                disabled={isSubmitting}
              >
                {t("owners.profile.BLOCK")}
              </Button>
            )}

            {ownerStatus === "inactive" && (
              <Button
                onClick={() => {
                  setStatus("active");
                }}
                className="btn-dark hvr-float-shadow h-10 w-40 mb-6 ml-2"
                disabled={isSubmitting}
              >
                {t("owners.profile.UNBLOCK")}
              </Button>
            )}
          </>
        )}

        {(user?.OwnerID === curUser?.OwnerID ||
          user?.Role === "admin" ||
          user?.Role === "super-admin") && (
          <Button
            htmlType="submit"
            className="btn-yellow hvr-float-shadow h-10 w-40 mb-6 ml-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
            {!isSubmitting && t("SAVE")}
          </Button>
        )}
      </div>
    </form>
  );
}
