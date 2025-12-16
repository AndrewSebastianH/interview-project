"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EmployeeTable from "@/components/hr/EmployeeTable";
import EmployeeFormModal from "@/components/hr/EmployeeFormModal";
import React from "react";

export default function HRDashboard() {
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);

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
              <EmployeeTable />
            </div>
          </CardContent>
        </Card>

        {/* Create Modal */}
        <EmployeeFormModal
          mode="create"
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSave={(payload) => {
            console.log("CREATE EMPLOYEE:", payload);
            setOpenCreate(false);
          }}
        />
      </section>
    </main>
  );
}
