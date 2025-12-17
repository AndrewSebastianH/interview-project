export const ROUTES = {
  LOGIN: "/auth/login",

  GET_EMPLOYEES: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&")
      : "";
    return `/employees${query}`;
  },
  POST_EMPLOYEE: "/employees",
  PATCH_EMPLOYEE: (id: number | string) => `/employees/${id}`,
  DELETE_EMPLOYEE: (id: number | string) => `/employees/${id}`,

  ATTENDANCE_CLOCKIN: "/attendance/clock-in",
  ATTENDANCE_UPLOAD_PROOF: (id: number | string) =>
    `/attendance/${id}/upload-proof`,
  ATTENDANCE_CLOCKOUT: "/attendance/clock-out",

  GET_ATTENDANCES_TODAY: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    date?: string;
  }) => {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&")
      : "";
    return `/attendance${query}`;
  },
};
