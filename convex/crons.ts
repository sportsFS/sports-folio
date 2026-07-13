import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "release expired checkout reservations",
  { minutes: 15 },
  internal.orders.cleanupExpiredReservationsInternal,
  {},
);

export default crons;
