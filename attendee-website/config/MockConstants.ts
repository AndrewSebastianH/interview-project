type EmployeeBase = {
  id: number;
  name: string;
  email: string;
};

export type EmployeeListItem = EmployeeBase & {
  attendance: AttendanceBase[];
};

export const mockEmployees: EmployeeListItem[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    attendance: [
      { date: "2025-12-15", clockIn: "08:55", clockOut: "" },
      { date: "2025-12-14", clockIn: "09:02", clockOut: "17:00" },
      { date: "2025-12-13", clockIn: "08:58", clockOut: "17:10" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    attendance: [
      { date: "2025-12-15", clockIn: "09:10", clockOut: "17:00" },
      { date: "2025-12-14", clockIn: "08:50", clockOut: "17:05" },
      { date: "2025-12-13", clockIn: "08:45", clockOut: "16:55" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@company.com",
    attendance: [
      { date: "2025-12-15", clockIn: "08:40", clockOut: "17:10" },
      { date: "2025-12-14", clockIn: "08:55", clockOut: "17:05" },
      { date: "2025-12-13", clockIn: "09:00", clockOut: "17:00" },
    ],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@company.com",
    attendance: [
      { date: "2025-12-15", clockIn: "09:05", clockOut: "16:50" },
      { date: "2025-12-14", clockIn: "09:00", clockOut: "17:00" },
      { date: "2025-12-13", clockIn: "08:50", clockOut: "16:55" },
    ],
  },
  {
    id: 5,
    name: "William Brown",
    email: "william@company.com",
    attendance: [
      { date: "2025-12-15", clockIn: "08:45", clockOut: "17:00" },
      { date: "2025-12-14", clockIn: "08:48", clockOut: "16:50" },
      { date: "2025-12-13", clockIn: "08:55", clockOut: "17:05" },
    ],
  },
];

export type AttendanceBase = {
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:mm
  clockOut?: string; // optional, HH:mm
};

export type AttendanceListItem = AttendanceBase & {
  id: number;
  name: string;
  pictureProof: string;
  status: "on time" | "late";
};

export const mockAttendance: AttendanceListItem[] = [
  {
    id: 1,
    name: "John Doe",
    date: "2025-12-15",
    clockIn: "08:55",
    clockOut: "17:05",
    status: "on time",
    pictureProof: "https://placehold.co/600x400",
  },
  {
    id: 2,
    name: "Jane Smith",
    date: "2025-12-15",
    clockIn: "09:10",
    clockOut: "17:00",
    status: "late",
    pictureProof: "https://placehold.co/600x400",
  },
  {
    id: 3,
    name: "Michael Johnson",
    date: "2025-12-15",
    clockIn: "08:40",
    clockOut: "17:10",
    status: "on time",
    pictureProof: "https://placehold.co/600x400",
  },
  {
    id: 4,
    name: "Emily Davis",
    date: "2025-12-15",
    clockIn: "09:05",
    clockOut: "16:50",
    status: "late",
    pictureProof: "https://placehold.co/600x400",
  },
  {
    id: 5,
    name: "William Brown",
    date: "2025-12-15",
    clockIn: "08:45",
    clockOut: "17:00",
    status: "on time",
    pictureProof: "https://placehold.co/600x400",
  },
];
