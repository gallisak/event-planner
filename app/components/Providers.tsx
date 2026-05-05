"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { SnackbarProvider } from "../context/SnackbarContext";

const theme = createTheme({
  palette: {
    primary: { main: "#000000" },
    background: { default: "#f9fafb" },
  },
  typography: {
    fontFamily: "inherit",
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>{children}</AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
