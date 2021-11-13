import Joi from "joi"

export const createRoomInput = Joi.object({
  name: Joi.string().required(),
  language: Joi.string().required(),
  song_spotify_uri: Joi.string().required(),
  song_spotify_image: Joi.string().required(),
})
export const createSongsInput = Joi.object({
  spotify_id: Joi.string().required(),
  spotify_uri: Joi.string().required(),
  name: Joi.string().required(),
  artist_id: Joi.string().required(),
  artist_name: Joi.string().required(),
  image_url_large: Joi.string().required(),
  image_url_medium: Joi.string().required(),
  image_url_small: Joi.string().required(),
  duration_ms: Joi.string().required(),
})
