import {Request, Response} from "express";
import {TaskLogType, TResponse, TTask, TTaskStatus, TUser} from "../../typing";
import {TCreateUserQuery, TLoginQuery} from "./index.type";
import {userDao} from "../../dao/userDao.js";
import config, {jwtSecretKey} from "../../config";
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');


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
