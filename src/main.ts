// @ts-ignore
import {initTouchService} from "./service/TouchService";
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const expressWs = require('express-ws')(app);
import gameAccountRouter from "./routers/gameAccountRouter";
import deviceRouter from "./routers/deviceRouter";
import taskRouter from "./routers/taskRouter/index";
import taskLogRouter from "./routers/taskLogRouter/index";
import reportRouter from "./routers/reportRouter/index";
import userRouter from "./routers/userRouter/index";
import configRouter from "./routers/configRouter/index";
import uploadRouter from "./routers/uploadRouter";


const jwt = require('jsonwebtoken');


import {asyncTaskCount, initTimer} from "./timer";
import {Request, Response, ErrorRequestHandler} from "express";
import {NextFunction} from "express/ts4.0";
import {TUser} from "./typing";
import {jwtSecretKey} from "./config";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// token验证中间件
app.use(function(req: Request & {loginUser: TUser},res:Response,next:NextFunction){
    if(req.url.includes('api') && !req.url.includes('login')) {
        const user = jwt.verify(req.headers.token, jwtSecretKey);
        if(user) {
            req.loginUser = user
            next();
        }else {
            res.status(401).json({
                status: -1,
                message: '没有权限，请登录'
            });
        }
    }else {
        next();
    }
})
app.use('/api/game_account', gameAccountRouter)
app.use('/api/device', deviceRouter)
app.use('/api/task', taskRouter)
app.use('/api/task_log', taskLogRouter)
app.use('/api/report', reportRouter)
app.use('/api/user', userRouter)
app.use('/api/config', configRouter)
app.use('/api/upload', uploadRouter)




app.use(function(err:any, req:Request, res:Response, next: any) {
    console.error(err.stack);
    res.status(500).json({
        status: -1,
        message: '系统异常，请联系管理员！'
    });
});

app.listen(3828, '0.0.0.0', async () => {
    initTouchService()
    initTimer()
    console.log(`Example app listening at http://localhost:${3828}`)
})
// await prisma.$disconnect()

