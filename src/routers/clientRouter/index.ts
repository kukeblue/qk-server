
import {TResponse, TTask, TTaskLog, TTaskStatus} from "../../typing";
// @ts-ignore
import express, {Request, Response} from "express";
import { TAddTaskLogRequest } from "../taskLogRouter/typing";
import { taskLogDao } from "../../dao/taskLogDao";
import { taskDao } from "../../dao/taskDao";
import { gameAccountDao } from "../../dao/gameAccountDao";
import { deviceDao } from "../../dao/deviceDao";
import { TGetStartTaskRequest, TGetStartTaskResponse, TStartTaskRequest } from "../taskRouter/typing";
import {asyncHandler} from "../../utils/errerHandle";
import moment from "moment";
import config from "../../config";
import { gameRoleDao } from "../../dao/gameRoleDao";
const router = express.Router()


router.post('/add_task_log', async function (req: Request<{ReqBody: TAddTaskLogRequest}>, res:Response<TResponse<TTaskLog>>) {
    const taskNo = req.body.taskNo
    const task = await taskDao.getTaskByTaskNo(taskNo)
    const taskLog: TTaskLog = await taskLogDao.createTaskLog({userId: task.userId, ...req.body})
    if(taskLog) {
        if(taskLog.taskName == "主线挖图") {
            const type = taskLog.type
            const note = taskLog.note
            if(type == 'info' && note == '准备完毕') {
                await taskDao.updateTaskByTaskNo(taskLog.taskNo, {
                    status: '启动中'
                })
            }
            if(type == 'info' && note == '开始挖图') {
                console.log('开始挖图', taskLog.taskNo, taskLog.deviceId)
                await taskDao.updateTaskByTaskNo(taskLog.taskNo, {
                    status: '进行中'
                })
            }
        }
        
        return res.json({
            status: 0,
            data: taskLog,
        })
    }
    return res.json({
        status: -1
    })
})

export type TClinetStartTaskRequest = {
    deviceId?: number,
    name: string,
    status?: TTaskStatus,
    imei?: string,
    userId?: number,
    gameServer?: string
}

router.post('/get_one_task',
    asyncHandler(async function (req:Request<any, any, TClinetStartTaskRequest>, res: Response<TResponse<TGetStartTaskResponse>> ) {
        const {imei, ...data} = req.body
        console.log('imei', imei)
        if(imei) {
            const ret = await deviceDao.getDeviceByQuery({imei: imei})
            if(ret) {
                data.userId = ret.userId
            }else {
                res.json({
                    status: 1001,
                    message:config.tips['1001']
                })
                return;
            }
        }
        if(!data.status) {
            res.json({
                status: 1001,
                message:config.tips['1001']
            })
        }
        const date = moment().format('YYYY-MM-DD')
        console.log('查询' ,data.deviceId || '全部', data.status)
        let query = {
            status: data.status,
            date,
            name:data.name,
        }
        if(data.gameServer && data.gameServer != '' && data.gameServer != '无') {
            // @ts-ignore
            query.gameServer = data.gameServer
            console.log(data.gameServer)
        }
        if(data.userId) {
            // @ts-ignore
            query.userId = data.userId
        }
        if(data.deviceId) {
            // @ts-ignore
            query.deviceId = data.deviceId
        }
        const task = await taskDao.getTaskByQuery(query)
        if(!task) {
            return res.json({
                status: 1001,
                message:config.tips['1001']
            })
        }
        const account = await gameAccountDao.getGameAccountById(task.accountId)
        if(task) {
            res.json({
                status: 0,
                data: {
                    taskName: task.name,
                    taskNo: task.taskNo,
                    accountNickName: account.nickName,
                    status: task.status,
                    deviceId: task.deviceId,
                    accountId: task.accountId,
                },
            })
        }else {
            res.json({
                status: 1001,
                message:config.tips['1001']
            })
        }
    }))

    router.post('/update_game_role_status',
    asyncHandler(async function (req:Request<any, any, {gameId: string, status: string}>, res: Response<any> ) {
        const {gameId, status} = req.body
        await gameRoleDao.updateGameRoleStatus(gameId, status)
        res.json( {status: 0})
    }))

    router.post('/get_one_free_game_role',
    asyncHandler(async function (req:Request<any, any, {gameId: string, work: string}>, res: Response<any> ) {
        const {gameId, work} = req.body
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
        const groupId = gameRole.groupId
        const targetGameRole = await gameRoleDao.getGameRoleByQuery({groupId, work, status: '空闲'})
        if(work == '挖图' || work == '接货') {
            await gameRoleDao.updateGameRoleStatus(targetGameRole.gameId, '忙碌')
        }
        if(targetGameRole) {
            res.json( {status: 0, data: targetGameRole, gameId: targetGameRole.gameId})
        }else {
            res.json( {status: -1})
        }
    }))



export default router
