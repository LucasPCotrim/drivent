import bookingRepository from "@/repositories/booking-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import roomsRepository from "@/repositories/rooms-repository";
import { notFoundError, forbiddenError } from "@/errors";
import { Booking, Room, TicketStatus } from "@prisma/client";

async function getBooking(userId: number): Promise<getBookingResult> {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}
type getBookingResult = Omit<Booking, "userId" | "createdAt" | "updatedAt"> & { Room: Room };

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (
    !ticket ||
    !ticket.TicketType.isRemote ||
    !ticket.TicketType.includesHotel ||
    ticket.status !== TicketStatus.PAID
  ) {
    throw forbiddenError();
  }

  const room = await roomsRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }

  const currentBookings = await bookingRepository.findBookingsByRoomId(room.id);
  if (currentBookings.length >= room.capacity) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking;
}

const bookingService = { getBooking, createBooking };

export default bookingService;
