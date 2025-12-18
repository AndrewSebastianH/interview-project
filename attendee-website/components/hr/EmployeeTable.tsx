"use client";

import * as React from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import EmployeeFormModal from "@/components/hr/EmployeeFormModal";
import DeleteEmployeeModal from "@/components/hr/DeleteEmployeeModal";
import { getEmployees, updateEmployee, deleteEmployee } from "@/api/employees";

interface Employee {
  id: number;
  name: string;
  email: string;
  attendance: { date: string; clockIn: string; clockOut?: string }[];
}

interface EmployeeRowProps {
  employee: Employee;
  onUpdate: (id: number, data: Partial<Employee>) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  showMessage: (message: string, severity: "success" | "error") => void;
}

function EmployeeRow({
  employee,
  onUpdate,
  onDelete,
  showMessage,
}: EmployeeRowProps) {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen((v) => !v)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>{employee.name}</TableCell>
        <TableCell>{employee.email}</TableCell>

        <TableCell align="right">
          <IconButton onClick={() => setOpenEdit(true)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => setOpenDelete(true)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0 }}>
          <Collapse in={open} unmountOnExit>
            <Box m={2}>
              <Typography variant="subtitle2">Recent Attendance</Typography>
              {employee.attendance.length === 0 ? (
                <Typography color="text.secondary">
                  No attendance records.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Clock In</TableCell>
                      <TableCell>Clock Out</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.attendance.map((att, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{att.date}</TableCell>
                        <TableCell>{att.clockIn}</TableCell>
                        <TableCell>{att.clockOut || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <EmployeeFormModal
        mode="edit"
        open={openEdit}
        employee={employee}
        onClose={() => setOpenEdit(false)}
        onSave={async (payload) => {
          try {
            const success = await onUpdate(employee.id, payload);
            if (success)
              showMessage("Employee updated successfully", "success");
            else showMessage("Failed to update employee", "error");
            setOpenEdit(false);
          } catch (err) {
            showMessage("Error updating employee", "error");
            setOpenEdit(false);
          }
        }}
      />

      <DeleteEmployeeModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          try {
            const success = await onDelete(employee.id);
            if (success)
              showMessage("Employee deleted successfully", "success");
            else showMessage("Failed to delete employee", "error");
            setOpenDelete(false);
          } catch (err) {
            showMessage("Error deleting employee", "error");
            setOpenDelete(false);
          }
        }}
      />
    </>
  );
}

export default function EmployeeTable({
  search,
  refreshKey,
}: {
  search?: string;
  refreshKey?: number;
}) {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(5);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({ page, pageSize, search });
      setEmployees(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      showMessage("Failed to fetch employees", "error");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [page, pageSize, search, refreshKey]);

  const handleUpdate = async (id: number, data: Partial<Employee>) => {
    try {
      await updateEmployee(id, data);
      await fetchData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      await fetchData();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const pageCount = Math.ceil(total / pageSize);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map((emp) => (
              <EmployeeRow
                key={emp.id}
                employee={emp}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                showMessage={showMessage}
              />
            ))}
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="center" m={2}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      </TableContainer>

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
    </>
  );
}
