import axios from "axios";
import { IFormData, IFormStructure } from "./types/general";

const API_BASE_URL = "https://assignment.devotel.io/api/insurance";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchFormStructure = async (): Promise<IFormStructure[]> => {
  try {
    const response = await api.get("/forms");
    return response.data;
  } catch (error) {
    console.error("Error fetching form structure:", error);
    throw error;
  }
};

export const submitForm = async (formData: IFormData) => {
  try {
    const response = await api.post("/forms/submit", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const fetchApplications = async () => {
  try {
    const response = await api.get("/forms/submissions");
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};
