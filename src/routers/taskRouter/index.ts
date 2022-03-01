import {Request, Response} from "express";
import prisma from "../../../prisma";
import {TaskLogType, TResponse, TTask, TTaskStatus} from "../../typing";
import hamibotService, {taskScriptMap} from "../../service/HamibotService";
import {body, validationResult} from "express-validator";
// @ts-ignore
import moment from "moment"
import {
    TCreateTaskQuery,
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
const express = require('express')
const router = express.Router()

// router.ws('/', function(ws, req) {
//     ws.on('message', function(msg) {
//         ws.send(msg);
//     });
// });

router.post('/stop_task',
    asyncHandler(async function (req:Request<any, any, TStopTaskRequest>, res: Response<TResponse<TTask>> ) {
        const data = req.body
        let task:TTask = await taskDao.getTaskById(data.id)
        const device = await deviceDao.getDeviceById(data.deviceId)
        await deviceDao.updateDeviceById(device.id, {status: '空闲'})
        task = await taskDao.updateTaskById(data.id, {
            status: '停止'
        })
        const result = await touchService.stopScript(device.ip!, device.touchId!)
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
    asyncHandler(async function (req:Request<any, any, TGetStartTaskRequest>, res: Response<TResponse<TGetStartTaskResponse>> ) {
        const data = req.body
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
            const result = await touchService.runScript(device.ip!, device.touchId!)
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
    async function (req:Request<any, any, TCreateTaskQuery>, res: Response<TResponse<TTask>> ) {
        const body = req.body
        const date = moment().format('YYYY-MM-DD')
        const date2 = moment().format('YYYYMMDD')
        const data:TTask = {
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
            realIncome: 0
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

router.post('/get_task_page', async function (req:Request<{}>, res: Response<TResponse<TTask>> ) {
    const {pageSize, pageNo, query} = req.body
    const page = await taskDao.getTaskPage(pageNo, pageSize, query)
    res.json({
        status: 0,
        page
    })
})

router.post('/delete_task_by_id', async function (req:Request<{id: number}>, res: Response<TResponse<TTask>> ) {
    const page = await taskDao.deleteTaskById(req.body.id)
    res.json({
        status: 0,
    })
})


export default router
