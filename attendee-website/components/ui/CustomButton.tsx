"use client";

import { Button, ButtonProps } from "@mui/material";

export default function CustomButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      fullWidth
      variant="contained"
      sx={{
        py: 1.75,
        backgroundColor: "#b42018",
        color: "#FFFFFF",
        textTransform: "none",
        fontWeight: 600,
        "&:hover": {
          backgroundColor: "#461901",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
