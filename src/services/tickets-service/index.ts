import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError } from "@/errors";
import { Ticket, TicketType } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findManyTicketTypes();
  return ticketTypes;
}

async function getUserTicket(userId: number): Promise<getUserTicketResult> {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket) {
    throw notFoundError();
  }
  return {
    ...exclude(ticket, "Enrollment"),
  };
}
type getUserTicketResult = Ticket & { TicketType: TicketType };

const ticketsService = { getTicketTypes, getUserTicket };

export default ticketsService;
