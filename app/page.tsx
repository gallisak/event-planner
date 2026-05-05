"use client";

import { useState } from "react";
import Header from "./components/Header";
import AddEventModal from "./components/AddEventModal";
import EventList from "./components/EventList";
import { Container, Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <Container maxWidth="lg" className="py-8 grow">
        <Box className="flex justify-between items-center mb-8">
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
            className="bg-black text-white hover:bg-gray-800 px-6 py-2"
          >
            Add Event
          </Button>
        </Box>

        <EventList />
      </Container>

      <AddEventModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}
