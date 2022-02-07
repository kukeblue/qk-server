import {Request, Response} from "express";
import prisma from "../../prisma";
import {TResponse} from "../typing";
import hamibotService from "../service/HamibotService";
import {body, validationResult} from "express-validator";
const express = require('express')
const router = express.Router()


type TTask = {
    id: number,
    name: string,
    startTime: Date,
    endTime: Date,
    status: string,
    note: string,
}

router.post('/add_task',
    async function (req:Request, res: Response<TResponse<TTask>> ) {
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
