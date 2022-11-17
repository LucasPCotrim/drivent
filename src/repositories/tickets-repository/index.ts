import { User } from "@prisma/client";
import { prisma } from "@/config";

async function findManyTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketByUserId(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        User: {
          id: userId,
        },
      },
    },
    include: {
      TicketType: true,
      Enrollment: {
        include: {
          User: true,
        },
      },
    },
  });
}

const ticketsRepository = {
  findManyTicketTypes,
  findTicketByUserId,
};

export default ticketsRepository;
