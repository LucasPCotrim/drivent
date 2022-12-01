import bookingRepository from "@/repositories/booking-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import roomsRepository from "@/repositories/rooms-repository";
import { notFoundError, forbiddenError } from "@/errors";
import { Booking, Room, TicketStatus } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";

async function getBooking(userId: number): Promise<getBookingResult> {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return {
    ...exclude(booking, "createdAt", "updatedAt", "userId", "roomId"),
    Room: { ...exclude(booking.Room, "createdAt", "updatedAt") },
  };
}
type getBookingResult = Omit<Booking, "userId" | "roomId" | "createdAt" | "updatedAt"> & {
  Room: Omit<Room, "createdAt" | "updatedAt">;
};

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (
    !ticket ||
    ticket.TicketType.isRemote ||
    !ticket.TicketType.includesHotel ||
    ticket.status !== TicketStatus.PAID
  ) {
    throw forbiddenError();
  }

  const room = await roomsRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const currentUserBooking = await bookingRepository.findBookingByUserId(userId);
  if (currentUserBooking) throw forbiddenError();

  const currentRoomBookings = await bookingRepository.findBookingsByRoomId(room.id);
  if (currentRoomBookings.length >= room.capacity) throw forbiddenError();

  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking;
}

async function updateBooking(userId: number, newRoomId: number, bookingId: number): Promise<Booking> {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (
    !ticket ||
    ticket.TicketType.isRemote ||
    !ticket.TicketType.includesHotel ||
    ticket.status !== TicketStatus.PAID
  ) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) throw notFoundError();

  const newRoom = await roomsRepository.findRoomById(newRoomId);
  if (!newRoom) throw notFoundError();

  if (booking.Room.id === newRoom.id) throw forbiddenError();

  const currentBookings = await bookingRepository.findBookingsByRoomId(newRoom.id);
  if (currentBookings.length >= newRoom.capacity) throw forbiddenError();

  await bookingRepository.updateBooking(booking.id, newRoom.id);
  return booking;
}

const bookingService = { getBooking, createBooking, updateBooking };

export default bookingService;
