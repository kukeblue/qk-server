import {Request, Response} from "express";
import prisma from "../../../prisma";
import {TResponse, TTask, TTaskStatus} from "../../typing";
import hamibotService from "../../service/HamibotService";
import {body, validationResult} from "express-validator";
// @ts-ignore
import moment from "moment"
import {TGetStartTaskRequest, TGetStartTaskResponse, TStartTaskRequest} from "./typing";
import {taskDao} from "../../dao/taskDao";
import {deviceDao} from "../../dao/deviceDao";
import config, {tips} from "../../config";
import {gameAccountDao} from "../../dao/gameAccountDao";
const express = require('express')
const router = express.Router()

router.post('/get_start_task',
    async function (req:Request<any, any, TGetStartTaskRequest>, res: Response<TResponse<TGetStartTaskResponse>> ) {
        const data = req.body
        const device = await deviceDao.getDeviceByQuery({
            imei: data.imei
        })
        const task = await taskDao.getTaskByQuery({
            name: data.taskName,
            deviceId: device.id,
            status: '启动中'
        })
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
    })

router.post('/start_task',
    async function (req:Request<any, any, TStartTaskRequest>, res: Response<TResponse<TTask>> ) {
        const data = req.body
        const task = await taskDao.updateTaskById(data.id, {
            status: '启动中'
        })
        await deviceDao.updateDeviceById(data.deviceId, {
            status: '任务中'
        })
        res.json({
            status: 0,
            data: task
        })
    })

router.post('/get_ready_task',
    async function (req:Request, res: Response ) {
        const data = req.body
        const imei = data.imei
        const taskName = data.taskName
        if(imei) {
            const device = await prisma.device.findFirst({
                where: {
                    imei,
                },
            })
            const task = await prisma.task.findFirst({
                where: {
                    name: taskName,
                    deviceId: device.id,
                    status: "初始化"
                },
            })
            if(!task) {
                res.json({
                    status: -1
                })
                return
            }
            const account = await prisma.gameAccount.findFirst({
                where: {
                    id: task.accountId,
                },
            })
            res.json({
                status: 0,
                data: {
                    nickName: account.nickName,
                    taskNo: task.taskNo
                }
            })

        }else {
            res.json({
                status: -1
            })
        }
    })

router.post('/create_task',
    async function (req:Request<any, any, TTask>, res: Response<TResponse<TTask>> ) {
        const data = req.body
        data.taskNo = moment().format('YYYYMMDD') + data.deviceId + data.accountId
        data.status = "初始化"
        data.startTime = 0
        data.endTime = 0
        data.updateTime = 0
        data.note = ''
        const task = await prisma.task.create({
            data,
        })
        const ret:TResponse<TTask> = {data: task, status: 0}
        res.json(ret)
    })

router.post('/add_task',
    async function (req:Request<any, any, TTask>, res: Response<TResponse<TTask>> ) {
        const {id, ...data} = req.body
        let task = null
        if(id) {
            task = await prisma.task.update({
                where: {
                    id,
                },
                data,
            })
        }else {
            task = await prisma.task.create({
                data,
            })
        }
        const ret:TResponse<TTask> = {data: task, status: 0}
        res.json(ret)
    })

router.post('/get_task_page', async function (req:Request<{id: number}>, res: Response<TResponse<TTask>> ) {
    const {pageSize, pageNo, query} = req.body
    const count = await prisma.task.count({where: query})
    const list:TTask[] = await prisma.task.findMany({
        skip: (pageNo-1) * pageSize,
        take: pageSize,
        where: query,
    })
    res.json({
        status: 0,
        page: {
            total: count,
            list
        }
    })
})

export default router
