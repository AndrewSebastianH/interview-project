"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface EmployeeFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  employee?: {
    id: number;
    name: string;
    email: string;
  };
  onClose: () => void;
  onSave: (payload: { name: string; email: string; password?: string }) => void;
}

export default function EmployeeFormModal({
  open,
  mode,
  employee,
  onClose,
  onSave,
}: EmployeeFormModalProps) {
  const isCreate = mode === "create";

  const [name, setName] = React.useState(employee?.name || "");
  const [email, setEmail] = React.useState(employee?.email || "");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleShowPassword = () => setShowPassword(true);
  const handleHidePassword = () => setShowPassword(false);

  React.useEffect(() => {
    if (open) {
      setName(employee?.name || "");
      setEmail(employee?.email || "");
      setPassword("");
      setConfirmPassword("");
      setErrors({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [open, employee]);

  // Unified validation for both create and edit
  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password rules: required for create, optional for edit
    if (isCreate && !password) {
      newErrors.password = "Password is required";
    }

    if (password) {
      if (password.length < 6) newErrors.password = "Minimum 6 characters";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const isFormValid = React.useMemo(() => {
    if (!name.trim() || !email.trim()) return false;
    if (!/\S+@\S+\.\S+/.test(email)) return false;
    if (isCreate && !password) return false;
    if (password && password.length < 6) return false;
    if (password && password !== confirmPassword) return false;

    // edit mode: must have at least one change
    if (!isCreate && employee) {
      const isChanged =
        name !== employee.name ||
        email !== employee.email ||
        (password && password.length > 0);
      return isChanged;
    }

    return true;
  }, [name, email, password, confirmPassword, isCreate, employee]);

  const handleCreate = () => {
    if (!validate()) return;
    onSave({ name, email, password });
  };

  const handleEdit = () => {
    if (!validate()) return;
    const payload: { name: string; email: string; password?: string } = {
      name,
      email,
    };
    if (password) payload.password = password;
    onSave(payload);
  };

  const handleSave = isCreate ? handleCreate : handleEdit;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {isCreate ? "Create New Employee" : "Edit Employee"}
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />

        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            {isCreate ? "Set Initial Password" : "Change Password (optional)"}
          </Typography>

          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Hold to view password">
                      <IconButton
                        aria-label="hold to view password"
                        edge="end"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleShowPassword();
                        }}
                        onMouseUp={handleHidePassword}
                        onMouseLeave={handleHidePassword}
                        onTouchStart={handleShowPassword}
                        onTouchEnd={handleHidePassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isFormValid}
        >
          {isCreate ? "Create Employee" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
