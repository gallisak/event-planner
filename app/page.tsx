"use client";

import { useState, useEffect, useMemo } from "react";
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
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import { CalendarEvent, EventImportance } from "./types";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./lib/firebase";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterImportance, setFilterImportance] = useState<
    "all" | EventImportance
  >("all");

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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesImportance =
        filterImportance === "all" || event.importance === filterImportance;

      return matchesSearch && matchesImportance;
    });
  }, [events, searchQuery, filterImportance]);

  const handleOpenModal = (event?: CalendarEvent, date?: string) => {
    setEventToEdit(event || null);
    setSelectedDate(date || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEventToEdit(null);
    setSelectedDate("");
    setIsModalOpen(false);
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <Container maxWidth="lg" className="py-8 grow">
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-900 min-w-max"
          >
            My Events
          </Typography>

          <Box className="flex flex-wrap items-center gap-3 w-full justify-end">
            <TextField
              size="small"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              className="bg-white min-w-50"
            />

            <TextField
              select
              size="small"
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value as any)}
              className="bg-white min-w-35"
            >
              <MenuItem value="all">All levels</MenuItem>
              <MenuItem value="ordinary">Ordinary</MenuItem>
              <MenuItem value="important">Important</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, newView) => {
                if (newView !== null) setView(newView);
              }}
              size="small"
              className="bg-white h-10"
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
              className="bg-black text-white hover:bg-gray-800 h-10"
            >
              Add
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box className="flex justify-center p-12">
            <CircularProgress className="text-black" />
          </Box>
        ) : view === "list" ? (
          <EventList events={filteredEvents} onEdit={handleOpenModal} />
        ) : (
          <CalendarView
            events={filteredEvents}
            onEventClick={handleOpenModal}
            onDateClick={(dateStr) => handleOpenModal(undefined, dateStr)}
          />
        )}
      </Container>

      <AddEventModal
        open={isModalOpen}
        onClose={handleCloseModal}
        eventToEdit={eventToEdit}
        defaultDate={selectedDate}
      />
    </Box>
  );
}
