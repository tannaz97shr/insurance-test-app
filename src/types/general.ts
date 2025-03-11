export interface IFormData {
  fullName: string;
  Age: number;
  insuranceType: string;
  city: string;
  status: string;
  securitySystem: string;
}

export interface IFormField {
  id: string;
  label: string;
  type: string;
  fields: IFormField[];
}

export interface IFormStructure {
  fields: IFormField[];
  formId: string;
  title: string;
}
