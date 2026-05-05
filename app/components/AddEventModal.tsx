"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { EventImportance, CalendarEvent } from "../types";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEvent | null;
}

const importances: EventImportance[] = ["ordinary", "important", "critical"];

export default function AddEventModal({
  open,
  onClose,
  eventToEdit,
}: AddEventModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<EventImportance>("ordinary");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevEvent, setPrevEvent] = useState<CalendarEvent | null | undefined>(
    undefined,
  );

  if (open !== prevOpen || eventToEdit !== prevEvent) {
    setPrevOpen(open);
    setPrevEvent(eventToEdit);

    if (open) {
      setTitle(eventToEdit?.title || "");
      setDate(eventToEdit?.date || "");
      setDescription(eventToEdit?.description || "");
      setImportance(eventToEdit?.importance || "ordinary");
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      if (eventToEdit?.id) {
        const eventRef = doc(db, "events", eventToEdit.id);
        await updateDoc(eventRef, {
          title,
          date,
          description,
          importance,
        });
        showSnackbar("Event successfully updated!", "success");
      } else {
        await addDoc(collection(db, "events"), {
          title,
          date,
          description,
          importance,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
        showSnackbar("New event created!", "success");
      }
      onClose();
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-bold">
        {eventToEdit ? "Edit event" : "Add a new event"}
      </DialogTitle>

      <form onSubmit={handleSave}>
        <DialogContent dividers className="flex flex-col gap-4">
          <TextField
            label="Name of the event"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Date and time"
            type="datetime-local"
            required
            fullWidth
            value={date}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => setDate(e.target.value)}
          />

          <TextField
            select
            label="Importance"
            required
            fullWidth
            value={importance}
            onChange={(e) => setImportance(e.target.value as EventImportance)}
          >
            {importances.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>

        <DialogActions className="p-4">
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className="bg-black text-white hover:bg-gray-800"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
