export type Company = {
  CompanyID: number;
  Name: string;
  Address: string;
  Website: string;
  DBName: string;
  DBHost: string;
  DBPort: string | number;
  DBUsername: string;
  DBPassword: string;
  Status: "active" | "inactive";
  IsDeleted: boolean;
};
