import { useState, useEffect } from "react";

import { Button, Modal, Select, Table, message, InputNumber } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ColumnsType } from "antd/es/table";
import { SourceCommision } from "../../@types/sourcecommision";
import { useTranslation } from "react-i18next";

import axios from "axios";

const bookingSourceVals: any = {
  telefoniczna: "telefoniczna",
  walkin: "walkin",
  "booking.com xml": "Booking.Com xml",
  kurzurlaub: "KurzUrlaub",
  wlasciciel: "wlasciciel",
};

interface SourceCommisionProps {
  visible: boolean;
  onCancel: () => void;
  RoomName: string | null;
}

const SourceCommisionModal: React.FC<SourceCommisionProps> = (props) => {
  const emptyCommission = {
    RowID: "",
    RoomName: props.RoomName as string,
    BookingSource: "",
    SourceCommision: 0,
  };

  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<any>>([]);
  const [initialValues, setInitialValues] = useState<Array<SourceCommision>>([
    emptyCommission,
  ]);
  const [t] = useTranslation("common");

  const formSchema = Yup.object({
    commissions: Yup.array().of(
      Yup.object().shape({
        RowID: Yup.string(),
        RoomName: Yup.string().required("Required"),
        BookingSource: Yup.string()
          .oneOf([
            "telefoniczna",
            "walkin",
            "Booking.Com xml",
            "KurzUrlaub",
            "wlasciciel",
          ])
          .required("Required"),
        SourceCommision: Yup.number().required("Required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      commissions: initialValues,
    },
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // set BookingSource to camel cased values
        const commissions = values.commissions.map((commission) => {
          return {
            ...commission,
            BookingSource:
              bookingSourceVals[commission.BookingSource as string],
          };
        });

        const res = await axios
          .post(`/source-commisions`, { commissions })
          .then((res) => res.data);

        if (res?.success) {
          message.success(t("Saved successfully."));
          props.onCancel();
        }
      } catch (err: any) {
        console.log(err);
      }
      setSubmitting(false);
    },
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    setSubmitting,
    isSubmitting,
    resetForm,
  } = formik;

  const columns: ColumnsType<SourceCommision> = [
    {
      title: t("apartments.sourceCommission.Room"),
      dataIndex: "RoomName",
    },
    {
      title: t("apartments.sourceCommission.Booking Source"),
      dataIndex: "BookingSource",
      width: 200,
      render: (
        BookingSource: string,
        record: SourceCommision,
        index: number
      ) => {
        return (
          <Select
            size="large"
            disabled={user?.Role === "admin" ? false : true}
            onChange={(value) =>
              setFieldValue(`commissions[${index}]BookingSource`, value)
            }
            value={BookingSource.toLowerCase()}
            className={`w-full ${
              errors.commissions &&
              touched.commissions &&
              touched.commissions[index]?.BookingSource &&
              Boolean((errors.commissions[index] as any)?.BookingSource) &&
              "border border-red-500"
            }`}
          >
            <Select.Option value="telefoniczna">telefoniczna</Select.Option>
            <Select.Option value="walkin">walkin</Select.Option>
            <Select.Option value="booking.com xml">
              Booking.com XML
            </Select.Option>
            <Select.Option value="kurzurlaub">KurzUrlaub</Select.Option>
            <Select.Option value="wlasciciel">wlasciciel</Select.Option>
          </Select>
        );
      },
    },
    {
      title: t("apartments.sourceCommission.Commission"),
      dataIndex: "SourceCommision",
      width: 100,
      render: (Commission: number, record: SourceCommision, index: number) => {
        return (
          <InputNumber
            placeholder="Cleaning Fee"
            disabled={user?.Role === "admin" ? false : true}
            className={`w-full h-10 ${
              errors.commissions &&
              touched.commissions &&
              touched.commissions[index]?.SourceCommision &&
              Boolean((errors.commissions[index] as any)?.SourceCommision) &&
              "border-red-500"
            }`}
            value={Commission}
            onChange={(value) =>
              setFieldValue(`commissions[${index}]SourceCommision`, value)
            }
            step="0.01"
          />
        );
      },
    },
  ];

  const addCommission = () => {
    setFieldValue("commissions", [...values.commissions, emptyCommission]);
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: <div className="text-white text-center">Are you sure ?</div>,
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
        const commissionIds = selectedRowKeys
          .map((key) => key.split("_")[0])
          .filter((id) => Boolean(id));

        setSubmitting(true);
        try {
          if (commissionIds.length > 0) {
            const res = await axios
              .delete("/source-commisions", { data: { ids: commissionIds } })
              .then((res) => res.data);
            if (res?.success) {
              message.success(t("Deleted successfully."));
            }
          }
        } catch (err) {
          console.log(err);
        }

        const commissions = values.commissions.filter(
          (row, index) =>
            selectedRowKeys.indexOf(`${row.RowID}_${index}`) === -1
        );
        setFieldValue("commissions", commissions);

        setSubmitting(false);
      },
      onCancel() {},
    });
  };

  const deleteCommisions = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t("Select commissions first."));
      return;
    }

    confirmDelete();
  };

  const fetchCommissions = async () => {
    try {
      const res = await axios
        .get("/source-commisions/list", {
          params: {
            RoomName: props.RoomName,
          },
        })
        .then((res) => res.data);

      setInitialValues(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (props.visible) {
      fetchCommissions();
    } else {
      resetForm();
      setSelectedRowKeys([]);
    }
  }, [props.visible]);

  return (
    <Modal
      closable={true}
      visible={props.visible}
      footer={false}
      width={520}
      centered
      className="modal-body-p-0 close-outside"
      onCancel={() => props.onCancel()}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-white"
      >
        <Table
          rowKey={(record, index) => {
            return `${record.RowID}_${index}`;
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (values) => setSelectedRowKeys(values),
          }}
          columns={columns}
          dataSource={values.commissions}
          className="w-full table-sm"
          rowClassName="cursor-pointer hover:bg-c-blue hover:bg-opacity-10"
          pagination={{
            hideOnSinglePage: true,
            pageSize: 10,
          }}
        />

        <div
          className={`flex mt-5 mb-3 ${user?.Role === "admin" ? "" : "hidden"}`}
        >
          <Button
            key="delete"
            className="btn-danger hvr-float-shadow h-9 w-36 ml-3.5 text-xs"
            onClick={deleteCommisions}
            disabled={isSubmitting}
          >
            {t("DELETE")}
          </Button>
          <Button
            key="add"
            onClick={addCommission}
            className="btn-dark hvr-float-shadow h-9 w-36 ml-3.5 px-0 text-xs"
            disabled={isSubmitting}
          >
            {t("apartments.sourceCommission.ADD COMMISSION")}
          </Button>
          <Button
            key="save"
            htmlType="submit"
            disabled={isSubmitting}
            className="btn-yellow hvr-float-shadow h-9 w-36 ml-2 text-xs"
          >
            {t("SAVE")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SourceCommisionModal;
