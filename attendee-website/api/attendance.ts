import { API_ROUTES } from "@/constants/apiRoutes";
import axios from "./axiosConfig";

// POST clock-in
export const clockIn = async () => {
  const url = API_ROUTES.ATTENDANCE_CLOCKIN;
  const res = await axios.post(url);
  return res.data;
};

// GET is clocked-in
export const getIsClockedIn = async () => {
  const url = API_ROUTES.ATTENDANCE_IS_CLOCKED_IN;
  const res = await axios.get(url);
  return res.data;
};

// GET insights per month
export const getAttendanceInsights = async (params?: { month?: string }) => {
  const url = API_ROUTES.ATTENDANCE_INSIGHTS(params);
  const res = await axios.get(url);
  return res.data;
};

// POST upload proof
export const uploadProof = async (attendanceId: number, file: File) => {
  const url = API_ROUTES.ATTENDANCE_UPLOAD_PROOF(attendanceId);
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// POST clock-out
export const clockOut = async () => {
  const url = API_ROUTES.ATTENDANCE_CLOCKOUT;
  const res = await axios.post(url);
  return res.data;
};

// GET attendances per date
export const getAttendancesPerDate = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  date?: string;
}) => {
  const url = API_ROUTES.GET_ATTENDANCES_TODAY(params);
  const res = await axios.get(url);
  return res.data;
};
