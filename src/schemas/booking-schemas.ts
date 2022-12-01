import Joi from "joi";

export const createorUpdateBookingSchema = Joi.object({
  roomId: Joi.number().required(),
});
