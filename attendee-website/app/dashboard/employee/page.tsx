"use client";

import React from "react";
import dayjs, { Dayjs } from "dayjs";

import ClockCard from "@/components/dashboard/ClockCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import InsightsSection from "@/components/dashboard/InsightsSection";

export default function Home() {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());

  const selectedMonth = selectedDate.format("YYYY-MM");

  return (
    <main className="p-6 w-full mx-auto flex flex-col md:flex-row gap-6">
      <div className="flex flex-col-reverse md:flex-col flex-2 gap-6 md:flex-1">
        <div>
          <div className="pb-3 font-semibold">Insights</div>
          <InsightsSection month={selectedMonth} />
        </div>

        <div>
          <div className="pb-3 font-semibold">Attendance</div>
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <CalendarCard
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />
            <ClockCard />
          </div>
        </div>
      </div>
    </main>
  );
}
