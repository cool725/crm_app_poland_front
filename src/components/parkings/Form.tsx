import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Modal,
  AutoComplete,
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
import { useTranslation } from "react-i18next";
import { selectOwner } from "../../store/commonSlice";
import { AppDispatch } from "../../store";

const formInitialValues: Parking = {
  ParkingName: "",
  Type: "Commission",
  BusinessSegment: "",
  BHCommision: 0,
  SourceCommision: 0.25,
  Address: "",
  City: "",
  AgreementStart: "",
  AgreementFinish: "",
};

export default function ParkingForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { parkingName } = useParams();
  const [attachments, setAttachments] = useState<any>([]);
  const [deletedFiles, setDeletedFiles] = useState<any>([]);
  const [missingParkings, setMissingParkings] = useState<any>([]);
  const [parkingOwner, setParkingOwner] = useState<any>({});
  const user = useSelector((state: RootState) => state.auth.user);
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const navigate = useNavigate();
  const [t] = useTranslation("common");

  const [initialValues, setInitialValues] =
    useState<Parking>(formInitialValues);

  const fetchParking = async () => {
    const res = await axios
      .get(`/parkings/${encodeURIComponent(parkingName || "")}`)
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
    Type: Yup.string().oneOf(["Commission", "Non-Commission"]).required(),
    BusinessSegment: Yup.string().required(),
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
        formData.append("Type", values.Type);
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
        formData.append("BusinessSegment", values.BusinessSegment as string);
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
          `/parkings/${encodeURIComponent(parkingName || "")}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => res.data);

        if (res?.ParkingName) {
          message.success(t("Saved successfully."));

          navigate(`/parkings/${curUser?.OwnerID}`);
        }
      } catch (err: any) {
        console.log(err);
      }
      setSubmitting(false);
    },
  });

  const fetchMissingParkings = async () => {
    try {
      const res = await axios
        .get("/parkings/missing-list")
        .then((res) => res.data);

      setMissingParkings(
        res.map((row: any) => {
          return { value: row?.ParkingName };
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: (
        <div className="text-white text-center">
          {t("Do you want to delete")} ?
        </div>
      ),
      okText: t("YES"),
      icon: null,
      cancelText: t("NO"),
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
            .delete(`/parkings/${encodeURIComponent(parkingName || "")}`)
            .then((res) => res.data);

          if (res.ParkingName) {
            message.success(t("Deleted successfully."));
            navigate("/parkings");
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
    fetchMissingParkings();

    if (parkingName) {
      fetchParking();
    } else {
      setInitialValues(formInitialValues);
      setAttachments([]);
    }
  }, [parkingName]);

  const handleClickBack = (e: any) => {
    e.preventDefault();
    navigate("/parkings");
    dispatch(selectOwner(null));
  };

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
          {(user?.Role === "admin" || user?.Role === "super-admin") && (
            <Link to={""} onClick={handleClickBack}>
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                className="text-3xl cursor-pointer absolute -top-3 left-0"
              />
            </Link>
          )}

          {parkingName
            ? `${parkingOwner?.FirstName} ${parkingOwner?.LastName}: ${t(
                "parkings.item.Edit parking"
              )}`
            : t("parkings.item.Add new parking")}
        </div>

        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto"
          style={{ maxWidth: "690px" }}
        >
          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="ParkingName">
                {t("parkings.item.Parking name")}:
              </label>

              <AutoComplete
                placeholder={t("parkings.item.Parking name")}
                value={values.ParkingName as string}
                className={`w-full ${
                  touched.ParkingName && errors.ParkingName && "border-red-500"
                }`}
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
                onChange={(value) => formik.setFieldValue("ParkingName", value)}
                options={missingParkings}
                filterOption={(inputValue, option: any) =>
                  option!.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="Type">
                {t("apartments.item.Type")}:
              </label>
              <Select
                defaultValue=""
                value={values.Type}
                onChange={(value) => formik.setFieldValue("Type", value)}
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
                className={`${
                  touched.Type && errors.Type && "border border-red-500"
                } flex-grow`}
              >
                <Select.Option value="" disabled>
                  Select Type
                </Select.Option>
                <Select.Option value="Commission">Commission</Select.Option>
                <Select.Option value="Non-Commission">
                  Non Commission
                </Select.Option>
              </Select>
            </div>

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="BHCommision">
                {t("parkings.item.BH Commission")}:
              </label>
              <InputNumber
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
                placeholder={t("parkings.item.BH Commission")}
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
                {t("parkings.item.Source Commission")}:
              </label>
              <InputNumber
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
                placeholder={t("parkings.item.Source Commission")}
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
                {t("parkings.item.Address")}:
              </label>
              <Input
                placeholder={t("parkings.item.Address")}
                className={`${
                  touched.Address && errors.Address && "border-red-500"
                }`}
                name="Address"
                value={values.Address as string}
                onChange={handleChange}
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="City">
                {t("parkings.item.City")}:
              </label>
              <Input
                placeholder={t("parkings.item.City")}
                className={`${touched.City && errors.City && "border-red-500"}`}
                name="City"
                value={values.City as string}
                onChange={handleChange}
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="AgreementStart">
                {t("parkings.item.Agr-t start")}:
              </label>
              <DatePicker
                placeholder={t("parkings.item.Agr-t start")}
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
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
                {t("parkings.item.Agr-t finish")}:
              </label>
              <DatePicker
                placeholder={t("parkings.item.Agr-t finish")}
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
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

            <div className="flex items-center mb-3">
              <label className="w-32 flex-none" htmlFor="BusinessSegment">
                {t("parkings.item.Business Segment")}:
              </label>
              <Input
                placeholder={t("parkings.item.Business Segment")}
                className={`${
                  touched.BusinessSegment &&
                  errors.BusinessSegment &&
                  "border-red-500"
                }`}
                name="BusinessSegment"
                value={values.BusinessSegment}
                onChange={handleChange}
                disabled={
                  user?.Role === "admin" || user?.Role === "super-admin"
                    ? false
                    : true
                }
              />
            </div>

            <div className="flex items-start mb-3">
              <label className="w-32 flex-none">
                {t("parkings.item.Agr-t Attachment")}:
              </label>

              <div className="flex-grow">
                <Upload
                  disabled={
                    user?.Role === "admin" || user?.Role === "super-admin"
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

      <div
        className={`w-full flex justify-end ${
          user?.Role === "admin" || user?.Role === "super-admin" ? "" : "hidden"
        }`}
      >
        {parkingName && (
          <Button
            key="delete"
            onClick={confirmDelete}
            className="btn-danger hvr-float-shadow h-10 w-40 mb-6 ml-2"
            disabled={isSubmitting}
          >
            {t("DELETE")}
          </Button>
        )}
        <Button
          htmlType="submit"
          className="btn-yellow hvr-float-shadow h-10 w-40 mb-6 ml-2"
          disabled={isSubmitting}
        >
          {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
          {!isSubmitting && t("SAVE")}
        </Button>
      </div>
    </form>
  );
}
