export interface AttendanceApiItem {
  id: number;
  date: string;
  clockIn: string;
  clockOut: string | null;
  employee: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AttendanceApiResponse {
  data: AttendanceApiItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface AttendanceListItem {
  id: number;
  name: string;
  clockIn: string;
  clockOut: string | null;
  status: "Present" | "Incomplete";
  pictureUrl?: string;
}
