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
  type: "text" | "number" | "date" | "select" | "radio" | "checkbox" | "group";
  required?: boolean;
  options?: string[];
  fields?: IFormField[];
  dynamicOptions?: {
    dependsOn: string;
    endpoint: string;
    method: "GET" | "POST";
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  visibility?: {
    dependsOn: string;
    condition: "equals";
    value: string;
  };
}

export interface IForm {
  fields: IFormField[];
  formId: string;
  title: string;
}

export interface IFetchDynamicOptionsParams {
  dependsOn: string;
  endpoint: string;
  method: "GET" | "POST";
}
