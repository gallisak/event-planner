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
import { EventImportance } from "../types";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
}

const importances: EventImportance[] = ["ordinary", "important", "critical"];

export default function AddEventModal({ open, onClose }: AddEventModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<EventImportance>("ordinary");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        description,
        importance,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      console.log("Event successfully saved to Firestore!");

      setTitle("");
      setDate("");
      setDescription("");
      setImportance("ordinary");
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-bold">Add a new event</DialogTitle>

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
            slotProps={{
              inputLabel: { shrink: true },
            }}
            value={date}
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
