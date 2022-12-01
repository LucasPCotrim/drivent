import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findUnique({
    where: {
      id: userId,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepository = { findBookingByUserId, findBookingsByRoomId, createBooking };

export default bookingRepository;
