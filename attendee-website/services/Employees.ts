import { mockEmployees } from "@/config/constants";

export function fetchEmployeesBackend(
  page: number,
  pageSize: number,
  search?: string
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = mockEmployees.slice(start, end);
  return {
    page,
    total: 200,
    data,
  };
}
