import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, createBooking } from "@/controllers/booking-controller";
import { createBookingSchema } from "./../schemas/booking-schemas";
import { validateBody } from "@/middlewares";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(createBookingSchema), createBooking);

export { bookingRouter };
