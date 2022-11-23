import paymentsRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { Payment } from "@prisma/client";
import { CardData } from "./../../protocols";

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

async function processPayment(userId: number, ticketId: number, cardData: CardData): Promise<Payment> {
  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.Enrollment.User.id !== userId) {
    throw unauthorizedError();
  }

  const createPaymentParams = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: String(cardData.number).slice(-4),
  };
  const payment = await paymentsRepository.createPayment(createPaymentParams);
  await ticketsRepository.setTicketAsPaid(ticketId);

  return payment;
}

const paymentsService = { getPaymentByTicketId, processPayment };

export default paymentsService;
