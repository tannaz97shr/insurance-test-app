import axios from "axios";
import { IForm, IFormData, IFormField } from "./types/general";

const API_BASE_URL = "https://assignment.devotel.io/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchFormStructure = async (): Promise<IForm[]> => {
  try {
    const response = await api.get("api/insurance/forms");
    return response.data;
  } catch (error) {
    console.error("Error fetching form structure:", error);
    throw error;
  }
};

export const submitForm = async (formData: IFormData) => {
  try {
    const response = await api.post("api/insurance/forms/submit", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const fetchApplications = async () => {
  try {
    const response = await api.get("api/insurance/forms/submissions");
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

export const fetchDynamicOptions = async (field: IFormField, value: string) => {
  if (field.dynamicOptions) {
    const { endpoint, method } = field.dynamicOptions;
    try {
      if (method === "GET") {
        const response = await api.get(
          `${endpoint}?${field.dynamicOptions.dependsOn}=${value}`
        );
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching options for ${field.id}:`, error);
    }
  }
};
