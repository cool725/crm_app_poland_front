import { useNavigate, useParams, Link } from "react-router-dom";
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
  Select,
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
import SourceCommissionModal from "./SourceCommissionModal";
import { Apartment } from "../../@types/apartment";

const formInitialValues: Apartment = {
  RoomName: "",
  Type: "Commission",
  Period: "Monthly",
  CleaningFee: 0,
  OwnerCleaningFee: 0,
  BHCommission: 0,
  ServiceFee: 0,
  Address: "",
  City: "",
  AgreementNumber: "",
  AgreementStart: "",
  AgreementFinish: "",
  BusinessSegment: "",
};

export default function ApartmentForm() {
  const { roomName } = useParams();
  const [attachments, setAttachments] = useState<any>([]);
  const [deletedFiles, setDeletedFiles] = useState<any>([]);
  const [apartmentOwner, setApartmentOwner] = useState<any>({});
  const user = useSelector((state: RootState) => state.auth.user);
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<Apartment>(formInitialValues);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = (isOpen = false) => {
    if (isOpen && !roomName) {
      message.warning("Please save apartment first.");
      return;
    }

    setIsModalVisible(isOpen);
  };

  const fetchApartment = async () => {
    const res = await axios
      .get(`/apartments/${roomName}`)
      .then((res) => res.data);

    const { owner, ...apartmentData } = res;

    setInitialValues(apartmentData);
    setApartmentOwner(owner);

    setAttachments(
      apartmentData.Attachments.map((file: any) => {
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
    Type: Yup.string().oneOf(["Commission", "Non-Commission"]).required(),
    RoomName: Yup.string().required(),
    Period: Yup.string()
      .oneOf(["Monthly", "Quarterly", "Bi-Annually", "Annually"])
      .required(),
    CleaningFee: Yup.number().required(),
    OwnerCleaningFee: Yup.number().required(),
    BHCommission: Yup.number().required(),
    ServiceFee: Yup.number().required(),
    Address: Yup.string().required(),
    City: Yup.string().required(),
    AgreementNumber: Yup.string().required(),
    AgreementStart: Yup.string().required(),
    AgreementFinish: Yup.string().required(),
    BusinessSegment: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        if (!roomName) formData.append("OwnerId", String(curUser?.OwnerID));
        formData.append("RoomName", values.RoomName as string);
        formData.append("Type", values.Type);
        formData.append("Period", values.Period);
        formData.append("CleaningFee", String(values.CleaningFee) as string);
        formData.append("OwnerCleaningFee", String(values.OwnerCleaningFee) as string);
        formData.append("BHCommission", String(values.BHCommission) as string);
        formData.append("ServiceFee", String(values.ServiceFee) as string);
        formData.append("Address", values.Address as string);
        formData.append("City", values.City as string);
        formData.append("AgreementNumber", values.AgreementNumber as string);
        formData.append(
          "AgreementStart",
          moment(values.AgreementStart).format("YYYY-MM-DD HH:mm:ss")
        );
        formData.append(
          "AgreementFinish",
          moment(values.AgreementFinish).format("YYYY-MM-DD HH:mm:ss")
        );
        formData.append("BusinessSegment", values.BusinessSegment as string);
        if (roomName && deletedFiles.length > 0) {
          deletedFiles.forEach((file: any) =>
            formData.append("DeletedFiles", file)
          );
        }

        attachments
          .filter((file: any) => !Boolean(file.id))
          .forEach((file: any) => {
            formData.append("Attachments", file);
          });

        const res = await axios[roomName ? "put" : "post"](
          `/apartments/${roomName || ""}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then((res) => res.data);

        if (res?.RoomName) {
          message.success("Successfully saved apartment.");

          if (!roomName) {
            navigate(`/apartments/form/${curUser?.OwnerID}/${res?.RoomName}`);
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
          Do you want to delete apartment?
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
            .delete(`/apartments/${roomName}`)
            .then((res) => res.data);

          if (res.RoomName) {
            message.success("Deleted successfully.");
            navigate("/apartments");
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
    if (roomName) {
      fetchApartment();
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
    <>
      <form className="container mx-auto px-3 mt-7" onSubmit={handleSubmit}>
        <div className="bg-c-light rounded py-4 pl-6 flex flex-col mb-5">
          <div className="relative text-center text-xl font-bold mt-3 mb-7">
            {user?.Role === "admin" && (
              <Link to="/apartments">
                <FontAwesomeIcon
                  icon={faLongArrowAltLeft}
                  className="text-3xl cursor-pointer absolute -top-3 left-0"
                />
              </Link>
            )}

            {roomName
              ? `${apartmentOwner?.FirstName} ${apartmentOwner?.LastName}: edit apartment`
              : "Add new apartment"}
          </div>

          <div
            className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mx-auto"
            style={{ maxWidth: "690px" }}
          >
            <div className="flex flex-col">
              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="RoomName">
                  Room name:
                </label>
                <Input
                  placeholder="Room name"
                  className={`${
                    touched.RoomName && errors.RoomName && "border-red-500"
                  }`}
                  name="RoomName"
                  value={values.RoomName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="Type">
                  Type:
                </label>
                <Select
                  defaultValue=""
                  value={values.Type}
                  onChange={(value) => formik.setFieldValue("Type", value)}
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
                <label className="w-32 flex-none" htmlFor="Period">
                  Period:
                </label>
                <Select
                  defaultValue=""
                  value={values.Period}
                  onChange={(value) => formik.setFieldValue("Period", value)}
                  className={`${
                    touched.Period && errors.Period && "border border-red-500"
                  } flex-grow`}
                >
                  <Select.Option value="" disabled>
                    Select Period
                  </Select.Option>
                  <Select.Option value="Monthly">Monthly</Select.Option>
                  <Select.Option value="Quarterly">Quarterly</Select.Option>
                  <Select.Option value="Bi-Annually">Bi Annually</Select.Option>
                  <Select.Option value="Annually">Annually</Select.Option>
                </Select>
              </div>
              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="CleaningFee">
                  Cleaning Fee:
                </label>
                <InputNumber
                  placeholder="Cleaning Fee"
                  className={`${
                    touched.CleaningFee &&
                    errors.CleaningFee &&
                    "border-red-500"
                  }`}
                  name="CleaningFee"
                  value={Number(values.CleaningFee)}
                  step="0.01"
                  onChange={val => setFieldValue("CleaningFee", val)}
                />
              </div>
              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="OwnerCleaningFee">
                  Owner cleaning Fee:
                </label>
                <InputNumber
                  placeholder="Owner cleaning Fee"
                  className={`${
                    touched.OwnerCleaningFee &&
                    errors.OwnerCleaningFee &&
                    "border-red-500"
                  }`}
                  name="OwnerCleaningFee"
                  value={Number(values.OwnerCleaningFee)}
                  step="0.01"
                  onChange={val => setFieldValue("OwnerCleaningFee", val)}
                />
              </div>

              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="BHCommission">
                  BH Commission:
                </label>
                <InputNumber
                  placeholder="BH Commission"
                  className={`${
                    touched.BHCommission &&
                    errors.BHCommission &&
                    "border-red-500"
                  }`}
                  name="BHCommission"
                  value={Number(values.BHCommission)}
                  step="0.01"
                  onChange={val => setFieldValue("BHCommission", val)}
                />
              </div>
              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="ServiceFee">
                  Service Fee:
                </label>
                <InputNumber
                  placeholder="Service Fee"
                  className={`${
                    touched.ServiceFee && errors.ServiceFee && "border-red-500"
                  }`}
                  name="ServiceFee"
                  value={Number(values.ServiceFee)}
                  step="0.01"
                  onChange={val => setFieldValue("ServiceFee", val)}
                />
              </div>
              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="ServiceFee"></label>
                <Button
                  onClick={() => toggleModal(true)}
                  className={`btn-dark hvr-float-shadow h-8 flex-grow`}
                >
                  SOURCE COMMISSION
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
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
                  value={values.Address}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="City">
                  City:
                </label>
                <Input
                  placeholder="City"
                  className={`${
                    touched.City && errors.City && "border-red-500"
                  }`}
                  name="City"
                  value={values.City}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center mb-3">
                <label className="w-32 flex-none" htmlFor="AgreementNumber">
                  Agr-t number:
                </label>
                <Input
                  placeholder="AgreementNumber"
                  className={`${
                    touched.AgreementNumber &&
                    errors.AgreementNumber &&
                    "border-red-500"
                  }`}
                  name="AgreementNumber"
                  value={values.AgreementNumber}
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
                    values.AgreementFinish
                      ? moment(values.AgreementFinish)
                      : null
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
                  Business Segment:
                </label>
                <Input
                  placeholder="Business Segment"
                  className={`${
                    touched.BusinessSegment &&
                    errors.BusinessSegment &&
                    "border-red-500"
                  }`}
                  name="BusinessSegment"
                  value={values.BusinessSegment}
                  onChange={handleChange}
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
          {roomName && (
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

      <SourceCommissionModal
        RoomName={roomName as string}
        visible={isModalVisible}
        onCancel={() => toggleModal(false)}
      />
    </>
  );
}
