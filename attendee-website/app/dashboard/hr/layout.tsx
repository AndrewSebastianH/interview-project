"use client";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

const drawerWidth = 220;

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="section" sx={{ flexGrow: 1, pl: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
