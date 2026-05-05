"use client";

import Header from "./components/Header";
import { Container, Typography, Box } from "@mui/material";

export default function Home() {
  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <Container maxWidth="lg" className="py-8 grow">
        <Box className="flex justify-between items-center mb-6">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-900"
          >
            My Events
          </Typography>
        </Box>

        <Box className="bg-white p-6 shadow-sm border border-gray-200 min-h-125 flex items-center justify-center">
          <Typography color="textSecondary" className="text-lg">
            A calendar and list of events will be here soon...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
