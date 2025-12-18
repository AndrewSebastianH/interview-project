import { API_ROUTES } from "@/constants/apiRoutes";
import axios from "./axiosConfig";

// POST employee
export const login = async (data: { email: string; password: string }) => {
  const url = API_ROUTES.LOGIN;
  const res = await axios.post(url, data);
  return res.data;
};

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("role");
}
