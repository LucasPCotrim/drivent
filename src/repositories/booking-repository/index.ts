import { prisma } from "@/config";

async function findBookingById(id: number) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      Room: true,
    },
  });
}

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

async function updateBooking(id: number, newRoomId: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId: newRoomId,
    },
  });
}

const bookingRepository = {
  findBookingById,
  findBookingByUserId,
  findBookingsByRoomId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
