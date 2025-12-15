"use client";

import React from "react";
import InsightCard from "./InsightCard";

export default function InsightsSection() {
  const [hoursWorked, setHoursWorked] = React.useState("00:00");
  const [daysClockedIn, setDaysClockedIn] = React.useState("0");
  const [lateArrivals, setLateArrivals] = React.useState("0");

  React.useEffect(() => {
    // TODO api calls
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHoursWorked("40:25");
      setDaysClockedIn("20");
      setLateArrivals("2");
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <InsightCard
        title="Hours Worked This Week"
        value={hoursWorked}
        color="#d6e0ff"
      />
      <InsightCard
        title="Days Clocked In This Month"
        value={daysClockedIn}
        color="#dfffd6"
      />
      <InsightCard title="Late Arrivals" value={lateArrivals} color="#ffdede" />
    </div>
  );
}
