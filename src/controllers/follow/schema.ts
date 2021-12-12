import Joi from "joi"

export const getFollowersInput = Joi.object({
  perPage: Joi.number().max(50).required(),
  page: Joi.number().required()
})

export const postFollowersInput = Joi.object({
    userId: Joi.string().required()
  })
  