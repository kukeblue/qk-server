
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
const router = express.Router()


router.post('/add_task_log', async function (req: Request<{ReqBody: TAddTaskLogRequest}>, res:Response<TResponse<TTaskLog>>) {
    const taskLog: TTaskLog = await taskLogDao.createTaskLog({userId: 0, ...req.body})
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
    deviceId: number,
    name: string,
    status?: TTaskStatus,
}

router.post('/get_one_task',
    asyncHandler(async function (req:Request<any, any, TClinetStartTaskRequest>, res: Response<TResponse<TGetStartTaskResponse>> ) {
        const data = req.body
        const date = moment().format('YYYY-MM-DD')
        const task = await taskDao.getTaskByQuery({
            deviceId: data.deviceId,
            status: data.status,
            date,
            name:data.name,
        })
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


export default router
