import bookingRepository from "@/repositories/booking-repository";
import { notFoundError } from "@/errors";
import { Booking, Room } from "@prisma/client";

async function getBooking(userId: number): Promise<getBookingResult[]> {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}
type getBookingResult = Omit<Booking, "userId" | "createdAt" | "updatedAt"> & { Room: Room[] };

const bookingService = { getBooking };

export default bookingService;
