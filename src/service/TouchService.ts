// @ts-ignore
import schedule from "node-schedule";
import axios, {Axios} from "axios";
import {hamibotAxios} from "../request";
import {IFetchRobotsResponse} from "./HamibotService";
import {strict} from "assert";
const request = require("request");

export const touchAxios: Axios = axios.create({
    timeout: 3000
});

type TAuth  = {
    touchId: string,
    auth: string,
    client: string[]

}

const auths = [
    {
        // 我的号
        touchId: 'J7zh1MyMmYe30NB4Br0hxs0MwI2UWdiBGOTRXTx9mbxUzjLLy6PoCmTw2cVlFBiC',
        auth: '',
        client: [
            'e575a1b93bb91a364aa1a9050390e5df',
            'beec71e2c344e5437dba53cd4c4dad335'
        ],
    },
    {
        // 黄琪的号
        touchId: 'wsE2QJV8iSI2KxklKy1sKl3D7HDcvd0TgiOlomD2xf9JpjyClrrC6ZOO8bVW2JD2',
        auth: '',
        client: [
            'beec71e2c344e5437dba53cd4c4dad335',
            '0bf938be64f50702c13d75af7404a0704'
        ],
    }
]

const getTouchAuths = function () {
    auths.forEach(item=>{
        getTouchAuth(item)
    })
}

const getTouchAuth = function (auth: TAuth) {
    const options = { method: 'POST',
        url: 'https://openapi.touchsprite.com/api/openapi',
        headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/json' },
        body:
            { action: 'getAuth',
                key: auth.touchId,
                devices: auth.client,
                valid: 3600,
                time: Number.parseInt((new Date().getTime() / 1000).toFixed(0)) },
        json: true };

    request(options, function (error:any, response:any, body: any) {
        if (error) throw new Error(error);
        auth.auth = body.auth
    });
}

const runScript = async function (ip: string, key: string) {
    const auth = auths.find(item=>item.touchId == key)
    if(!auth) {
        throw new Error("no runScript auth")
    }
    try{
        const res = await touchAxios.get<string>(`http://${ip}:50005/runLua`, {
            headers: {
                'auth': auth.auth,
            }
        })
        if(res.data == 'ok') {
            return true
        }
    }catch (e) {
        console.log('error: 远程脚本运行失败')
    }
}

const stopScript = async function (ip: string, key: string) {
    const auth = auths.find(item=>item.touchId == key)
    if(!auth) {
        throw new Error("no runScript auth")
    }
    try{
        const res = await touchAxios.get<string>(`http://${ip}:50005/stopLua`, {
            headers: {
                'auth': auth.auth,
            }
        })
        if(res.data == 'ok') {
            return true
        }
    }catch (e) {
        console.log('error: 远程脚本停止失败')
    }
}

export const initTouchService = function () {
    getTouchAuths()
    schedule.scheduleJob('0 */45 * * *', async () => {
        getTouchAuths()
    })
    console.log('log info initTouchService ....')
}

export const touchService = {
    initTouchService,
    runScript,
    stopScript
}

export default touchService
