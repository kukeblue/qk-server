import {Request, Response} from "express";
import prisma from "../../prisma";
const express = require('express')
const router = express.Router()
import { body, validationResult } from 'express-validator';

type ResponseStatus = 0 | -1

type TGameAccount = {
    id?: number,
    name: string,
    username: string,
    password: string,
    gameServer: string,
}

type GameAccountResponse = {
    status: ResponseStatus,
    data?: TGameAccount,
    message?: String,
    list?: TGameAccount[]
    error?: String | any[],
}

router.get('/game_accounts', async function (req: Request<{}>, res:Response<GameAccountResponse>) {
    const gameAccounts:TGameAccount[] = await prisma.gameAccount.findMany()
    const gameAccountResponse:GameAccountResponse = {status: 0, list: gameAccounts}
    res.json(gameAccountResponse)
})
router.post('/game_account',
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

router.delete('/game_account', function (req:Request<{id: number}>, res: Response<GameAccountResponse> ) {
    const gameAccountResponse: GameAccountResponse = {status: 0}
    res.json(gameAccountResponse)
})

export default router
