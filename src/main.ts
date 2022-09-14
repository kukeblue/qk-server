// @ts-ignore
import {initTouchService} from "./service/TouchService";
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const expressWs = require('express-ws')(app);
import gameAccountRouter from "./routers/gameAccountRouter";
import deviceRouter from "./routers/deviceRouter";
import taskRouter from "./routers/taskRouter/index";
import gameGroup from "./routers/gameGroupRouter/index";
import taskLogRouter from "./routers/taskLogRouter/index";
import reportRouter from "./routers/reportRouter/index";
import userRouter from "./routers/userRouter/index";
import gameRoleRouter from "./routers/gameRoleRouter/index";
import configRouter from "./routers/configRouter/index";
import uploadRouter from "./routers/uploadRouter";
import clientRouter from "./routers/clientRouter";

const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))


const jwt = require('jsonwebtoken');


import {asyncTaskCount, initTimer} from "./timer";
import e, {Request, Response, ErrorRequestHandler} from "express";
import {NextFunction} from "express/ts4.0";
import {TUser} from "./typing";
import {jwtSecretKey} from "./config";
import { vipCardDao } from "./dao/vipCardDao";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// token验证中间件
app.use(async function(req: Request & {loginUser: TUser},res:Response,next:NextFunction){
    if(req.url.includes('api') && !req.url.includes('login') && !req.url.includes('client')) {
        if(!req.headers.token) {
            res.status(401).json({
                status: -1,
                message: '没有权限，请登录'
            });
        }else {
            let user
            try {
                user = jwt.verify(req.headers.token, jwtSecretKey);
            }catch(err) {
                return res.status(401).json({
                    status: -1,
                    message: '没有权限，请登录'
                });
            }
            if(!user) {
                return res.status(401).json({
                    status: -1,
                    message: '没有权限，请登录'
                });
            }
            let vipCard
            if(user.vipCardId != 0) {
                vipCard = await vipCardDao.getVipCardByQuery({id: user.vipCardId!})
            }
            if(user.vipCardId == 0 || !vipCard ||  vipCard.endTime < (new Date().getTime() / 1000)) {
                res.status(401).json({
                    status: -1,
                    message: '会员卡过期'
                });
                return
            }
            if(user) {
                req.loginUser = user
                next();
            }else {
                res.status(401).json({
                    status: -1,
                    message: '没有权限，请登录'
                });
            }
        }
    }else {
        next();
    }
})
app.use('/api/game_account', gameAccountRouter)
app.use('/api/client', clientRouter)
app.use('/api/device', deviceRouter)
app.use('/api/task', taskRouter)
app.use('/api/gameGroup', gameGroup)
app.use('/api/task_log', taskLogRouter)
app.use('/api/report', reportRouter)
app.use('/api/user', userRouter)
app.use('/api/config', configRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/client', clientRouter)
app.use('/api/game_role', gameRoleRouter)
// app.use('/api/unload_directive', unloadDirectiveRouter)








app.use(function(err:any, req:Request, res:Response, next: any) {
    console.error(err.stack);
    res.status(500).json({
        status: -1,
        message: '系统异常，请联系管理员！'
    });
});

app.listen(3000, '0.0.0.0', async () => {
    initTouchService()
    initTimer()
    console.log(`Example app listening at http://localhost:${3000}`)
})
// await prisma.$disconnect()

