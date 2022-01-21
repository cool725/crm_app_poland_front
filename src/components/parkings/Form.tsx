import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Upload,
  message,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import axios from "axios";
import helpers from "../../services/helpers";
import { BASE_URL } from "../../services/config";
import { Parking } from "../../@types/parking";
import { Link } from "react-router-dom";

const formInitialValues: Parking = {
  ParkingName: "",
  BHCommision: 0,
  SourceCommision: 0.25,
  Address: "",
  City: "",
  AgreementStart: "",
  AgreementFinish: "",
};

export default function ParkingForm() {
  const { parkingName } = useParams();
  const [attachments, setAttachments] = useState<any>([]);
  const [deletedFiles, setDeletedFiles] = useState<any>([]);
  const [parkingOwner, setParkingOwner] = useState<any>({});
  const user = useSelector((state: RootState) => state.auth.user);
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] =
    useState<Parking>(formInitialValues);

  const fetchParking = async () => {
    const res = await axios
      .get(`/parkings/${parkingName}`)
      .then((res) => res.data);

    const { owner, ...parkingData } = res;

    setInitialValues(parkingData);
    setParkingOwner(owner);

    setAttachments(
      parkingData.Attachments.map((file: any) => {
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
    ParkingName: Yup.string().required(),
    BHCommision: Yup.number().required(),
    SourceCommision: Yup.number().required(),
    Address: Yup.string().required(),
    City: Yup.string().required(),
    AgreementStart: Yup.string().required(),
    AgreementFinish: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: async (values: Parking, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        if (!parkingName) formData.append("OwnerID", String(curUser?.OwnerID));
        formData.append("ParkingName", values.ParkingName as string);
        formData.append("BHCommision", String(values.BHCommision) as string);
        formData.append(
          "SourceCommision",
          String(values.SourceCommision) as string
        );
        formData.append("Address", values.Address as string);
        formData.append("City", values.City as string);
        formData.append(
          "AgreementStart",
          moment(values.AgreementStart).format("YYYY-MM-DD HH:mm:ss")
        );
        formData.append(
          "AgreementFinish",
          moment(values.AgreementFinish).format("YYYY-MM-DD HH:mm:ss")
        );
        if (parkingName && deletedFiles.length > 0) {
          deletedFiles.forEach((file: any) =>
            formData.append("DeletedFiles", file)
          );
        }

        attachments
          .filter((file: any) => !Boolean(file.id))
          .forEach((file: any) => {
            formData.append("Attachments", file);
          });

        const res = await axios[parkingName ? "put" : "post"](
          `/parkings/${parkingName || ""}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => res.data);

        if (res?.ParkingName) {
          message.success("Successfully saved parking.");

          if (!parkingName) {
            navigate(`/parkings/form/${curUser?.OwnerID}/${res.ParkingName}`);
          }
        }
      } catch (err: any) {
        console.log(err);
      }
      setSubmitting(false);
    },
  });

  const confirmDelete = () => {
    Modal.confirm({
      title: (
        <div className="text-white text-center">
          Do you want to delete parking?
        </div>
      ),
      okText: "YES",
      icon: null,
      cancelText: "NO",
      width: 340,
      okButtonProps: {
        className: "btn-yellow hvr-float-shadow w-32 h-10 text-xs ml-3.5",
      },
      cancelButtonProps: {
        className: "btn-danger hvr-float-shadow w-32 h-10 text-xs",
      },
      onOk: async () => {
        try {
          const res = await axios
            .delete(`/parkings/${parkingName}`)
            .then((res) => res.data);

          if (res.ParkingName) {
            message.success("Deleted successfully.");
            navigate("/parkings");
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
    if (parkingName) {
      fetchParking();
    } else {
      setInitialValues(formInitialValues);
      setAttachments([]);
    }
  }, [parkingName]);

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
            <Link to="/parkings">
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                className="text-3xl cursor-pointer absolute -top-3 left-0"
              />
            </Link>
          )}

          {parkingName
            ? `${parkingOwner?.FirstName} ${parkingOwner?.LastName}: edit parking`
            : "Add new parking"}
        </div>

        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto"
          style={{ maxWidth: "690px" }}
        >
          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="ParkingName">
                Parking name:
              </label>
              <Input
                placeholder="Parking name"
                className={`${
                  touched.ParkingName && errors.ParkingName && "border-red-500"
                }`}
                name="ParkingName"
                value={values.ParkingName as string}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="BHCommision">
                BH Commission:
              </label>
              <InputNumber
                placeholder="BH Commission"
                className={`w-full ${
                  touched.BHCommision && errors.BHCommision && "border-red-500"
                }`}
                name="BHCommision"
                value={Number(values.BHCommision)}
                onChange={(val) => setFieldValue("BHCommision", val)}
                step="0.01"
              />
            </div>
            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="SourceCommision">
                Source commission:
              </label>
              <InputNumber
                placeholder="Source Commission"
                className={`w-full ${
                  touched.SourceCommision &&
                  errors.SourceCommision &&
                  "border-red-500"
                }`}
                name="SourceCommision"
                value={values.SourceCommision as number}
                onChange={(val) => setFieldValue("SourceCommision", val)}
                step="0.01"
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="Address">
                Address:
              </label>
              <Input
                placeholder="Address"
                className={`${
                  touched.Address && errors.Address && "border-red-500"
                }`}
                name="Address"
                value={values.Address as string}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="City">
                City:
              </label>
              <Input
                placeholder="City"
                className={`${touched.City && errors.City && "border-red-500"}`}
                name="City"
                value={values.City as string}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="AgreementStart">
                Agr-t start:
              </label>
              <DatePicker
                placeholder="AgreementStart"
                className={`w-full ${
                  touched.AgreementStart &&
                  errors.AgreementStart &&
                  "border-red-500"
                }`}
                name="AgreementStart"
                value={
                  values.AgreementStart ? moment(values.AgreementStart) : null
                }
                onChange={(value) =>
                  setFieldValue(
                    "AgreementStart",
                    value ? value.format("YYYY-MM-DD") : null
                  )
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="AgreementFinish">
                Agr-t finish:
              </label>
              <DatePicker
                placeholder="AgreementFinish"
                className={`w-full ${
                  touched.AgreementFinish &&
                  errors.AgreementFinish &&
                  "border-red-500"
                }`}
                name="AgreementFinish"
                value={
                  values.AgreementFinish ? moment(values.AgreementFinish) : null
                }
                onChange={(value) =>
                  setFieldValue(
                    "AgreementFinish",
                    value ? value.format("YYYY-MM-DD") : null
                  )
                }
              />
            </div>

            <div className="flex items-start mb-3">
              <label className="w-32 flex-none">Agr-t Attachment:</label>

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
        {parkingName && (
          <Button
            key="delete"
            onClick={confirmDelete}
            className="btn-danger hvr-float-shadow h-10 w-40 mb-6 ml-2"
            disabled={isSubmitting}
          >
            DELETE
          </Button>
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
