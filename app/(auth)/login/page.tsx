"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit form with:", email, password);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className="h-screen flex items-center justify-center"
    >
      <Paper elevation={3} className="p-8 w-full flex flex-col items-center">
        <Typography
          component="h1"
          variant="h5"
          className="mb-6 font-bold uppercase tracking-wider"
        >
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleEmailLogin} className="w-full">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            className="mt-6 mb-4 py-3 bg-black text-white hover:bg-gray-800"
          >
            Sign In
          </Button>

          <div className="flex items-center justify-center my-4 text-gray-400 text-sm">
            <span className="bg-white px-2">OR</span>
          </div>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            className="mb-4 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Continue with Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
