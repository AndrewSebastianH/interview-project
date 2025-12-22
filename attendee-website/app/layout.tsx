// frontend/src/app/layout.tsx
"use client";

import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
