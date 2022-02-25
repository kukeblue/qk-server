import {Request, Response} from "express";
import {TReport, TResponse, TTask, TTaskLog, TTaskStatus} from "../../typing";
// @ts-ignore
import moment from "moment"
import {reportDao} from "../../dao/reportDao";
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

router.post('/get_report_page', async function (req:Request, res: Response<TResponse<TReport>> ) {
    const {pageSize, pageNo, query} = req.body
    const pagination = await reportDao.getReportPage(pageNo, pageSize, query)
    return res.json({
        status: 0,
        page: pagination
    })
})

export default router
