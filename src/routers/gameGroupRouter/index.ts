import {Request, Response} from "express";
import prisma from "../../../prisma";
import {TResponse, TDevice, TUser, TGameGroup} from "../../typing";
import {body, validationResult} from "express-validator";
import { gameGroupDao } from "../../dao/gameGroupDao";
import { TCreateGameGroup } from "./index.type";
import config from "../../config";
import { vipCardDao } from "../../dao/vipCardDao";
const express = require('express')
const router = express.Router()

router.post('/add_game_group', async function (req:Request<any, any, TCreateGameGroup> & {loginUser: TUser}, res:Response<any>) {
    const body = req.body
    if(!body.userId) {
        // @ts-ignore
        body.userId = req.loginUser.id
    }
    const gameGroup = await gameGroupDao.saveGameGroup(body)
    if(gameGroup) {
        return res.json({
            status: 0
        })
    }else {
        res.json({
            status: 1002,
            message:config.tips['1005']
        })
    }
})

router.post('/get_game_group_list', async function (req:Request<{type: string}> & {loginUser: TUser}, res: Response<TResponse<TGameGroup>> ) {
    const list:TGameGroup[] = await prisma.gameGroup.findMany({
       where: { userId: req.loginUser.id, type: req.query.type }
    })
    res.json({
        status: 0,
        list,
    })
})

router.post('/get_game_group_page', async function (req:Request<{id: number}> & {loginUser: TUser}, res: Response<TResponse<TGameGroup>> ) {
    const {pageSize, pageNo, query} = req.body
    query.userId = req.loginUser.id
    const count = await prisma.device.count({where: query})
    const list:TGameGroup[] = await prisma.gameGroup.findMany({
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