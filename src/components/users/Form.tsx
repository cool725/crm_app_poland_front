import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
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
import { selectOwner } from "../../store/commonSlice";
import helpers from "../../services/helpers";
import { BASE_URL } from "../../services/config";

const formInitialValues = {
  OwnerID: "",
  FirstName: "",
  LastName: "",
  Mobile: "",
  Landline: "",
  Agreement: "",
  Email: "",
  Password: "",
  StartDate: "",
  RenewalDate: "",
};

export default function UserForm() {
  const { id } = useParams();
  const [attachments, setAttachments] = useState<any>([]);
  const [deletedFiles, setDeletedFiles] = useState<any>([]);
  const dispatch = useDispatch<AppDispatch>();
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(formInitialValues);

  const fetchProfile = async () => {
    const res = await axios.get(`/users/profile/${id}`).then((res) => res.data);

    dispatch(selectOwner(res));
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
    Landline: Yup.string().required(),
    Agreement: Yup.string(),
    Email: Yup.string().email().required(),
    Password: Yup.string(),
    StartDate: Yup.string().required(),
    RenewalDate: Yup.string().required(),
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
        formData.append("Password", values.Password);
        formData.append(
          "StartDate",
          moment(values.StartDate).format("YYYY-MM-DD HH:mm:ss")
        );
        formData.append(
          "RenewalDate",
          moment(values.RenewalDate).format("YYYY-MM-DD HH:mm:ss")
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

        const res = await axios[curUser ? "put" : "post"](
          `/users/profile/${curUser?.OwnerID || ""}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => res.data);

        if (res?.id) {
          message.success("Successfully saved profile.");
          if (user?.Role === "admin") {
            navigate("/owners");
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
    try {
      const res = await axios
        .patch(`/users/status/${id}`, {
          Status,
        })
        .then((res) => res.data);

      if (res.id) {
        fetchProfile();
        message.success("Saved successfully.");
      } else {
        throw new Error("Server error.");
      }
    } catch (err) {
      message.error("Something went wrong. Please try again later.");
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: (
        <div className="text-white text-center">
          Do you want to delete user "{curUser?.FirstName} {curUser?.LastName}"
          ?
        </div>
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
          const res = await axios
            .delete(`/users/profile/${id}`)
            .then((res) => res.data);

          if (res.id) {
            message.success("Deleted successfully.");
            navigate("/owners");
          } else {
            message.error(res.message);
          }
        } catch (err) {
          message.error("Something went wrong. Please try again later.");
        }
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (id) {
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
    <form className="container mx-auto px-3 mt-7" onSubmit={handleSubmit}>
      <div className="bg-c-light rounded py-4 pl-6 flex flex-col mb-5">
        <div className="relative text-center text-xl font-bold mt-3 mb-7">
          {user?.Role === "admin" && (
            <FontAwesomeIcon
              icon={faLongArrowAltLeft}
              className="text-3xl cursor-pointer absolute -top-3 left-0"
              onClick={() => {
                dispatch(selectOwner(null));
                navigate("/owners");
              }}
            />
          )}

          {curUser ? `${curUser.FirstName} ${curUser.LastName}` : "New User"}
        </div>

        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto"
          style={{ maxWidth: "640px" }}
        >
          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="OwnerID">
                ID:
              </label>
              <Input
                placeholder="Owner ID"
                name="OwnerID"
                disabled
                value={values.OwnerID}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="FirstName">
                Name:
              </label>
              <Input
                placeholder="Name"
                className={`${
                  touched.FirstName && errors.FirstName && "border-red-500"
                }`}
                name="FirstName"
                value={values.FirstName}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="LastName">
                Surname:
              </label>
              <Input
                placeholder="Surname"
                className={`${
                  touched.LastName && errors.LastName && "border-red-500"
                }`}
                name="LastName"
                value={values.LastName}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Phone">
                Phone:
              </label>
              <Input
                placeholder="Phone"
                className={`${
                  touched.Mobile && errors.Mobile && "border-red-500"
                }`}
                name="Mobile"
                value={values.Mobile}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Landline">
                Landline:
              </label>
              <Input
                placeholder="Landline"
                className={`${
                  touched.Landline && errors.Landline && "border-red-500"
                }`}
                name="Landline"
                value={values.Landline}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Agreement">
                Agreement:
              </label>
              <Input
                placeholder="Agreement"
                className={`${
                  touched.Agreement && errors.Agreement && "border-red-500"
                }`}
                name="Agreement"
                value={values.Agreement}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Email">
                Email/Login:
              </label>
              <Input
                placeholder="Email/Login"
                className={`${
                  touched.Email && errors.Email && "border-red-500"
                }`}
                name="Email"
                value={values.Email}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Password">
                Password:
              </label>
              <Input.Password
                placeholder="Password"
                className={`${
                  touched.Password && errors.Password && "border-red-500"
                }`}
                name="Password"
                value={values.Password}
                onChange={handleChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="StartDate">
                Start date:
              </label>
              <DatePicker
                placeholder="StartDate"
                className={`w-full ${
                  touched.StartDate && errors.StartDate && "border-red-500"
                }`}
                name="StartDate"
                value={values.StartDate ? moment(values.StartDate) : null}
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
                Renewal date:
              </label>
              <DatePicker
                placeholder="RenewalDate"
                className={`w-full ${
                  touched.RenewalDate && errors.RenewalDate && "border-red-500"
                }`}
                name="RenewalDate"
                value={values.RenewalDate ? moment(values.RenewalDate) : null}
                onChange={(value) =>
                  setFieldValue(
                    "RenewalDate",
                    value ? value.format("YYYY-MM-DD") : null
                  )
                }
              />
            </div>

            <div className="flex items-start mb-3">
              <label className="w-24 flex-none">Attachment:</label>

              <div className="flex-grow">
                <Upload
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
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end">
        {id && (
          <>
            {user?.OwnerID !== curUser?.OwnerID && (
              <Button
                key="delete"
                onClick={confirmDelete}
                className="btn-danger hvr-float-shadow h-10 w-40 mb-6 ml-2"
                disabled={isSubmitting}
              >
                DELETE
              </Button>
            )}

            {curUser?.Status === "active" && (
              <Button
                onClick={() => {
                  setStatus("inactive");
                }}
                className="btn-dark hvr-float-shadow h-10 w-40 mb-6 ml-2"
                disabled={isSubmitting}
              >
                BLOCK
              </Button>
            )}

            {curUser?.Status === "inactive" && (
              <Button
                onClick={() => {
                  setStatus("active");
                }}
                className="btn-dark hvr-float-shadow h-10 w-40 mb-6 ml-2"
                disabled={isSubmitting}
              >
                UNBLOCK
              </Button>
            )}
          </>
        )}
        <Button
          htmlType="submit"
          className="btn-yellow hvr-float-shadow h-10 w-40 mb-6 ml-2"
          disabled={isSubmitting}
        >
          {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
          {!isSubmitting && "SAVE"}
        </Button>
      </div>
    </form>
  );
}
