// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import AddEventModal from "./components/AddEventModal";
import EventList from "./components/EventList";
import CalendarView from "./components/CalendarView";
import {
  Container,
  Typography,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { CalendarEvent } from "./types";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "events"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CalendarEvent[];

        fetchedEvents.sort((a, b) => {
          const dateA = a.createdAt || "";
          const dateB = b.createdAt || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        setEvents(fetchedEvents);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleOpenModal = (event?: CalendarEvent) => {
    setEventToEdit(event || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEventToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <Container maxWidth="lg" className="py-8 grow">
        <Box className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-900"
          >
            My Events
          </Typography>

          <Box className="flex items-center gap-4">
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => {
                if (newView !== null) setView(newView);
              }}
              size="small"
              className="bg-white"
            >
              <ToggleButton value="list">
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="calendar">
                <CalendarMonthIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2"
            >
              Add Event
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box className="flex justify-center p-12">
            <CircularProgress className="text-black" />
          </Box>
        ) : view === "list" ? (
          <EventList events={events} onEdit={handleOpenModal} />
        ) : (
          <CalendarView events={events} onEventClick={handleOpenModal} />
        )}
      </Container>

      <AddEventModal
        open={isModalOpen}
        onClose={handleCloseModal}
        eventToEdit={eventToEdit}
      />
    </Box>
  );
}
