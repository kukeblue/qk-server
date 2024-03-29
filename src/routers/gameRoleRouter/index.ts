import {Request, Response} from "express";
import prisma from "../../../prisma";
const express = require('express')
const router = express.Router()
import { body, validationResult } from 'express-validator';
import {TGameAccount, TResponse, TUser, TGameRole} from "../../typing";
import { gameRoleDao } from "../../dao/gameRoleDao";
import { RequestAddGameRoles } from "./index.type";
import { vipCardDao } from "../../dao/vipCardDao";


type GameAccountResponse = TResponse<TGameRole>

router.post('/add_game_roles', async function (req:Request<any, any, RequestAddGameRoles> & {loginUser: TUser}, res: Response<any> ) {
    const body = req.body
    const list = await gameRoleDao.getGameRoleByQueryCount({work: '挖图' ,userId: req.loginUser.id})
    const count = list.length
    const vipCard = await vipCardDao.getVipCardByQuery({id: req.loginUser.vipCardId!})
    if(req.body.work == '挖图' && (count == vipCard.level || count > vipCard.level)) {
        res.json( {status: 1, message: '请联系管理员升级会员等级'})
    }else {
        const accounts:TGameAccount[] = body.gameAccounts
        const user = req.loginUser
        const work = req.body.work
        const gameServer = req.body.gameServer
        const groupId = req.body.groupId
        const gameRoles:TGameRole[] = []
        accounts.map(item=>{
            const gameRole:TGameRole = {
                accoutId: item.id!,
                userId: user.id!,
                gameServer: gameServer,
                name: item.name,
                gameId: item.nickName,
                work: work,
                groupId: groupId,
                status: '离线',
                level: item.level,
            }
            gameRoleDao.saveGameRole(gameRole)
        })
        res.json( {status: 0})
    }
})

router.post('/update_game_role', async function (req:Request<any, any, TGameRole> & {loginUser: TUser}, res: Response<any> ) {
    const body = req.body
    if(body.status == '删除') {
       await gameRoleDao.deleteById(body.id!)
    }else {
       await gameRoleDao.saveGameRole(body)
    }
    res.json( {status: 0})
})

router.post('/get_game_role_options', async function (req:Request<{groupId: number, work: string}> & {loginUser: TUser}, res: Response<any> ) {
    const list = await gameRoleDao.getGameRoleByQuery({userId: req.loginUser.id, groupId: req.body.groupId})
    res.json({
        status: 0,
        list
    })
})

// @ts-ignore
router.post('/get_game_role_page', async function (req:Request<{}> & {loginUser: TUser}, res: Response<TResponse<any>> ) {
    const {pageSize, pageNo, query} = req.body
    query.userId = req.loginUser.id
    const pagination = await gameRoleDao.getGameRolePage(pageNo, 2000, query)
    return res.json({
        status: 0,
        page: pagination
    })
})

export default router
    