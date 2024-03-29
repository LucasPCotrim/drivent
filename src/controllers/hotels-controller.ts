import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "ForbiddenError") return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === "PaymentRequiredError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);
  if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const hotelRooms = await hotelsService.getHotelRooms(userId, hotelId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    if (error.name === "ForbiddenError") return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === "PaymentRequiredError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
