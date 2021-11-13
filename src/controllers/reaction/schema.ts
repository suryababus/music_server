import Joi from "joi"

export const validateAction = Joi.object({
    action: Joi.string().valid('like', 'dislike', 'none').required(),
})