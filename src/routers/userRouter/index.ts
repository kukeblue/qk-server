import {Request, Response} from "express";
import {TaskLogType, TResponse, TTask, TTaskStatus, TUser} from "../../typing";
import {TCreateUserQuery, TLoginQuery} from "./index.type";
import {userDao} from "../../dao/userDao.js";
import config, {jwtSecretKey} from "../../config";
import { vipCardDao } from "../../dao/vipCardDao";
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');


router.post('/get_user_page',
    async function (req:Request<any, any, any>  & {loginUser: TUser}, res: Response<TResponse<any>> ) {
        const {pageSize, pageNo, query} = req.body
        // query.userId = req.loginUser.id
        const data = await userDao.getUserPage(pageNo, pageSize, query)
        res.json({
            status: 0,
            page: data
        })
    })

router.post('/update_user',
    async function (req:Request<any, any, any>  & {loginUser: TUser}, res: Response<TResponse<any>> ) {
        const user = req.body
        const data = await userDao.updateUser(user)
        res.json({
            status: 0,
            page: data
        })
    })

router.post('/update_vip_card',
    async function (req:Request<any, any, any>  & {loginUser: TUser}, res: Response<TResponse<any>> ) {
        const vipcard = req.body
        const data = await vipCardDao.updateVipCard(vipcard)
        res.json({
            status: 0,
            page: data
        })
    })

router.post('/get_vip_card_page',
    async function (req:Request<any, any, any>  & {loginUser: TUser}, res: Response<TResponse<any>> ) {
        const {pageSize, pageNo, query} = req.body
        const data = await userDao.getUserPage(pageNo, pageSize, query)
        res.json({
            status: 0,
            page: data
        })
    })

router.post('/create_user',
    async function (req:Request<any, any, TCreateUserQuery>, res: Response<TResponse<any>> ) {
        const body = req.body
        const user = await userDao.saveUser(body)
        if(user) {
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

router.post('/login',
    async function (req:Request<any, any, TLoginQuery>, res: Response<TResponse<any>> ) {
        const body = req.body
        const user:TUser = await userDao.getUserByQuery({username: body.username})
        if(user && user.password === body.password) {
            const token = jwt.sign({username: user.username, id: user.id}, jwtSecretKey);
            return res.json({
                status: 0,
                data: token
            })
        }else {
            res.json({
                status: 1006,
                message:config.tips['1006']
            })
        }
})

router.post('/login2',
    async function (req:Request<any, any, TLoginQuery>, res: Response<TResponse<any>> ) {
        const body = req.body
        const user:TUser = await userDao.getUserByQuery({username: body.username})
        if(user && user.password === body.password) {
            if(user.vipCardId! > 0) {
                const vipCard = await vipCardDao.getVipCardByQuery({id: user.vipCardId!})
                user.vipCard = vipCard
            }
            const token = jwt.sign({username: user.username, id: user.id, vipCardId: user.vipCardId }, jwtSecretKey);
            return res.json({
                status: 0,
                data: {
                    token,
                    user: user
                }
            })
        }else {
            res.json({
                status: 1006,
                message:config.tips['1006']
            })
        }
    })

    




export default router
