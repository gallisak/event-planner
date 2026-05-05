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
} from "@mui/material";
import { EventImportance } from "../types";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
}

const importances: EventImportance[] = ["ordinary", "important", "critical"];

export default function AddEventModal({ open, onClose }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<EventImportance>("ordinary");

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("New event:", { title, date, description, importance });

    setTitle("");
    setDate("");
    setDescription("");
    setImportance("ordinary");
    onClose();
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
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="bg-black text-white hover:bg-gray-800"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
