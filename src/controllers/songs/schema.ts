import Joi from "joi"

export const extractParam = Joi.object({
  room_id: Joi.string(),
  perPage: Joi.number().required(),
  page: Joi.number().required()
})
