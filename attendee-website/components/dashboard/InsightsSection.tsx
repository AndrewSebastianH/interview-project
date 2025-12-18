"use client";

import React from "react";
import InsightCard from "./InsightCard";
import { getAttendanceInsights } from "@/api/attendance";

interface InsightsSectionProps {
  month: string; // YYYY-MM
}

export default function InsightsSection({ month }: InsightsSectionProps) {
  const [hoursWorked, setHoursWorked] = React.useState("00:00");
  const [daysClockedIn, setDaysClockedIn] = React.useState("0");
  const [lateArrivals, setLateArrivals] = React.useState("0");

  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await getAttendanceInsights({ month });

        // seconds → HH:mm
        const hours = Math.floor(res.totalWorkedSeconds / 3600);
        const minutes = Math.floor((res.totalWorkedSeconds % 3600) / 60);

        setHoursWorked(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`
        );
        setDaysClockedIn(res.daysClockedIn.toString());
        setLateArrivals(res.lateArrivals.toString());
      } catch (err) {
        console.error("Failed to fetch insights", err);
      }
    };

    fetchInsights();
  }, [month]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <InsightCard
        title="Hours Worked This Month"
        value={hoursWorked}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      />

      <InsightCard
        title="Days Clocked In"
        value={daysClockedIn}
        gradient="linear-gradient(135deg, #11998e 0%, #0f766e 100%)"
      />

      <InsightCard
        title="Late Arrivals"
        value={lateArrivals}
        gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
      />
    </div>
  );
}
