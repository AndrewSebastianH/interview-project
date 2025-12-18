"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AttendanceListItem } from "@/api/types/attendance";
import { getAttendancesPerDate } from "@/api/attendance";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const [attendanceList, setAttendanceList] = React.useState<
    AttendanceListItem[]
  >([]);
  const [openProof, setOpenProof] = React.useState<AttendanceListItem | null>(
    null
  );
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [search, selectedDate]);

  React.useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await getAttendancesPerDate({
          page,
          pageSize: 10,
          search,
          date: selectedDate.format("YYYY-MM-DD"),
        });

        const mapped: AttendanceListItem[] = res.data.map(
          (item: {
            id: any;
            employee: { name: any };
            clockIn: string | number | dayjs.Dayjs | Date | null | undefined;
            clockOut: string | number | dayjs.Dayjs | Date | null | undefined;
            pictureUrl: any;
          }) => ({
            id: item.id,
            name: item.employee.name,
            clockIn: dayjs(item.clockIn).format("HH:mm"),
            clockOut: item.clockOut
              ? dayjs(item.clockOut).format("HH:mm")
              : null,
            status: item.clockOut ? "Present" : "Incomplete",
            pictureUrl: item.pictureUrl,
          })
        );

        setAttendanceList(mapped);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
        setAttendanceList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedDate, search, page]);

  return (
    <main className="p-6 w-full mx-auto flex flex-col gap-6">
      <Typography className="font-semibold text-xl">
        Attendance Review
      </Typography>

      <Box className="flex w-full gap-6 flex-wrap md:flex-nowrap">
        <Card>
          <CardContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={selectedDate}
                onChange={(newValue) => newValue && setSelectedDate(newValue)}
                disableFuture
                slots={{ actionBar: () => null }}
              />
            </LocalizationProvider>
          </CardContent>
        </Card>

        <TableContainer className="p-5 flex-1" component={Paper}>
          <TextField
            placeholder="Search employee..."
            size="small"
            className="w-full mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {loading ? (
            <Box className="flex justify-center py-10">
              <Typography>Loading attendance...</Typography>
            </Box>
          ) : attendanceList.length === 0 ? (
            <Box className="flex flex-col items-center justify-center py-10 gap-4">
              <SentimentNeutralIcon sx={{ fontSize: 80 }} />
              <Typography color="text.secondary">
                No attendance records found.
              </Typography>
            </Box>
          ) : (
            /* Table */
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Clock In</TableCell>
                  <TableCell>Clock Out</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceList.map((att) => (
                  <Tooltip
                    key={att.id}
                    title={
                      att.pictureUrl
                        ? "Click to view proof"
                        : "No proof available"
                    }
                    arrow
                  >
                    <TableRow
                      hover
                      sx={{ cursor: att.pictureUrl ? "pointer" : "default" }}
                      onClick={() => att.pictureUrl && setOpenProof(att)}
                    >
                      <TableCell>{att.name}</TableCell>
                      <TableCell>{att.clockIn}</TableCell>
                      <TableCell>{att.clockOut || "-"}</TableCell>
                      <TableCell>{att.status}</TableCell>
                    </TableRow>
                  </Tooltip>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>

      {/* Dialog for Attendance Proof */}
      <Dialog
        open={!!openProof}
        onClose={() => setOpenProof(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Attendance Proof</DialogTitle>
        <DialogContent className="flex justify-center">
          {openProof?.pictureUrl ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${openProof.pictureUrl}`}
              alt={`Attendance Proof of ${openProof.name}`}
              className="max-w-full max-h-100 object-contain"
            />
          ) : (
            <Typography>No proof available.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
