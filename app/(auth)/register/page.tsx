"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to create an account. Please try again.");
      }
    }
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
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4 w-full">
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister} className="w-full">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            className="mt-6 mb-4 py-3 bg-black text-white hover:bg-gray-800"
          >
            Sign Up
          </Button>

          <div className="text-center mt-2">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </Box>
      </Paper>
    </Container>
  );
}
