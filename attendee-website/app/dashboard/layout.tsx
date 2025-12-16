import ResponsiveAppBar from "@/components/AppBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ResponsiveAppBar />
      <main className="p-6">{children}</main>
    </>
  );
}
