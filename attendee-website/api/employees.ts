import axios from "./axiosConfig";
import { API_ROUTES } from "../constants/apiRoutes";

// GET employees
export const getEmployees = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  const url = API_ROUTES.GET_EMPLOYEES(params);
  const res = await axios.get(url);
  return res.data;
};

// PATCH employee
export const updateEmployee = async (
  id: number,
  data: { name?: string; role?: string }
) => {
  const url = API_ROUTES.PATCH_EMPLOYEE(id);
  const res = await axios.patch(url, data);
  return res.data;
};

// DELETE employee
export const deleteEmployee = async (id: number) => {
  const url = API_ROUTES.DELETE_EMPLOYEE(id);
  const res = await axios.delete(url);
  return res.data;
};

// POST employee
export const createEmployee = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const url = API_ROUTES.POST_EMPLOYEE;
  const res = await axios.post(url, data);
  return res.data;
};
