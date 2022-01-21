import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "antd";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { Apartment } from "../../@types/apartment";
import moment from "moment";

const ExportExcel: React.FC = () => {
  const apartments: Array<Apartment> = useSelector(
    (state: RootState) => state.apartments.apartments
  );
  const curUser = useSelector((state: RootState) => state.common.curUser);

  const excelData = apartments.map((apartment) => {
    return {
      RoomName: apartment.RoomName,
      Type: apartment.Type,
      Period: apartment.Period,
      CleaningFee: apartment.CleaningFee,
      OwnerCleaningFee: apartment.OwnerCleaningFee,
      BHCommission: apartment.BHCommission,
      ServiceFee: apartment.ServiceFee,
      SourceCommission: apartment.SourceCommission,
      Address: apartment.Address,
      City: apartment.City,
      AgreementNumber: apartment.AgreementNumber,
      AgreementStart: apartment.AgreementStart
        ? moment(apartment.AgreementStart).format("YYYY-MM-DD")
        : "",
      AgreementFinish: apartment.AgreementFinish
        ? moment(apartment.AgreementFinish).format("YYYY-MM-DD")
        : "",
      BusinessSegment: apartment.BusinessSegment,
    };
  });

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Apartments");

      worksheet.columns = [
        { header: "ID", key: "OwnerID", width: 9 },
        { header: "RoomName", key: "RoomName", width: 18 },
        { header: "Type", key: "Type", width: 20 },
        { header: "Period", key: "Period", width: 16 },
        { header: "CleaningFee", key: "CleaningFee", width: 16 },
        { header: "OwnerCleaningFee", key: "OwnerCleaningFee", width: 22 },
        { header: "BHCommission", key: "BHCommission", width: 20 },
        { header: "ServiceFee", key: "ServiceFee", width: 15 },
        { header: "SourceCommission", key: "SourceCommission", width: 30 },
        { header: "Address", key: "Address", width: 24 },
        { header: "City", key: "City", width: 15 },
        { header: "AgreementNumber", key: "AgreementNumber", width: 24 },
        { header: "AgreementStart", key: "AgreementStart", width: 22 },
        { header: "AgreementFinish", key: "AgreementFinish", width: 22 },
        { header: "BusinessSegment", key: "BusinessSegment", width: 20 },
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
        `Apartments (${
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
      EXPORT XLS
    </Button>
  );
};

export default ExportExcel;
