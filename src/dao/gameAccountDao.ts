import prisma from "../../prisma";
import {TTask, TDevice, TTaskStatus, TGameAccount, TGameAccountOnline} from "../typing";

export const gameAccountDao = {
    saveGameAccount: async function(gameAccount: TGameAccount) {
        const {id, ...data} = gameAccount;
        let newGameAccount = gameAccount;
        if(id) {
            newGameAccount = await prisma.gameAccount.update({
                where: {
                    id,
                },
                data,
            })
        }else {
            newGameAccount = await prisma.gameAccount.create({
                data,
            })
        }
        return newGameAccount
    },
    getGameAccountById: function (id:number): TGameAccount {
        return prisma.gameAccount.findFirst({
            where: {
                id
            },
        })
    },
    getGameAccountByNickname: function (nickName:string): TGameAccount {
        return prisma.gameAccount.findFirst({
            where: {
                nickName
            },
        })
    },
    updateGameAccount: function (id:number, data: {
        online: TGameAccountOnline
    }): TGameAccount {
        return prisma.gameAccount.update({
            where: {
                id
            },
            data,
        })
    },
    deleteById: function (id:number) {
        return prisma.gameAccount.delete({
            where: {
                id,
            },
        })
    },
}


