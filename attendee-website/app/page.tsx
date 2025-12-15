"use client";

import ResponsiveAppBar from "@/components/AppBar";
import ClockCard from "@/components/dashboard/ClockCard";

export default function Home() {
  return (
    <>
      <ResponsiveAppBar />

      <main className="p-6 w-full mx-auto">
        <div className="pb-3 font-semibold">Attendance</div>
        <div className="flex flex-col md:grid-cols-2 gap-6">
          <ClockCard />
        </div>
      </main>
    </>
  );
}
