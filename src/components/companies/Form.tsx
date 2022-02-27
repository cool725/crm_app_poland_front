import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Input, Upload, message, Modal } from "antd";
import {
  UploadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import helpers from "../../services/helpers";
import { BASE_URL } from "../../services/config";

const formInitialValues = {
  CompanyID: "",
  Name: "",
  Address: "",
  Website: "",
  DB: "",
  Status: "",
};

export default function CompanyForm() {
  const { companyID } = useParams();
  const [attachments, setAttachments] = useState<any>([]);
  const [deletedFiles, setDeletedFiles] = useState<any>([]);
  const [companyStatus, setCompanyStatus] = useState("inactive");
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(formInitialValues);

  const fetchCompanyProfile = async () => {
    const res = await axios
      .get(`/companies/${companyID}`)
      .then((res) => res.data);

    setCompanyStatus(res.Status || "inactive");
    setInitialValues({ ...res, DBPassword: "" });
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
    Name: Yup.string().required(),
    Address: Yup.string().required(),
    Website: Yup.string().required(),
    DB: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("Name", values.Name);
        formData.append("Address", values.Address);
        formData.append("Website", values.Website);
        formData.append("DB", values.DB);
        if (companyID && deletedFiles.length > 0) {
          deletedFiles.forEach((file: any) =>
            formData.append("DeletedFiles", file)
          );
        }

        attachments
          .filter((file: any) => !Boolean(file.id))
          .forEach((file: any) => {
            formData.append("Attachments", file);
          });

        const res = await axios[companyID ? "put" : "post"](
          `/companies/${companyID || ""}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => res.data);

        if (res?.id) {
          message.success("Saved successfully.");
          navigate("/companies");
        }
      } catch (err: any) {
        console.log(err);
      }
      setSubmitting(false);
    },
  });

  const setStatus = async (Status = "active") => {
    setCompanyStatus(Status);
    try {
      const res = await axios
        .patch(`/companies/status/${companyID}`, {
          Status,
        })
        .then((res) => res.data);

      if (res.id) {
        fetchCompanyProfile();
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
        <div className="text-white text-center">Do you want to delete ?</div>
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
            .delete(`/companies/${companyID}`)
            .then((res) => res.data);

          if (res.id) {
            message.success("Deleted successfully.");
            navigate("/companies");
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
    if (companyID) {
      fetchCompanyProfile();
    } else {
      setInitialValues(formInitialValues);
      setAttachments([]);
    }
  }, []);

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } =
    formik;

  return (
    <form
      className="container mx-auto px-3 mt-7"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="bg-c-light rounded py-4 pl-6 flex flex-col mb-5">
        <div className="relative text-center text-xl font-bold mt-3 mb-7">
          <Link to="/companies">
            <FontAwesomeIcon
              icon={faLongArrowAltLeft}
              className="text-3xl cursor-pointer absolute -top-3 left-0"
            />
          </Link>

          {companyID ? initialValues.Name : "New Company"}
        </div>

        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto"
          style={{ maxWidth: "640px" }}
        >
          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="CompanyID">
                ID:
              </label>
              <Input
                placeholder="CompanyID"
                name="CompanyID"
                disabled
                value={values.CompanyID}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Name">
                Name:
              </label>
              <Input
                placeholder="Name"
                className={`${touched.Name && errors.Name && "border-red-500"}`}
                name="Name"
                value={values.Name}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Address">
                Address:
              </label>
              <Input
                placeholder="Address"
                className={`${
                  touched.Address && errors.Address && "border-red-500"
                }`}
                name="Address"
                value={values.Address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="Website">
                Website:
              </label>
              <Input
                placeholder="Website"
                className={`${
                  touched.Website && errors.Website && "border-red-500"
                }`}
                name="Website"
                value={values.Website}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center mb-3">
              <label className="w-24 flex-none" htmlFor="DB">
                DB:
              </label>
              <Input
                placeholder="DB"
                className={`${touched.DB && errors.DB && "border-red-500"}`}
                name="DB"
                value={values.DB}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-start mb-3">
              <label className="w-24 flex-none">Logo:</label>

              <div className="flex-grow">
                <Upload
                  className="rounded flex-none"
                  listType="picture"
                  fileList={attachments}
                  beforeUpload={async (file: any) => {
                    if (companyID && attachments[0].id)
                    setDeletedFiles([...deletedFiles, attachments[0].id]);
                    file.url = await helpers.getBase64(file);
                    setAttachments([file]);
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
        {companyID && (
          <>
            <Button
              key="delete"
              onClick={confirmDelete}
              className="btn-danger hvr-float-shadow h-10 w-40 mb-6 ml-2"
              disabled={isSubmitting}
            >
              DELETE
            </Button>

            {companyStatus === "active" && (
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
            {companyStatus === "inactive" && (
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
