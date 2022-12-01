import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, createBooking, updateBooking } from "@/controllers/booking-controller";
import { createorUpdateBookingSchema } from "./../schemas/booking-schemas";
import { validateBody } from "@/middlewares";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", validateBody(createorUpdateBookingSchema), createBooking)
  .put("/:bookingId", validateBody(createorUpdateBookingSchema), updateBooking);

export { bookingRouter };
