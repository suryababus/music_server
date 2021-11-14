import Joi from "joi"

export const searchParams = Joi.object({
  category: Joi.string().valid('users', 'rooms').required(),
  key: Joi.string().required(),
})
