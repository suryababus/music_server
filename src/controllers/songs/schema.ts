import Joi from "joi"

export const getLikedSongsInput = Joi.object({
  roomId: Joi.string(),
  perPage: Joi.number().max(50).required(),
  page: Joi.number().required()
})
