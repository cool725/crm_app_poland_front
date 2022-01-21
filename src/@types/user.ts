export type User = {
  OwnerID: number;
  FirstName: null | string;
  LastName: null | string;
  Email: string;
  Mobile: null | string;
  Landline: null | string;
  Company: null | string;
  NIP: null | string;
  StartDate: null | string;
  RenewalDate: null | string;
  Role: 'owner' | 'admin';
  Status: 'active' | 'inactive';
  IsDeleted: boolean;
  Agreement: null | string;
  Password?: null | string;
  Apartments?: string;
  Parkings?: string;
};