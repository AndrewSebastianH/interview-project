"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomSpinner from "@/components/ui/CustomSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roleStr = localStorage.getItem("role");
    if (!roleStr) {
      router.replace("/auth/login");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) return <CustomSpinner fullScreen />;

  return <>{children}</>;
}
