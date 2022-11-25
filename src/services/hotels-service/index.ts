import hotelsRepository from "@/repositories/hotel-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { notFoundError, forbiddenError, paymentRequiredError } from "@/errors";
import { Hotel, Room } from "@prisma/client";

async function getHotels(userId: number): Promise<Hotel[]> {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
  if (ticket.status !== "PAID") {
    throw paymentRequiredError();
  }
  const ticketTypes = await hotelsRepository.findManyHotels();
  return ticketTypes;
}

async function getHotelRooms(userId: number, hotelId: number): Promise<Room[]> {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
  if (ticket.status !== "PAID") {
    throw paymentRequiredError();
  }
  const hotel = await hotelsRepository.findHotelById(hotelId);
  if (!hotel) {
    throw notFoundError();
  }

  const hotelRooms = await hotelsRepository.findHotelRooms(hotelId);
  return hotelRooms;
}

const hotelsService = { getHotels, getHotelRooms };

export default hotelsService;
