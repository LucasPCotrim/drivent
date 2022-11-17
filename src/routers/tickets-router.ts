import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken).get("/types", getTicketTypes).get("/", getTicket);

export { ticketsRouter };
