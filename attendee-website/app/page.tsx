"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomSpinner from "@/components/ui/CustomSpinner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const roleStr = localStorage.getItem("role");
    if (!roleStr) {
      router.replace("/auth/login");
      return;
    }

    const role = JSON.parse(roleStr);

    if (role === "HR") {
      router.replace("/dashboard/hr");
    } else {
      router.replace("/dashboard/employee");
    }
  }, [router]);

  return <CustomSpinner fullScreen />;
}
