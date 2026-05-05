// src/components/CalendarView.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEvent } from "../types";
import { Box, Paper } from "@mui/material";

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (dateStr: string) => void; // ДОДАЛИ НОВИЙ ПРОПС
}

export default function CalendarView({
  events,
  onEventClick,
  onDateClick,
}: CalendarViewProps) {
  const calendarEvents = events.map((evt) => ({
    id: evt.id,
    title: evt.title,
    start: evt.date,
    backgroundColor:
      evt.importance === "critical"
        ? "#ef4444"
        : evt.importance === "important"
          ? "#f59e0b"
          : "#3b82f6",
    borderColor: "transparent",
    extendedProps: { ...evt },
  }));

  return (
    <Paper className="p-4 rounded-xl shadow-sm border border-gray-200 bg-white">
      <Box
        sx={{
          "& .fc-toolbar-title": { fontSize: "1.25rem", fontWeight: "bold" },
          "& .fc-button-primary": {
            backgroundColor: "#000 !important",
            borderColor: "#000 !important",
          },
          "& .fc-event": { cursor: "pointer", transition: "opacity 0.2s" },
          "& .fc-event:hover": { opacity: 0.8 },

          "& .fc-daygrid-day-frame, & .fc-timegrid-slot": {
            cursor: "pointer",
            transition: "background-color 0.2s",
          },
          "& .fc-daygrid-day-frame:hover, & .fc-timegrid-slot:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.03)",
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          eventClick={(info) =>
            onEventClick(info.event.extendedProps as CalendarEvent)
          }
          dateClick={(info) => onDateClick(info.dateStr)}
          height="70vh"
        />
      </Box>
    </Paper>
  );
}
