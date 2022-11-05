import {Request, Response} from "express";
import {TGameRoleMonitor, TReport, TResponse, TTask, TTaskLog, TTaskStatus, TUser} from "../../typing";
// @ts-ignore
import moment from "moment"
import {reportDao} from "../../dao/reportDao";
import {gameRoleMonitorDao} from "../../dao/gameRoleMonitorDao"
import {TCreateReportRequest} from "./typing";
import {taskLogDao} from "../../dao/taskLogDao";
const express = require('express')
const router = express.Router()

router.post('/save_report',
    async function (req:Request<any, any, TCreateReportRequest>, res: Response<TResponse<TReport>> ) {
        const body = req.body
        const report = await reportDao.saveReport(body)
        return res.json({
            data:report,
            status: 0
        })
    })

router.post('/get_report_page', async function (req:Request & {loginUser: TUser}, res: Response<TResponse<TReport>> ) {
    const {pageSize, pageNo, query} = req.body
    const pagination = await reportDao.getReportPage(pageNo, pageSize, {userId: req.loginUser.id,...query})
    return res.json({
        status: 0,
        page: pagination
    })
})

router.post('/get_role_baotu_monitor', async function (req:Request<any, any, {gameId: string, count:number}> & {loginUser: TUser}, res: Response<TResponse<TGameRoleMonitor>> ) {
        const gameRoleMonitorList = await gameRoleMonitorDao.getGameRoleMonitorsByQuery({
            date: moment().format('YYYY-MM-DD'),
            userId: req.loginUser.id!,
        })
        res.json( {status: 0, list: gameRoleMonitorList})
})




router.post('/build_report_day_summary', async function (req:Request & {loginUser: TUser}, res: Response<TResponse<TReport>> ) {
    let {date} = req.body
    if(!date) {
        date = moment().format('YYYY-MM-DD')
    }
    const today = moment().add( 1, 'days').format('YYYY-MM-DD')
    const reports = await reportDao.getReportsByQuery({
        userId: req.loginUser.id,
        date: date,
        type: 'watu_item'
    })
    let totalIncome = 0
    let totalTaskCount = 0
    let totalExpend = 0
    let totalProfit = 0
    reports.forEach(item=>{
        totalIncome = totalIncome +  (item.income || 0)
        totalExpend = totalExpend + (item.expend || 0)
        totalTaskCount = totalTaskCount + (item.taskCount || 0)
        totalProfit = totalProfit + (item.profit || 0)
    })
    let heji = await reportDao.getReportByQuery({
        date,
        userId: req.loginUser.id,
        note: '合计'
    })
    if(heji) {
        await reportDao.deleteById(heji.id!)
    }
    
    await reportDao.saveReport({
        type: 'day',
        time: Number.parseInt((new Date(today).getTime() / 1000).toFixed(0)) - 1,
        date,
        income: totalIncome,
        expend: totalExpend,
        taskCount: totalTaskCount,
        gameId: '0',
        groupId: -1,
        note: '合计',
        userId: req.loginUser.id,
        profit: totalProfit,
    })
    return res.json({
        status: 0,
    })

})



export default router
