"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EmployeeTable from "@/components/hr/EmployeeTable";
import EmployeeFormModal from "@/components/hr/EmployeeFormModal";
import React from "react";
import { createEmployee } from "@/api/employees";

export default function HRDashboard() {
  const [openCreate, setOpenCreate] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error"
  >("success");

  const showMessage = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <main className="p-6 w-full mx-auto flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <Typography className="font-semibold">Employee Table</Typography>

        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <TextField
                placeholder="Search employee..."
                size="small"
                className="w-full md:w-1/3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                onClick={() => setOpenCreate(true)}
                variant="contained"
                startIcon={<AddIcon />}
              >
                Add New Employee
              </Button>
            </div>
            <div className="py-10">
              <EmployeeTable search={search} refreshKey={refreshKey} />
            </div>
          </CardContent>
        </Card>

        {/* Create Modal */}
        <EmployeeFormModal
          mode="create"
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSave={async (payload) => {
            if (!payload.password) {
              alert("Password is required");
              return;
            }

            try {
              await createEmployee({
                name: payload.name,
                email: payload.email,
                password: payload.password,
              });
              setOpenCreate(false);
              setSearch((prev) => prev);
              setRefreshKey((k) => k + 1);
              showMessage("Employee created successfully", "success");
            } catch (err) {
              console.error("Failed to create employee", err);
              showMessage("Failed to create employee", "error");
            }
          }}
        />
      </section>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
