import Joi from "joi"

export const LoginInput = Joi.object({
  token: Joi.string().required(),
})
