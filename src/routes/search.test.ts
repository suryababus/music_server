import { init, testRoute } from "../helper/testing/requestTesting"
import Joi from "joi"


beforeAll(async () => {
    await init()
})


const userSearchResponse = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    song_spotify_uri: Joi.string().required(),
    song_spotify_image: Joi.string().required(),
    created_time: Joi.string().required(),
    modified_time: Joi.string().required()
})



testRoute({
    route: '/search',
    authenticated: true,

    testGet: {
        params: {
            category: "rooms",
            key: "su"
        },
        onResponse: async (resp) => {
            const data = resp.body.data
            expect(data.length).toBe(1)
            for (const index in data) {
                const element = data[index]
                await userSearchResponse.validateAsync(element)
            }
            expect(resp.statusCode === 200).toBeTruthy
        }
    }
})
