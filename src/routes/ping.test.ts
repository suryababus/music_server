import { init, testRoute } from "../helper/testing/requestTesting"


beforeAll(async () => {
    await init()
})
testRoute({
    route: '/ping',
    authenticated: true,
    testGet: {
        onResponse: async (resp) => {
            expect(resp.statusCode === 200).toBeTruthy
            expect(resp.body.data).toContain('good')
        }
    }
})
