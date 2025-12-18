"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomSpinner from "@/components/ui/CustomSpinner";
import ResponsiveAppBar from "@/components/AppBar";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roleStr = localStorage.getItem("role");
    if (!roleStr) {
      router.replace("/auth/login");
      return;
    }

    const role = JSON.parse(roleStr);
    if (role !== "Employee") {
      router.replace("/dashboard/hr");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return <CustomSpinner fullScreen />;

  return (
    <>
      <ResponsiveAppBar role="Employee" />
      {children}
    </>
  );
}
