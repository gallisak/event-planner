"use client";

import { CalendarEvent } from "../types";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

interface EventListProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
}

export default function EventList({ events, onEdit }: EventListProps) {
  const handleDelete = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (events.length === 0) {
    return (
      <Box className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-75 flex items-center justify-center">
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
                  color={getImportanceColor(event.importance)}
                  size="small"
                  className="capitalize mt-1"
                />
              </Box>

              <Box>
                <IconButton
                  onClick={() => onEdit(event)}
                  color="primary"
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(event.id!)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
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
