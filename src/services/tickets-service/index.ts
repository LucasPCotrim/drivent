import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findTicketTypes();
  return ticketTypes;
}

const ticketsService = { getTicketTypes };

export default ticketsService;
