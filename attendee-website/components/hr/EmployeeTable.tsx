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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { EmployeeListItem } from "@/config/MockConstants";
import { fetchEmployeesBackend } from "@/services/Employees";
import EmployeeFormModal from "@/components/hr/EmployeeFormModal";
import DeleteEmployeeModal from "@/components/hr/DeleteEmployeeModal";

function EmployeeRow({ employee }: { employee: EmployeeListItem }) {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  return (
    <>
      {/* Main Row */}
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

      {/* Collapsible Row */}
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

      {/* Edit Modal */}
      <EmployeeFormModal
        mode="edit"
        open={openEdit}
        employee={employee}
        onClose={() => setOpenEdit(false)}
        onSave={(payload) => {
          console.log("UPDATE EMPLOYEE:", employee.id, payload);
          setOpenEdit(false);
        }}
      />

      {/* Delete Modal */}
      <DeleteEmployeeModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          console.log("DELETE EMPLOYEE:", employee.id);
          setOpenDelete(false);
        }}
      />
    </>
  );
}

export default function EmployeeTable() {
  // Paginations
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(5);
  const [employees, setEmployees] = React.useState<EmployeeListItem[]>([]);
  const [total, setTotal] = React.useState(0);

  //   Search
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const res = fetchEmployeesBackend(page, pageSize, search);
    console.log("fetch is called:" + page, pageSize);
    setEmployees(res.data);
    setTotal(res.total);
  }, [page, pageSize]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const pageCount = Math.ceil(total / pageSize);

  return (
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
            <EmployeeRow key={emp.id} employee={emp} />
          ))}
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="center" m={2}>
        <Pagination count={pageCount} page={page} onChange={handleChangePage} />
      </Box>
    </TableContainer>
  );
}
