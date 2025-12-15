"use client";

import { Card, CardContent, Typography } from "@mui/material";
import Clock from "react-clock";
import React from "react";
import "react-clock/dist/Clock.css";

export default function ClockCard() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center space-y-5">
        <Typography variant="subtitle2" color="text.secondary">
          Current Time
        </Typography>

        <div className="pt-3">
          <Clock hourHandLength={50} value={time} />
        </div>

        <Typography variant="h3" className="font-semibold tracking-wide mt-2">
          {formattedTime}
        </Typography>
      </CardContent>
    </Card>
  );
}
