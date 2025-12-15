"use client";

import ResponsiveAppBar from "@/components/AppBar";
import ClockCard from "@/components/dashboard/ClockCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import InsightsSection from "@/components/dashboard/InsightsSection";

export default function Home() {
  return (
    <>
      <ResponsiveAppBar />

      <main className="p-6 w-full mx-auto flex flex-col md:flex-row gap-6">
        <div className="flex flex-col-reverse md:flex-col flex-2 gap-6 md:flex-1">
          <div>
            <div className="pb-3 font-semibold">Insights</div>
            <InsightsSection />
          </div>
          <div>
            <div className="pb-3 font-semibold">Attendance</div>
            <div className="flex flex-col-reverse md:flex-row gap-6">
              <CalendarCard />
              <ClockCard />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
