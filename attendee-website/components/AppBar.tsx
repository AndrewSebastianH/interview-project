"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth";
import MenuIcon from "@mui/icons-material/Menu";

type Role = "HR" | "Employee";

export default function ResponsiveAppBar({ role }: { role: Role }) {
  const router = useRouter();

  // User menu (avatar)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  // HR navigation menu (mobile)
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  return (
    <AppBar position="sticky" elevation={5}>
      <Container maxWidth="xl" className="bg-white">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: {
                xs: 1,
                md: role === "HR" ? 0 : 1,
              },
            }}
          >
            <Image
              src="/logo_dexagroup.png"
              alt="Dexa Group Logo"
              width={180}
              height={70}
              priority
              className="mr-15"
            />
          </Box>

          {/* HR Mobile Menu (☰) */}
          {role === "HR" && (
            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
              <IconButton
                size="large"
                onClick={(e) => setAnchorElNav(e.currentTarget)}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/dashboard/hr");
                    setAnchorElNav(null);
                  }}
                >
                  Manage Employees
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    router.push("/dashboard/hr/attendance");
                    setAnchorElNav(null);
                  }}
                >
                  Attendance Review
                </MenuItem>
              </Menu>
            </Box>
          )}

          {/* HR Desktop Navigation */}
          {role === "HR" && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                mr: 3,
                flexGrow: 1,
              }}
            >
              <Button onClick={() => router.push("/dashboard/hr")}>
                Manage Employees
              </Button>
              <Button onClick={() => router.push("/dashboard/hr/attendance")}>
                Attendance Review
              </Button>
            </Box>
          )}

          {/* Avatar / User Menu */}
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
              <MenuItem
                onClick={() => {
                  logout();
                  setAnchorElUser(null);
                  router.replace("/auth/login");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
