import {Request, Response} from "express";
import prisma from "../../../prisma";
import {TaskLogType, TResponse, TTask, TTaskLog, TTaskStatus, TUser} from "../../typing";
import hamibotService, {taskScriptMap} from "../../service/HamibotService";
import {body, validationResult} from "express-validator";
// @ts-ignore
import moment from "moment"
import {
    TCreateTaskQuery, TEditTaskRequest,
    TGetStartTaskRequest,
    TGetStartTaskResponse,
    TStartTaskRequest,
    TStopTaskRequest
} from "./typing";
import {taskDao} from "../../dao/taskDao";
import {deviceDao} from "../../dao/deviceDao";
import config, {tips} from "../../config";
import {gameAccountDao} from "../../dao/gameAccountDao";
import touchService from "../../service/TouchService";
import {taskLogDao} from "../../dao/taskLogDao";
import {asyncTaskCount} from "../../timer";
import {asyncHandler} from "../../utils/errerHandle";
import { TAddTaskLogRequest } from "../taskLogRouter/typing";
const express = require('express')
const router = express.Router()

router.post('/stop_task',
    asyncHandler(async function (req:Request<any, any, TStopTaskRequest>, res: Response<TResponse<TTask>> ) {
        const data = req.body
        let task:TTask = await taskDao.getTaskById(data.id)
        const device = await deviceDao.getDeviceById(data.deviceId)
        await deviceDao.updateDeviceById(device.id, {status: '空闲'})
        task = await taskDao.updateTaskById(data.id, {
            status: '停止'
        })
        touchService.stopScript(device.ip!, device.touchId!)
        const gameAccount = await gameAccountDao.getGameAccountById(task.accountId)
        await taskLogDao.createTaskLog({
            imei: device.imei,
            nickName: gameAccount.nickName,
            taskNo: task.taskNo,
            deviceId: task.deviceId,
            accountId: task.accountId,
            taskName: task.name,
            note:  "后台中止",
            type: "warn",
            time: Number.parseInt((new Date().getTime() / 1000).toFixed(0)),
        })
        res.json({
            status: 0,
            data: task
        })
    }))

router.post('/get_start_task',
    asyncHandler(async function (req:Request<any, any, TGetStartTaskRequest> & {loginUser: TUser}, res: Response<TResponse<TGetStartTaskResponse>> ) {
        const data = req.body
        const user: TUser = req.loginUser
        const device = await deviceDao.getDeviceByQuery({
            imei: data.imei
        })
        const date = moment().format('YYYY-MM-DD')
        const task = await taskDao.getTaskByQuery({
            deviceId: device.id,
            status: '启动中',
            date,
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

router.post('/start_task',
    async function (req:Request<any, any, TStartTaskRequest>, res: Response<TResponse<TTask>> ) {
            const data = req.body
            let task:TTask = await taskDao.getTaskById(data.id)
            const device = await deviceDao.getDeviceById(data.deviceId)
            if(device.status === '空闲') {
                await taskDao.updateTaskById(data.id, {
                    status: '启动中'
                })
                touchService.runScript(device.ip!, device.touchId!)
                await gameAccountDao.updateGameAccount(task.accountId, {online: '在线'})
                await deviceDao.updateDeviceById(device.id, {status: '任务中'})
                res.json({
                    status: 0,
                    data: task
                })
            }else {
                res.json({
                    status: -1,
                    message: '机器正在运行其他任务'
                })
            }
    })

router.get('/calculate_income',
    async function (req:Request, res: Response ) {
        await asyncTaskCount()
        res.json({
            status: 0,
        })
    })

router.post('/create_task',
    async function (req:Request<any, any, TCreateTaskQuery> & {loginUser: TUser}, res: Response<TResponse<TTask>> ) {
        const body = req.body
        const date = moment().format('YYYY-MM-DD')
        const date2 = moment().format('YYYYMMDD')
        const data:TTask = {
            userId: req.loginUser.id!,
            date,
            name: body.name,
            startTime: 0,
            updateTime: 0,
            endTime: 0,
            status: '初始化',  // 初始化 启动中 进行中 报障 暂停  完成
            note: '',
            taskNo: `${date2}${body.deviceId}${body.accountId}`,
            deviceId: body.deviceId,
            accountId: body.accountId,
            income: 0,
            realIncome: 0,
            taskCount: 0,
            gameServer: '',
        }
        const task = await taskDao.createTask(data)
        if(task) {
            return res.json({
                data,
                status: 0
            })
        }else {
            res.json({
                status: 1002,
                message: tips["1002"]
            })
        }
    })

router.post('/get_task_page', async function (req:Request<{}> & {loginUser: TUser}, res: Response<TResponse<TTask>> ) {
    const {pageSize, pageNo, query} = req.body
    query.userId = req.loginUser.id
    const page = await taskDao.getTaskPage(pageNo, pageSize, query)
    res.json({
        status: 0,
        page
    })
})

router.post('/task_lock',
    async function (req:Request<{}> & {loginUser: TUser}, res: Response<TResponse<any>> ) {
        res.json({
            status: 0,
        })
    })

router.post('/delete_task_by_id', async function (req:Request<{id: number}>, res: Response<TResponse<TTask>> ) {
    const page = await taskDao.deleteTaskById(req.body.id)
    res.json({
        status: 0,
    })
})

router.post('/edit_task', async function (req:Request<TEditTaskRequest> , res: Response<TResponse<Boolean>> ) {
    const {id, ...data}  = req.body
    await taskDao.updateTaskById(id, data)
    res.json({
        status: 0,
    })
})

router.post('/add_task_watu_log', async function (req: Request<{ReqBody: {accountId: number}}> & {loginUser: TUser}, res:Response<TResponse<TTaskLog>>) {
    const taskLog: TTaskLog = await taskLogDao.createTaskLog({ 
        imei: req.loginUser.id + '',
        nickName: '',
        taskNo: '',
        deviceId: 0,
        accountId: req.loginUser.id!,
        taskName: '挖图15张',
        taskCount: 15,
        note:  '挖图15张',
        type: 'info',
        time: Math.floor(new Date().getTime() / 1000),
        userId: req.loginUser.id,
    })
    if(taskLog) {
        return res.json({
            status: 0,
            data: taskLog,
        })
    }else {
        return res.json({
            status: -1
        })
    }
})



export default router
