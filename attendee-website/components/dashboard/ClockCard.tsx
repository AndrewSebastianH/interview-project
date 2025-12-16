"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import Clock from "react-clock";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "react-clock/dist/Clock.css";

dayjs.extend(duration);

export default function ClockWithClockInCard() {
  const [alert, setAlert] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPhoto, setSelectedPhoto] = React.useState<File | null>(null);
  const [isClockedIn, setIsClockedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [clockedInTime, setClockedInTime] = React.useState<Date | null>(null);
  const [workedTime, setWorkedTime] = React.useState("00:00:00");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Set mounted = true on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Update time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (isClockedIn && clockedInTime) {
        const diff = now.getTime() - clockedInTime.getTime();
        const dur = dayjs.duration(diff);
        setWorkedTime(
          `${dur.hours().toString().padStart(2, "0")}:${dur
            .minutes()
            .toString()
            .padStart(2, "0")}:${dur.seconds().toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockedIn, clockedInTime]);

  const formattedTime = currentTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleConfirmPhoto = async () => {
    if (!selectedPhoto) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsClockedIn(true);
      setClockedInTime(new Date());
      setWorkedTime("00:00:00");
      setSelectedPhoto(null);
      setIsModalOpen(false);

      setAlert({ type: "success", message: "Clock-in successful!" });
    } catch (err) {
      console.error("Clock-in failed", err);
      setAlert({ type: "error", message: "Clock-in failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockedInTime(null);
    setWorkedTime("00:00:00");

    setAlert({ type: "success", message: "Clock-out successful!" });
  };

  return (
    <>
      <Card className="w-full md:w-fit px-10 py-5 transition-all duration-500">
        <div className="flex flex-col">
          <div className="flex flex-row gap-5 items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center space-y-5">
              <Typography variant="subtitle2" color="text.secondary">
                Current Time
              </Typography>
              <div className="pt-3">
                {mounted ? (
                  <Clock size={160} hourHandLength={80} value={currentTime} />
                ) : (
                  <Typography variant="h4">--:--:--</Typography>
                )}
              </div>
              {mounted && (
                <Typography
                  variant="h4"
                  className="font-semibold tracking-wide mt-2"
                >
                  {formattedTime}
                </Typography>
              )}
            </CardContent>
          </div>

          <div className="flex flex-col w-full items-center justify-end mt-5 gap-3">
            {isClockedIn && (
              <>
                <Typography variant="h6" color="text.secondary">
                  Time Worked: {workedTime}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClockOut}
                  className="w-full"
                >
                  Clock Out
                </Button>
              </>
            )}

            <Button
              variant="contained"
              className="w-full flex items-center justify-center gap-2"
              color="success"
              onClick={() => !isClockedIn && setIsModalOpen(true)}
              startIcon={isClockedIn ? <CheckCircleIcon /> : <PunchClockIcon />}
              disabled={isClockedIn}
            >
              {isClockedIn
                ? `Clocked in at ${clockedInTime?.toLocaleTimeString()}`
                : "Clock In"}
            </Button>
          </div>
        </div>
      </Card>

      <Dialog
        key={isModalOpen ? "open" : "closed"}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <DialogTitle>Clock In Confirmation</DialogTitle>
        <DialogContent className="flex flex-col items-center gap-4">
          {!selectedPhoto && (
            <Typography>
              Please upload a photo to confirm your clock-in.
            </Typography>
          )}

          {selectedPhoto && (
            <img
              src={URL.createObjectURL(selectedPhoto)}
              alt="Preview"
              className="max-w-full max-h-60 rounded-lg shadow-md"
            />
          )}

          <input
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedPhoto(file);
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setSelectedPhoto(null);
              setIsModalOpen(false);
            }}
            color="info"
          >
            Cancel
          </Button>

          {!selectedPhoto ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Photo
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmPhoto}
              disabled={isLoading}
            >
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert(null)}
          severity={alert?.type ?? "success"}
          variant="filled"
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
