import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "antd";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { Parking } from "../../@types/parking";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ExportExcel: React.FC = () => {
  const parkings: Array<Parking> = useSelector(
    (state: RootState) => state.parkings.parkings
  );
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const [t] = useTranslation("common");

  const excelData = parkings.map((parking) => {
    return {
      ParkingName: parking.ParkingName,
      BHCommision: parking.BHCommision,
      SourceCommision: parking.SourceCommision,
      Address: parking.Address,
      City: parking.City,
      AgreementStart: parking.AgreementStart
        ? moment(parking.AgreementStart).format("YYYY-MM-DD")
        : "",
      AgreementFinish: parking.AgreementFinish
        ? moment(parking.AgreementFinish).format("YYYY-MM-DD")
        : "",
    };
  });

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Parkings", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      worksheet.columns = [
        { header: "ParkingName", key: "ParkingName", width: 20 },
        { header: "BHCommision", key: "BHCommision", width: 22 },
        { header: "SourceCommision", key: "SourceCommision", width: 24 },
        { header: "Address", key: "Address", width: 30 },
        { header: "City", key: "City", width: 20 },
        { header: "AgreementStart", key: "AgreementStart", width: 24 },
        { header: "AgreementFinish", key: "AgreementFinish", width: 24 },
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
        `Parkings (${
          curUser
            ? `${curUser.FirstName ? curUser.FirstName + " " : ""}${
                curUser.LastName
              }`
            : "All owners"
        }).xlsx`
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
      {t("EXPORT XLS")}
    </Button>
  );
};

export default ExportExcel;
