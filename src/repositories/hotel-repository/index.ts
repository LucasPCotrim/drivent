import { prisma } from "@/config";

async function findManyHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(id: number) {
  return prisma.hotel.findUnique({ where: { id } });
}

async function findHotelRooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

const hotelsRepository = {
  findManyHotels,
  findHotelById,
  findHotelRooms,
};

export default hotelsRepository;
