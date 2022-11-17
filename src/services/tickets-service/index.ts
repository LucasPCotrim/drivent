import ticketsRepository from "@/repositories/tickets-repository";
import userRepository from "@/repositories/user-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError } from "@/errors";
import { Ticket, TicketType } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketsRepository.findManyTicketTypes();
  return ticketTypes;
}

async function getUserTicket(userId: number): Promise<getUserTicketResult> {
  const user = userRepository.findById(userId);
  if (!user) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket) throw notFoundError();

  return {
    ...exclude(ticket, "Enrollment"),
  };
}
type getUserTicketResult = Ticket & { TicketType: TicketType };

async function createUserTicket(userId: number, ticketTypeId: number): Promise<createUserTicketResult> {
  const user = userRepository.findById(userId);
  if (!user) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.createTicket(ticketTypeId, enrollment.id);
  return ticket;
}
type createUserTicketResult = Ticket & { TicketType: TicketType };

const ticketsService = { getTicketTypes, getUserTicket, createUserTicket };

export default ticketsService;
