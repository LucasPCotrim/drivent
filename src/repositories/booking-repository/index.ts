import { prisma } from "@/config";

async function findBookingByUserId(id: number) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      Room: true,
    },
  });
}

const bookingRepository = { findBookingByUserId };

export default bookingRepository;
