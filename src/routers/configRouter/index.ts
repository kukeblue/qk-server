import {Request, Response} from "express";
import {TConfigImage, TReport, TResponse, TTask, TTaskLog, TTaskStatus, TUser} from "../../typing";
// @ts-ignore
import moment from "moment"
import {TCreateConfigImageRequest} from "./index.typing";
import {configImageDao} from "../../dao/configImageDao";
const express = require('express')
const router = express.Router()

router.post('/create_config_image',
    async function (req:Request<any, any, TCreateConfigImageRequest> & {loginUser: TUser}, res: Response<TResponse<TConfigImage>> ) {
        const data = await configImageDao.create({
            ...req.body,
            taskId: 0,
            userId: req.loginUser.id!
        })
        return res.json({
            data: data,
            status: 0
        })
    })

router.post('/get_config_image_page',
    async function (req:Request, res: Response<TResponse<TConfigImage>> ) {
        const {pageSize, pageNo, query} = req.body
        const page = await configImageDao.getConfigImagePage(pageNo, pageSize, query)
        res.json({
            status: 0,
            page
        })
    })

router.post('/delete_config_image_by_id', async function (req:Request<{id: number}>, res: Response<TResponse<TTask>> ) {
    const page = await configImageDao.deleteImageById(req.body.id)
    res.json({
        status: 0,
    })
})



export default router
