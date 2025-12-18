// frontend/src/app/layout.tsx
"use client";

import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
