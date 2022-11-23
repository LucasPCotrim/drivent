import hotelsRepository from "@/repositories/hotel-repository";
import { Hotel } from "@prisma/client";

async function getHotels(): Promise<Hotel[]> {
  const ticketTypes = await hotelsRepository.findManyHotels();
  return ticketTypes;
}

const hotelsService = { getHotels };

export default hotelsService;
