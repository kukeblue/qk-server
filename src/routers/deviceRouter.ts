import {Request, Response} from "express";
import prisma from "../../prisma";
import {TResponse, TDevice, TUser} from "../typing";
import hamibotService from "../service/HamibotService";
import {body, validationResult} from "express-validator";
import {deviceDao} from "../dao/deviceDao";
const express = require('express')
const router = express.Router()

router.post('/delete_device', async function (req: Request<{id: string}>, res:Response<any>) {
    await deviceDao.deleteById(req.body.id)
    return res.json({status:0})
})

router.post('/save_device',
    body('name').isString(),
    body('deviceType').isString(),
    body('brand').isString(),
    body('robotName').isString(),
    body('robotId').isString(),
    body('imei').isString(),
    body('ip').isString(),
    body('touchId').isString(),
    body('status').isString(),
    async function (req:Request<any, any, TDevice> & {loginUser: TUser}, res: Response<TResponse<TDevice>> ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status: -1, error: errors.array()});
        }
        const {id, ...data} = req.body
        let device = null
        if(id) {
            device = await prisma.device.update({
                where: {
                    id,
                },
                data,
            })
        }else {
            const newDevice = {
                ...data,
                userId: req.loginUser.id
            }
            device = await prisma.device.create({data: newDevice})
        }
        const ret:TResponse<TDevice> = {data: device, status: 0}
        res.json(ret)
    })

router.post('/get_device_page', async function (req:Request<{id: number}> & {loginUser: TUser}, res: Response<TResponse<TDevice>> ) {
    const {pageSize, pageNo, query} = req.body
    query.userId = req.loginUser.id
    const count = await prisma.device.count({where: query})
    const list:TDevice[] = await prisma.device.findMany({
        skip: (pageNo-1) * pageSize,
        take: pageSize,
        where: query,
    })
    // list.forEach(item=>{
    //     const robot = hamibotService.robots.find(robot=>robot._id == item.robotId)
    //     if(robot) {
    //         item.online = robot.online
    //     }
    // })
    res.json({
        status: 0,
        page: {
            total: count,
            list
        }
    })
})

router.post('/get_device_list', async function (req:Request<{id: number}> & {loginUser: TUser}, res: Response<TResponse<TDevice>> ) {
    const list:TDevice[] = await prisma.device.findMany({
       where: { userId: req.loginUser.id }
    })
    res.json({
        status: 0,
        list,
    })
})

export default router
