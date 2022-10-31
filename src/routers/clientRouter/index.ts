
import {TReport, TResponse, TTask, TTaskLog, TTaskStatus, TUnloadDirectiveConfig} from "../../typing";
// @ts-ignore
import express, {Request, Response} from "express";
import { TAddTaskLogRequest } from "../taskLogRouter/typing";
import { taskLogDao } from "../../dao/taskLogDao";
import { taskDao } from "../../dao/taskDao";
import {gameGroupDao} from "../../dao/gameGroupDao"
import { gameAccountDao } from "../../dao/gameAccountDao";
import { deviceDao } from "../../dao/deviceDao";
import { TGetStartTaskRequest, TGetStartTaskResponse, TStartTaskRequest } from "../taskRouter/typing";
import {asyncHandler} from "../../utils/errerHandle";
import moment from "moment";
import config from "../../config";
import { gameRoleDao } from "../../dao/gameRoleDao";
import { reportDao } from "../../dao/reportDao";
import {TCreateUnloadDirectiveRequest} from "./typing";
import {unloadDirectiveDao} from "../../dao/unloadDirectiveDao";
import {unloadDirectiveConfigDao} from "../../dao/unloadDirectiveConfigDao";
import {TUnloadDirective} from "../../typing";
import { userDao } from "../../dao/userDao.js";
import { vipCardDao } from "../../dao/vipCardDao";

const router = express.Router()

function getRandomString(length: number) {
    length = length || 32;
    //设置随机数范围
    var $chars = '1234567890123456789876521234';
    var maxPos = $chars.length;
    var result = '';
    for(let i = 0; i < length; i++) {
        //产生随机数方式
        result += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

router.post('/get_unloadDirective_by_code',
    async function (req:Request<any, any, {code: string, status?: string}>, res: Response<TResponse<TUnloadDirective>> ) {
        const query = {
            code: req.body.code
        }
        const unloadDirective = await unloadDirectiveDao.getUnloadDirectiveByQuery(query)
        if(unloadDirective) {
            return res.json({
                data:unloadDirective,
                status: 0
            })
        }else {
            return res.json({
                status: -1
            })
        }
    })

router.post('/get_unloadDirective_config_by_code',
    async function (req:Request<any, any, {code: string}>, res: Response<TResponse<TUnloadDirectiveConfig>> ) {
        const query = {
            code: req.body.code
        }
        const unloadDirectiveConfig = await unloadDirectiveConfigDao.getUnloadDirectiveByQuery(query)
        if(unloadDirectiveConfig) {
            return res.json({
                data:unloadDirectiveConfig,
                status: 0
            })
        }else {
            return res.json({
                status: -1
            })
        }
    })

router.post('/update_unloadDirective_config_by_code',
    async function (req:Request<any, any, {config: string,  code: string, id: number}>, res: Response<TResponse<TUnloadDirectiveConfig>> ) {
        const query = {
            code: req.body.code
        }
        const unloadDirectiveConfig = await unloadDirectiveConfigDao.getUnloadDirectiveByQuery(query)
        if(unloadDirectiveConfig) {
            const data = await unloadDirectiveConfigDao.updateUnloadDirectiveConfigById(unloadDirectiveConfig.id!, {
                config: req.body.config,
            })
            return res.json({
                data,
                status: 0
            })
        }else {
            const data = await unloadDirectiveConfigDao.saveUnloadDirectiveConfig({
                code: query.code,  
                config: req.body.config,
                createTime: Number.parseInt((new Date().getTime() / 1000).toFixed(0))
            })
            return res.json({
                data,
                status: 0
            })
        }
    })

router.post('/update_unloadDirective_by_code',
    async function (req:Request<any, any, {code: string}>, res: Response<TResponse<TUnloadDirective>> ) {
        const {code, ...query} = req.body
        console.log(req.body)
        const old = await unloadDirectiveDao.getUnloadDirectiveByQuery({code})
        // @ts-ignore
        if(!old || (old.status == "忙碌" && query.classifyNo)) {
            return res.json({
                status: -1
            })
        }
        const unloadDirective = await unloadDirectiveDao.updateUnloadDirectiveById(old.id!, query)
        if(unloadDirective) {
            return res.json({
                data:unloadDirective,
                status: 0
            })
        }else {
            return res.json({
                status: -1
            })
        }
})

router.post('/save_unloadDirective',
    async function (req:Request<any, any, TCreateUnloadDirectiveRequest>, res: Response<TResponse<TUnloadDirective>> ) {
         const body = req.body
        body.createTime = Number.parseInt((new Date().getTime() / 1000).toFixed(0))
        body.code = getRandomString(6);
        body.total = 0
        body.data = JSON.stringify(body.data)
        body.totalPrice = 0
        body.config = ''
        body.targetId = ''
        body.classifyNo = '',
        console.log(body)
        const unloadDirective = await unloadDirectiveDao.saveUnloadDirective(body)
        return res.json({
            data:unloadDirective,
            status: 0
        })
    })

router.post('/add_task_log', async function (req: Request<{ReqBody: TAddTaskLogRequest}>, res:Response<TResponse<TTaskLog>>) {
    // const taskNo = req.body.taskNo
    // const task = await taskDao.getTaskByTaskNo(taskNo)
    req.body.time = Number.parseInt((new Date().getTime() / 1000).toFixed(0))
    req.body.taskCount = Number(req.body.taskCount)
    if(req.body.type == 'profit') {
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId: req.body.nickName})
        req.body.userId = gameRole!.userId
        const watuScanLog = await taskLogDao.getRecentlyWatuCountLog(req.body.nickName)
        const group = await gameGroupDao.getGameGroupByQuery({id: gameRole!.groupId})
        const priceConfigs:any = {}
        group.priceConfig?.split(',').forEach(item=>{
           const huo = item.split('=')[0]
           const price = item.split('=')[1]
           priceConfigs[huo] = Number(price)
        })
        let income = 0
        req.body.note.split(',').forEach((item:string)=>{
            if(item != '未知') {
                if(priceConfigs[item]) {
                    income = priceConfigs[item] + income
                }else if( group.priceConfig?.includes(item.slice(0,item.length-1))){
                    let level = Number(item.charAt(item.length - 1))
                    let huo = item.slice(0,item.length-1)
                    income = income + priceConfigs[huo] * level
                }
            } 
        })

        req.body.taskCount = watuScanLog.taskCount
        const repost: TReport = {
            type: 'watu_item',
            time: req.body.time,
            date: moment().format('YYYY-MM-DD'),
            income: income || 0,
            // @ts-ignore
            expend: (watuScanLog.taskCount || 0 ) * priceConfigs["宝图"],
            taskCount: watuScanLog.taskCount,
            gameId: gameRole!.gameId,
            groupId: gameRole!.groupId,
            note: req.body.note,
            userId: gameRole!.userId,
        }
        repost.profit = (repost.income || 0) - (repost.expend || 0)
        await reportDao.saveReport(repost)
    }
    if(req.body.type == 'watuScan') {
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId: req.body.nickName})
        const userId = gameRole?.userId
        const user  = await userDao.getUserById(userId!)
        const vipCard = await vipCardDao.getVipCardByQuery({id: user.vipCardId!})
        if(user.vipCardId == 0 || !vipCard ||  vipCard.endTime < (new Date().getTime() / 1000)) {
            return res.status(401).json({
                status: -1,
                message: '会员卡过期'
            });
        }
        req.body.userId = gameRole!.userId
    }
    const taskLog: TTaskLog = await taskLogDao.createTaskLog({...req.body})
    if(taskLog) {
        if(taskLog.taskName == "主线挖图") {
            const type = taskLog.type
            const note = taskLog.note
            if(type == 'info' && note == '准备完毕') {
                await taskDao.updateTaskByTaskNo(taskLog.taskNo, {
                    status: '启动中'
                })
            }
            if(type == 'info' && note == '开始挖图') {
                console.log('开始挖图', taskLog.taskNo, taskLog.deviceId)
                await taskDao.updateTaskByTaskNo(taskLog.taskNo, {
                    status: '进行中'
                })
            }
        }
        
        return res.json({
            status: 0,
            data: taskLog,
        })
    }
    return res.json({
        status: -1
    })
})

export type TClinetStartTaskRequest = {
    deviceId?: number,
    name: string,
    status?: TTaskStatus,
    imei?: string,
    userId?: number,
    gameServer?: string
}


    router.post('/update_game_role_status',
    asyncHandler(async function (req:Request<any, any, {gameId: string, status: string}>, res: Response<any> ) {
        const {gameId, status} = req.body
        await gameRoleDao.updateGameRoleStatus(gameId, status)
        res.json( {status: 0})
    }))

    router.post('/get_one_free_game_role',
    asyncHandler(async function (req:Request<any, any, {gameId: string, work: string}>, res: Response<any> ) {
        const {gameId, work} = req.body
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
        if(!gameRole) {
            return res.json( {status: -1})
        }
        const groupId = gameRole.groupId
        const targetGameRole = await gameRoleDao.getGameRoleByQuery({groupId, work, status: '空闲'})
        if(targetGameRole) {
            if(work == '挖图') {
                await gameRoleDao.updateGameRoleStatus(targetGameRole.gameId, '忙碌')
            }
            res.json( {status: 0, data: targetGameRole, gameId: targetGameRole.gameId})
        }else {
            res.json( {status: -1})
        }
    }))

    router.post('/get_one_by_status',
    asyncHandler(async function (req:Request<any, any, {gameId: string, work: string, status: string}>, res: Response<any> ) {
        const {gameId, work, status} = req.body
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
        if(!gameRole) {
            return res.json( {status: -2})
        }
        const groupId = gameRole.groupId
        console.log(groupId, work, status)
        const targetGameRole = await gameRoleDao.getGameRoleByQuery({groupId, work, status})
        if(targetGameRole) {
            if(work == '挖图') {
                await gameRoleDao.updateGameRoleStatus(targetGameRole.gameId, '忙碌')
            }
            res.json( {status: 0, data: targetGameRole, gameId: targetGameRole.gameId})
        }else {
            res.json( {status: -1})
        }
    }))

    router.post('/get_role_status',
    asyncHandler(async function (req:Request<any, any, {gameId: string}>, res: Response<any> ) {
        const {gameId} = req.body
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
        if(gameRole) {
            res.json( {status: 0, data: gameRole.status})
        }else {
            res.json( {status: -1})
        }
    }))

export default router
