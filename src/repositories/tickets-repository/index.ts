import { prisma } from "@/config";

async function findManyTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findManyTickets() {
  return prisma.ticket.findMany();
}

const ticketsRepository = {
  findManyTicketTypes,
  findManyTickets,
};

export default ticketsRepository;
