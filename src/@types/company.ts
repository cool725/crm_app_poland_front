export type Company = {
  CompanyID: number;
  Name: string;
  Address: string;
  Website: string;
  DB: string;
  Status: "active" | "inactive";
  IsDeleted: boolean;
};
