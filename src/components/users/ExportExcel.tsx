import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "antd";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { User } from "../../@types/user";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ExportExcel: React.FC = () => {
  const users: Array<User> = useSelector(
    (state: RootState) => state.users.owners
  );
  const [t] = useTranslation("common");

  const excelData = users.map((user) => {
    return {
      OwnerID: user.OwnerID,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      Mobile: user.Mobile,
      Landline: user.Landline,
      StartDate: user.StartDate
        ? moment(user.StartDate).format("YYYY-MM-DD")
        : "",
      RenewalDate: user.RenewalDate
        ? moment(user.RenewalDate).format("YYYY-MM-DD")
        : "",
      Apartments: user.Apartments,
      Parkings: user.Parkings,
      Agreement: user.Agreement,
      Status:
        String(user.Status).toLowerCase() === "active" ? "Active" : "Blocked",
    };
  });

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("owners", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      worksheet.columns = [
        { header: "ID", key: "OwnerID", width: 9 },
        { header: "Name", key: "FirstName", width: 10 },
        { header: "Surname", key: "LastName", width: 35 },
        { header: "Email", key: "Email", width: 35 },
        { header: "Phone", key: "Mobile", width: 16 },
        { header: "Landline", key: "Landline", width: 16 },
        { header: "Start date", key: "StartDate", width: 14 },
        { header: "Renewal date", key: "RenewalDate", width: 17 },
        { header: "Apartments", key: "Apartments", width: 30 },
        { header: "Parkings", key: "Parkings", width: 30 },
        { header: "Agreement", key: "Agreement", width: 20 },
        { header: "Status", key: "Status", width: 10 },
      ];

      worksheet.getColumn(1).alignment = {
        vertical: "bottom",
        horizontal: "left",
      };

      worksheet.getRow(1).font = { bold: true, size: 14 };
      worksheet.getRow(1).height = 20;

      worksheet.addRows(excelData);

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `owners.xlsx`
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button
      className="btn-default hvr-float-shadow h-10 w-40 ml-3"
      onClick={exportExcel}
    >
      {t('EXPORT XLS')}
    </Button>
  );
};

export default ExportExcel;
