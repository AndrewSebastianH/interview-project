import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
  color?: "primary" | "secondary" | "inherit";
}

export default function Loader({
  fullScreen = false,
  size = 40,
  color = "primary",
}: LoaderProps) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(255,255,255,0.7)",
          zIndex: 9999,
        }}
      >
        <CircularProgress size={size} color={color} />
      </Box>
    );
  }

  // Inline loader
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress size={size} color={color} />
    </Box>
  );
}
