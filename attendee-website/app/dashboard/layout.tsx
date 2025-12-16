// app/dashboard/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResponsiveAppBar from "@/components/AppBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  //   const token = cookieStore.get("token")?.value;

  //   if (!token) {
  //     redirect("/auth/login");
  //   }

  const role = "HR";

  return (
    <>
      <ResponsiveAppBar role={role} />
      <main className="p-6">{children}</main>
    </>
  );
}
