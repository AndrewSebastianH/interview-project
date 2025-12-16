"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Role = "HR" | "EMPLOYEE";

export default function ResponsiveAppBar({ role }: { role: Role }) {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  return (
    <AppBar position="sticky" elevation={5}>
      <Container maxWidth="xl" className="bg-white">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
            <Image
              src="/logo_dexagroup.png"
              alt="Dexa Group Logo"
              width={180}
              height={70}
              priority
              className="mr-15"
            />
          </Box>

          {/* HR Navigation */}
          {role === "HR" && (
            <Box sx={{ display: "flex", gap: 2, mr: 3, flexGrow: 1 }}>
              <Button onClick={() => router.push("/dashboard/hr")}>
                Manage Employees
              </Button>
              <Button onClick={() => router.push("/dashboard/hr/attendance")}>
                Attendance Review
              </Button>
            </Box>
          )}

          {/* Avatar / Settings */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account settings">
              <IconButton
                onClick={(e) => setAnchorElUser(e.currentTarget)}
                sx={{ p: 0 }}
              >
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => router.push("/auth/login")}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
