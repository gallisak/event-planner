"use client";

import { useState } from "react";
import Header from "./components/Header";
import AddEventModal from "./components/AddEventModal";
import { Container, Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Add Event
          </Button>
        </Box>

        <Box className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-125 flex items-center justify-center">
          <Typography color="textSecondary" className="text-lg">
            A calendar and list of events will be here soon...
          </Typography>
        </Box>
      </Container>

      <AddEventModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}
