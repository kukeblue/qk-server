import { TAddTaskLogRequest } from './typing'
import {taskLogDao} from "../../dao/taskLogDao";
import {TResponse, TTask, TTaskLog} from "../../typing";
// @ts-ignore
import express, {Request, Response} from "express";
import prisma from "../../../prisma";
import {taskDao} from "../../dao/taskDao";
import {deviceDao} from "../../dao/deviceDao";
import {gameAccountDao} from "../../dao/gameAccountDao";
const router = express.Router()

router.post('/get_logs', async function (req: Request<{}>, res:Response<any>) {
    res.json({a:1})
})

router.post('/add_task_log', async function (req: Request<{ReqBody: TAddTaskLogRequest}>, res:Response<TResponse<TTaskLog>>) {
    const taskLog: TTaskLog = await taskLogDao.createTaskLog(req.body)
    if(taskLog) {
        const type = taskLog.type
        switch (type) {
            case 'launch':
                await taskDao.updateTaskByTaskNo(taskLog.taskNo, {
                    status: '进行中'
                })
                break
            case 'finish':
                await gameAccountDao.updateGameAccount(taskLog.accountId, {
                    online: '离线'
                })
                await deviceDao.updateDeviceById(taskLog.deviceId, {
                    status: '空闲'
                })
                await taskDao.updateTaskByTaskNo(taskLog.taskNo, {
                    status: '完成'
                })
                break
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

router.post('/get_task_log_page', async function (req:Request, res: Response<TResponse<TTaskLog>> ) {
    const {pageSize, pageNo, query} = req.body
    const pagination = await taskLogDao.getTaskLogPage(pageNo, pageSize, query)
    return res.json({
        status: 0,
        page: pagination
    })
})


export default router
