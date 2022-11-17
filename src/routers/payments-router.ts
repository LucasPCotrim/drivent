import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPayment } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken).get("/", getPayment);

export { paymentsRouter };
