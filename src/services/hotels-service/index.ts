import hotelsRepository from "@/repositories/hotel-repository";
import { notFoundError } from "@/errors";
import { Hotel, Room } from "@prisma/client";

async function getHotels(): Promise<Hotel[]> {
  const ticketTypes = await hotelsRepository.findManyHotels();
  return ticketTypes;
}

async function getHotelRooms(hotelId: number): Promise<Room[]> {
  const hotel = await hotelsRepository.findHotelById(hotelId);
  if (!hotel) {
    throw notFoundError();
  }

  const hotelRooms = await hotelsRepository.findHotelRooms(hotelId);
  return hotelRooms;
}

const hotelsService = { getHotels, getHotelRooms };

export default hotelsService;
