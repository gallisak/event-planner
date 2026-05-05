"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { CalendarEvent } from "../types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

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
        console.error("Помилка отримання подій:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <Box className="flex justify-center p-12">
        <CircularProgress className="text-black" />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box className="bg-white p-6 shadow-sm border border-gray-200 min-h-75 flex items-center justify-center">
        <Typography color="textSecondary" className="text-lg">
          You donʼt have any events yet. Click Add Event to create one!
        </Typography>
      </Box>
    );
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "error";
      case "important":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          className="h-full flex flex-col hover:shadow-lg transition-shadow border border-gray-100"
        >
          <CardContent className="grow">
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography
                  variant="h6"
                  className="font-bold line-clamp-1"
                  title={event.title}
                >
                  {event.title}
                </Typography>
                <Chip
                  label={event.importance}
                  color={getImportanceColor(event.importance) as any}
                  size="small"
                  className="capitalize mt-1"
                />
              </Box>

              <IconButton
                onClick={() => handleDelete(event.id!)}
                color="error"
                size="small"
                className="ml-2"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography
              color="textSecondary"
              className="mb-4 text-sm font-medium"
            >
              {new Date(event.date).toLocaleString()}
            </Typography>

            <Typography variant="body2" className="text-gray-600 line-clamp-3">
              {event.description || "No description provided."}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
