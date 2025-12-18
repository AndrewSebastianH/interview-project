"use client";

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface CalendarCardProps {
  selectedDate: Dayjs;
  onChange: (date: Dayjs) => void;
}

export default function CalendarCard({
  selectedDate,
  onChange,
}: CalendarCardProps) {
  return (
    <Card className="max-w-full">
      <CardContent className="flex flex-col items-center justify-center">
        <Typography variant="subtitle2" color="text.secondary" className="mb-2">
          Today
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={selectedDate}
            onChange={(newValue) => newValue && onChange(newValue)}
            slots={{ actionBar: () => null }}
          />
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
}
