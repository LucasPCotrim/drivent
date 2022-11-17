import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findManyTicketTypes();
  return ticketTypes;
}

const ticketsService = { getTicketTypes };

export default ticketsService;
