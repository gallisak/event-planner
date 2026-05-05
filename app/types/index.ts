export type EventImportance = "ordinary" | "important" | "critical";

export interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  description: string;
  importance: EventImportance;
  userId: string;
  createdAt?: string;
}
