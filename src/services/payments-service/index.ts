import paymentsRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { Payment } from "@prisma/client";

async function getPaymentByTicketId(userId: number, ticketId: number): Promise<Payment> {
  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.Enrollment.User.id !== userId) {
    throw unauthorizedError();
  }

  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);
  if (!notFoundError) throw notFoundError();
  return payment;
}

const paymentsService = { getPaymentByTicketId };

export default paymentsService;
