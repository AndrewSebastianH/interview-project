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
} from "@mui/material";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import { mockAttendance, AttendanceListItem } from "@/constants/MockConstants";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const [attendanceList, setAttendanceList] = React.useState<
    AttendanceListItem[]
  >([]);
  const [openProof, setOpenProof] = React.useState<AttendanceListItem | null>(
    null
  );

  // Filter mock attendance by selected date
  React.useEffect(() => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const filtered = mockAttendance.filter((att) => att.date === dateStr);
    setAttendanceList(filtered);
  }, [selectedDate]);

  return (
    <main className="p-6 w-full mx-auto flex flex-col gap-6">
      <Typography className="font-semibold text-xl">
        Attendance Review
      </Typography>

      <Box className="flex w-full gap-6 flex-wrap md:flex-nowrap">
        {/* Left: Calendar */}
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

        {/* Right: Attendance Table */}
        {attendanceList.length === 0 ? (
          <Card sx={{ flex: 1 }}>
            <CardContent className="flex flex-col h-full items-center justify-center space-y-5">
              <SentimentNeutralIcon sx={{ fontSize: 80 }} />
              <Typography color="text.secondary">
                No attendance records for this date.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer className="p-5 flex-1" component={Paper}>
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
                      att.pictureProof
                        ? "Click to view proof"
                        : "No proof available"
                    }
                    arrow
                  >
                    <TableRow
                      hover
                      sx={{ cursor: att.pictureProof ? "pointer" : "default" }}
                      onClick={() => att.pictureProof && setOpenProof(att)}
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
          </TableContainer>
        )}
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
          {openProof?.pictureProof ? (
            <img
              src={openProof.pictureProof}
              alt={`Proof of ${openProof.name}`}
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
