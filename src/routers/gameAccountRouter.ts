import {Request, Response} from "express";
import prisma from "../../prisma";
const express = require('express')
const router = express.Router()
import { body, validationResult } from 'express-validator';
import {TResponse} from "../typing";

type TGameAccount = {
    id?: number,
    name: string,
    username: string,
    password: string,
    gameServer: string,
}

type GameAccountResponse = TResponse<TGameAccount>

router.post('/get_game_accounts', async function (req: Request<{}>, res:Response<GameAccountResponse>) {
    const gameAccounts:TGameAccount[] = await prisma.gameAccount.findMany()
    const gameAccountResponse:GameAccountResponse = {status: 0, list: gameAccounts}
    res.json(gameAccountResponse)
})
router.post('/add_game_account',
    body('name').isString(),
    body('password').isString(),
    body('gameServer').isString(),
    async function (req:Request<any, any, TGameAccount>, res: Response<GameAccountResponse> ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status: -1, error: errors.array()});
        }
        const {id, ...data} = req.body
        let gameAccount = null
        if(id) {
            gameAccount = await prisma.gameAccount.update({
                where: {
                    id,
                },
                data,
            })
        }else {
            gameAccount = await prisma.gameAccount.create({
                data,
            })
        }
        const ret:GameAccountResponse = {data: gameAccount, status: 0}
        res.json(ret)
    })

router.post('/delete_game_account', function (req:Request<{id: number}>, res: Response<GameAccountResponse> ) {
    const gameAccountResponse: GameAccountResponse = {status: 0}
    res.json(gameAccountResponse)
})

router.post('/get_game_account_page', async function (req:Request<{id: number}>, res: Response<GameAccountResponse> ) {
    const {pageSize, pageNo, query} = req.body
    const count = await prisma.gameAccount.count(
        {
            where: query,
        }
    )
    const list = await prisma.gameAccount.findMany({
        skip: (pageNo-1) * pageSize,
        take: pageSize,
        where: query,
    })
    res.json({
        status: 0,
        page: {
            total: count,
            list
        }
    })
})

export default router
