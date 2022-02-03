import {hamibotAxios} from "../request";
import schedule from "node-schedule";

export interface IFetchRobotsResponse {
    count: number,
    items: IRobot[],
}

export interface IFetchScriptsResponse {
    count: number,
    items: IScript[],
}

export interface IScript {
    _id: string,
    slug: string,
    name: string,
    version: string
}

export interface IRobot {
    _id: string,
    online: boolean,
    tags: string[],
    name: "零号机",
    brand: string,
    model: string
}

class HamibotService {
    scripts: IScript[] = []
    robots:  IRobot[] = []

    constructor() {
       this.init().then(res=>{
           console.log('HamibotService start ....')
       })
    }

     async init() {
         await this.getRobots()
         await this.getScripts()
         // schedule.scheduleJob('0 30 7 * * *', () => {
         //     this.getRobots()
         //     this.getScripts()
         // });
    }

    async getScripts() {
        const res = await hamibotAxios.get<IFetchScriptsResponse>('/v1/scripts')
        if(res.data && res.data.items) {
            this.scripts = res.data.items
        }
    }

    async getRobots() {
        const res = await hamibotAxios.get<IFetchRobotsResponse>('/v1/robots')
        if(res.data && res.data.items) {
            this.robots = res.data.items
        }
    }

    async runScript(scriptId: string, robot: IRobot) {
        console.log(robot.name + ': 开始执行脚本 scriptId: ' + scriptId)
        try {
            await hamibotAxios.post(`/v1/scripts/${scriptId}/run`, {
                "robots": [{
                    "name": robot.name,
                    "_id": robot._id
                }]
            })
        }catch(e){
            console.log('error: HamibotService runScript fail', e)
        }
    }
}

const hamibotService = new HamibotService()
export default hamibotService
