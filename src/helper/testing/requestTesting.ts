import { startApp } from "../../app";


import request from 'supertest';
import { Express } from "express";
let app: Express;


export const init = async () => {
    app = await startApp()
}
enum RequestMethod {
    GET,
    POST,
    PUT,
    DELETE
}

type RouteTest = {
    route: string,
    authenticated: boolean,
    testGet?: {params?: any,body?: any,onResponse: (res: request.Response) => Promise<void>},
    testPost?: {params?: any,body?: any,onResponse: (res: request.Response) => Promise<void>},
    testDelete?: {params?: any,body?: any,onResponse: (res: request.Response) => Promise<void>},
    testPut?: {params?: any,body?: any,onResponse: (res: request.Response) => Promise<void>},
}
const paramsTOString = (params: any) => {
    let paramString = '?'
    if (!params) return ""
    Object.keys(params).forEach((key) => {
        paramString += `${key}=${params[key]}&`
    })
    return paramString
}
export const testRoute = async ({
    route,
    authenticated,
    testGet,
    testPost,
    testDelete,
    testPut,
}: RouteTest) => {
    describe("testing " + route, () => {
        testMethod(RequestMethod.GET, route, authenticated, testGet?.body, testGet?.params, testGet?.onResponse)
        testMethod(RequestMethod.POST, route, authenticated, testPost?.body, testPost?.params, testPost?.onResponse)
        testMethod(RequestMethod.PUT, route, authenticated, testPut?.body, testPut?.params, testPut?.onResponse)
        testMethod(RequestMethod.DELETE, route, authenticated, testDelete?.body, testDelete?.params, testDelete?.onResponse)
    })
}



const getData = async (method: RequestMethod, route: string, authenticated: boolean, body: any, params: any): Promise<request.Response> => {
    let resp;
    if (params) {
        route += paramsTOString(params)
    }

    switch (method) {
        case RequestMethod.GET: {
            resp = await request(app).get(route)
        }
            break;
        case RequestMethod.POST: {
            resp = await request(app).post(route).send(body)
        }
            break;
        case RequestMethod.PUT: {
            resp = await request(app).put(route).send(body)
        }
            break;
        case RequestMethod.DELETE: {
            resp = await request(app).delete(route).send(body)
        }
            break;
    }
    if (authenticated) {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6IlN1cnlhIFNha3RoaSIsImlkIjoiMzFscGZtdTNnM2M2Z3R0YnBsd3dmNHl4NG91eSIsImlhdCI6MTYzNjgxNTkzM30.KLk5vFZBMsh775yv0JJdmlIdVwCB3u2rjmcaa3wBFeE'
        if (resp && resp.statusCode !== 401)
            throw Error('Not returning 401 for unauthorized request')
        switch (method) {
            case RequestMethod.GET: {
                resp = await request(app).get(route).set("token", token)
            }
                break;
            case RequestMethod.POST: {
                resp = await request(app).post(route).send(body).set("token", token)
            }
                break;
            case RequestMethod.PUT: {
                resp = await request(app).put(route).send(body).set("token", token)
            }
                break;
            case RequestMethod.DELETE: {
                resp = await request(app).delete(route).send(body).set("token", token)
            }
                break;
        }
    }
    return resp
}


const testMethod = (method: RequestMethod, route: string, authenticated: boolean, body: any, params: any, callBack?:  (respose: request.Response) => Promise<void>) => {
    test(route + " - " + RequestMethod[method], async () => {
        const resp = await getData(method, route, authenticated, body, params)
        if (callBack) {
           await callBack(resp)
        } else {
            if (resp.statusCode !== 404) {
                throw Error(RequestMethod[method] + " should return 404 or please implement test for this method")
            }
        }
    })
}

