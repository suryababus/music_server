import Joi from "joi"

export const createRoomInput = Joi.object({
  name: Joi.string().min(6).required(),
  language: Joi.string().min(6)
})
export const createSongsInput = Joi.object({
  name: Joi.string().min(6).required(),
  spotify_url: Joi.string().min(6).required()
})
