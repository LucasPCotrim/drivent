import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(data: CreatePaymentParams) {
  return prisma.payment.create({ data });
}
export type CreatePaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">;

const paymentsRepository = { findPaymentByTicketId, createPayment };

export default paymentsRepository;
