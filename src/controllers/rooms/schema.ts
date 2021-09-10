import Joi from "joi"

export const createRoomInput = Joi.object({
  name: Joi.string().min(6).required(),
})
