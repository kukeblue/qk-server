
import {TReport, TResponse, TTask, TTaskLog, TTaskStatus, TUnloadDirectiveConfig, TGameRoleMonitor, TGameRole, TGameGroup, TGameAccount} from "../../typing";
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
import { gameRoleMonitorDao } from "../../dao/gameRoleMonitorDao"
const urlencode = require('urlencode');


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

// 检查当前角色是否存在
router.post('/check_account_and_role', async function (req:Request<any, any, {
    gameId: string, 
    work: string, 
    groupId: number, level: number}
>, res: Response<TResponse<any>> ) {
    let {gameId, work, groupId}= req.body; 
    console.log('check_account_and_role', gameId, work, groupId)
    let role =  await gameRoleDao.getGameRoleByQuery({gameId})
    if(role && groupId) {
        groupId = Number(groupId)
        if(role.groupId  != groupId){
            await gameRoleDao.deleteById(role.id!)
            role = undefined
        }
    }
    if(role) {
        if(role.work != work) {
            role.work = work
            await gameRoleDao.saveGameRole(role)
        }
        return res.json({
            data:role,
            status: 0
        })
    }else {
        // 当前角色没有录进系统
        // 先检查账号是否有创建
        let level = Number(req.body.level)
        let groupId = Number(req.body.groupId)
        let gameGroup:TGameGroup = await gameGroupDao.getGameGroupByQuery({id: groupId})
        let account = await gameAccountDao.getGameAccountByNickname(gameId)
        if(!gameGroup) {
            return res.json({
                data: '分组不存在',
                status: 1
            })
        }
        if(!account){
            const newAccount: TGameAccount = {
                name: gameId,
                nickName: gameId,
                username: gameId,
                password: '0',
                gameServer: gameGroup.gameServer,
                online: '在线',
                userId: gameGroup.userId,
                level,
            } 
            account = await gameAccountDao.saveGameAccount(newAccount)
        }
        const newRole: TGameRole = {
            accoutId: account.id!,
            userId: account.userId!,
            gameServer: gameGroup.gameServer,
            name: account.name,
            gameId: account.nickName,
            groupId: gameGroup.id!,
            work,
            status: '离线',
            level,
        }
        const role = await gameRoleDao.saveGameRole(newRole)
        return res.json({
            data:role,
            status: 0
        })
    }
})

// 检查当前挖图角色是否存在
router.all('/check_account_and_role3', async function (req:Request<any, any, any, {
    gameId: string, 
    groupId: number, 
    level: number,
    name: string,
    gameServer: string,
}
>, res: Response<TResponse<any>> ) {
    const work = "挖图"
    let {gameId, groupId, name}= req.query; 
    groupId = Number(groupId)
    let level = Number(req.query.level)
    name = urlencode.decode(name, 'gbk');
    console.log('check_account_and_role3 name:' + name + '-' + gameId)
    let role =  await gameRoleDao.getGameRoleByQuery({gameId})
    if(role && groupId) {
        if(role.groupId  != groupId){
            await gameRoleDao.deleteById(role.id!)
            role = undefined
        }
    }
    if(role) {
        if(role.work != work) {
            role.work = work
            await gameRoleDao.saveGameRole(role)
        }
        return res.json({
            data:role,
            status: 0
        })
    }else {
        // 当前角色没有录进系统
        // 先检查账号是否有创建
        console.log('先检查账号是否有创建')
        let gameGroup:TGameGroup = await gameGroupDao.getGameGroupByQuery({id: groupId})
        let account = await gameAccountDao.getGameAccountByNickname(gameId)
        if(!gameGroup) {
            return res.json({
                data: '分组不存在',
                status: 1
            })
        }
        if(!account){
            console.log('account')
            const newAccount: TGameAccount = {
                name,
                nickName: gameId,
                username: gameId,
                password: '0',
                gameServer: gameGroup.gameServer,
                online: '在线',
                userId: gameGroup.userId,
                level,
            } 
            account = await gameAccountDao.saveGameAccount(newAccount)
        }
        const newRole: TGameRole = {
            accoutId: account.id!,
            userId: account.userId!,
            gameServer: gameGroup.gameServer,
            name: account.name,
            gameId: account.nickName,
            groupId: gameGroup.id!,
            work,
            status: '离线',
            level,
        }
        const user = await userDao.getUserById(account.userId!)
        const list = await gameRoleDao.getGameRoleByQueryCount({work: '挖图' ,userId: user.id})
        const count = list.length
        const vipCard = await vipCardDao.getVipCardByQuery({id: user.vipCardId!})
        if((count == vipCard.level || count > vipCard.level)) {
            res.json( {status: 1, message: '请联系管理员升级会员等级'})
        }else {
            const role = await gameRoleDao.saveGameRole(newRole)
            return res.json({
                data:role,
                status: 0
            })
        }
    }
})

// 检查当前挖图角色是否存在
router.post('/check_account_and_role2', async function (req:Request<any, any, {
    gameId: string, 
    userId: number, 
    level: number,
    name: string,
    gameServer: string,
}
>, res: Response<TResponse<any>> ) {
    const work = "挖图"
    let {gameId, userId, name, gameServer}= req.body; 
    userId = Number(userId)
    let level = Number(req.body.level)
    const role =  await gameRoleDao.getGameRoleByQuery({gameId})
    if(role) {
        if(role.work != work) {
            role.work = work
            await gameRoleDao.saveGameRole(role)
        }
        return res.json({
            data:role,
            status: 0
        })
    }else {
        // 当前角色没有录进系统
        // 先检查账号是否有创建
        let gameGroup:TGameGroup = await gameGroupDao.getGameGroupByQuery({gameServer, userId})
        let account = await gameAccountDao.getGameAccountByNickname(gameId)
        if(!gameGroup) {
            return res.json({
                data: '分组不存在',
                status: 1
            })
        }
        if(!account){
            const newAccount: TGameAccount = {
                name,
                nickName: gameId,
                username: gameId,
                password: '0',
                gameServer: gameGroup.gameServer,
                online: '在线',
                userId: gameGroup.userId,
                level,
            } 
            account = await gameAccountDao.saveGameAccount(newAccount)
        }
        const newRole: TGameRole = {
            accoutId: account.id!,
            userId: account.userId!,
            gameServer: gameGroup.gameServer,
            name: account.name,
            gameId: account.nickName,
            groupId: gameGroup.id!,
            work,
            status: '离线',
            level,
        }
        const user = await userDao.getUserById(userId)
        const list = await gameRoleDao.getGameRoleByQueryCount({work: '挖图' ,userId: user.id})
        const count = list.length
        const vipCard = await vipCardDao.getVipCardByQuery({id: user.vipCardId!})
        if((count == vipCard.level || count > vipCard.level)) {
            res.json( {status: 1, message: '请联系管理员升级会员等级'})
        }else {
            const role = await gameRoleDao.saveGameRole(newRole)
            return res.json({
                data:role,
                status: 0
            })
        }
    }
})

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

router.post('/add_task_log', async function (req: Request<{ReqBody: TAddTaskLogRequest}>, res:Response<TResponse<any>>) {
    // const taskNo = req.body.taskNo
    // const task = await taskDao.getTaskByTaskNo(taskNo)
    let gameRoleMonitorNew:any = {}
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
        const gameRoleMonitor: TGameRoleMonitor = {
            date: moment().format('YYYY-MM-DD'),
            userId: gameRole!.userId,
            roleId: gameRole!.id,
            work: gameRole!.work,
            status: gameRole!.status,
            name: gameRole!.name,
            gameServer: gameRole!.gameServer,
            gameId: gameRole!.gameId,
            groupId: gameRole?.groupId,
            baotuCount: 0,
            amount: 0,
            cangkuCount: 0,
            lastIncome: Number.parseInt((income || 0) + ""),
            lastTime: Number.parseInt((new Date().getTime() / 1000).toFixed(0))
        }
        gameRoleMonitorNew = await gameRoleMonitorDao.saveGameRoleMonitor(gameRoleMonitor)
    }
    if(req.body.type == 'watuScan') {
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId: req.body.nickName})
        if(!gameRole) {
            return res.status(401).json({
                status: -1,
                message: '会员卡过期'
            });
        }
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

        const gameId = req.body.nickName
        const count = req.body.taskCount
        const gameRoleMonitor: TGameRoleMonitor = {
            date: moment().format('YYYY-MM-DD'),
            userId: gameRole!.userId,
            roleId: gameRole!.id,
            work: gameRole!.work,
            status: gameRole!.status,
            name: gameRole!.name,
            gameServer: gameRole!.gameServer,
            gameId,
            groupId: gameRole?.groupId,
            baotuCount: count,
            amount: count,
            cangkuCount: count,
            lastIncome: 0,
            lastTime: Number.parseInt((new Date().getTime() / 1000).toFixed(0))
        }
        await gameRoleMonitorDao.saveGameRoleMonitor(gameRoleMonitor)
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
            data: {
                taskLog,
                monitor: gameRoleMonitorNew,
            },
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

// 更新挖图角色的状态·
router.all('/update_game_watu_role_status',
    asyncHandler(async function (req:Request<any, any, any, {gameId: string, status: string, order?: number}>, res: Response<any> ) {
        let {gameId, status, order} = req.query
        status = urlencode.decode(status, 'gbk');
        try {
            await gameRoleDao.updateGameRoleStatus(gameId, status, order)
            res.json( {status: 0})
        }catch(err) {
            console.log(err)
            res.json( {status: -1})
        }
    }))


    router.post('/update_game_role_status',
    asyncHandler(async function (req:Request<any, any, {gameId: string, status: string}>, res: Response<any> ) {
        const {gameId, status} = req.body
        try {
            if(status == '抓鬼') {
               const role = await gameRoleDao.getGameRoleByQuery({gameId})
               if(!role || role?.work != "挖图") {
                    res.json( {status: -1})
               }else {
                    const userId = role?.userId
                    const user  = await userDao.getUserById(userId!)
                    const vipCard = await vipCardDao.getVipCardByQuery({id: user.vipCardId!})
                    if(user.vipCardId == 0 || !vipCard ||  vipCard.endTime < (new Date().getTime() / 1000)) {
                        return res.status(401).json({
                            status: -1,
                            message: '会员卡过期'
                        });
                    }
                    res.json( {status: 0})
               }
            }else {
                const data = await gameRoleDao.updateGameRoleStatus(gameId, status)
                res.json( {status: 0})
            }
        }catch(err) {
            res.json( {status: -1})
        }
    }))

    let roleLock = false
    async function sleep(time: number) {
        return new Promise((resolve: any,reject: any)=>{
            setTimeout(function(){
                resolve();
            },time)
      });
    }

    router.all('/get_one_free_cangku_role',
    asyncHandler(async function (req:Request<any, any, any, {gameId: string}>, res: Response<any> ) {
        const {gameId} = req.query
        let work = '接货'
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
        if(!gameRole) {
            return res.json( {status: -1})
        }
        const groupId = gameRole.groupId
        const targetGameRole = await gameRoleDao.getGameRoleByQuery({groupId, work, status: '空闲'})
        if(targetGameRole) {
            res.json( {status: 0, gameId: targetGameRole.gameId})
        }else {
            res.json( {status: -1})
        }
    }))


    let fatuRoleLock = false

    router.post('/get_one_free_game_fatu_role', async function (req:Request<any, any, {gameId: string, work: string}>, res: Response<any> ) {
        const {gameId, work} = req.body
        try {
            if(work == '发图' ) {
                if(fatuRoleLock == false) {
                    fatuRoleLock = true 
                }else {
                    while(fatuRoleLock) {
                        await sleep(50)
                    }
                    fatuRoleLock = true 
                }
            }
            const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
            if(!gameRole) {
                if(work == '发图') { 
                    fatuRoleLock = false 
                }
                return res.json( {status: -1})
            }
            const groupId = gameRole.groupId
            const userId = gameRole.userId

            const targetGameRole = await gameRoleDao.getGameRoleByQuery({userId: userId, groupId, work, status: '空闲'})
            if(targetGameRole) {
                if(work == '发图') {
                    await gameRoleDao.updateGameRoleStatus(targetGameRole.gameId, '忙碌')
                    fatuRoleLock = false 
                }
                res.json( {status: 0, data: targetGameRole, gameId: targetGameRole.gameId, order: targetGameRole.order})
            }else {
                if(work == '发图') {
                    fatuRoleLock = false 
                }
                res.json( {status: -1})
            }
        }catch(err) {
                console.error(err)
                if(work == '发图') { 
                    fatuRoleLock = false 
                }
                res.json( {status: -2})
            }
        })

    router.post('/get_one_free_game_role', async function (req:Request<any, any, {gameId: string, work: string}>, res: Response<any> ) {
        const {gameId, work} = req.body
        try {
            if(work == '挖图' ) {
                if(roleLock == false) {
                    roleLock = true 
                }else {
                    while(roleLock) {
                        await sleep(50)
                    }
                    roleLock = true 
                }
            }
            const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
            if(!gameRole) {
                if(work == '挖图') { 
                    roleLock = false 
                }
                return res.json( {status: -1})
            }
            const groupId = gameRole.groupId
            const userId = gameRole.userId

            const targetGameRole = await gameRoleDao.getGameRoleByQuery({userId: userId, groupId, work, status: '空闲'})
            if(targetGameRole) {
                if(work == '挖图') {
                    await gameRoleDao.updateGameRoleStatus(targetGameRole.gameId, '忙碌')
                    roleLock = false 
                }
                res.json( {status: 0, data: targetGameRole, gameId: targetGameRole.gameId, order: targetGameRole.order})
            }else {
                if(work == '挖图') {
                    roleLock = false 
                }
                res.json( {status: -1})
            }
        }catch(err) {
                console.error(err)
                if(work == '挖图') { 
                    roleLock = false 
                }
                res.json( {status: -2})
            }
        })

    router.post('/get_one_by_status',
    asyncHandler(async function (req:Request<any, any, {gameId: string, work: string, status: string}>, res: Response<any> ) {
        const {gameId, work, status} = req.body
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
        if(!gameRole) {
            return res.json( {status: -2})
        }
        const groupId = gameRole.groupId
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

    router.post('/save_role_baotu_monitor',
    asyncHandler(async function (req:Request<any, any, {gameId: string, count:number}>, res: Response<any> ) {
        const {gameId, count} = req.body
        const gameRole = await gameRoleDao.getGameRoleByQuery({gameId})
        const gameRoleMonitor: TGameRoleMonitor = {
            date: moment().format('YYYY-MM-DD'),
            userId: gameRole!.userId,
            roleId: gameRole!.id,
            work: gameRole!.work,
            status: gameRole!.status,
            name: gameRole!.name,
            gameServer: gameRole!.gameServer,
            gameId,
            groupId: gameRole?.groupId,
            baotuCount: count,
            amount: count,
            cangkuCount: count,
            lastIncome: 0,
            lastTime: Number.parseInt((new Date().getTime() / 1000).toFixed(0))
        }
        await gameRoleMonitorDao.saveGameRoleMonitor(gameRoleMonitor)
        res.json( {status: 0})
    }))

    
export default router
