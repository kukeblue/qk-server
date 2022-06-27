import prisma from "../../prisma";
import {TTask, TDevice, TTaskStatus, TGameAccount, TGameAccountOnline} from "../typing";

export const gameAccountDao = {
    getGameAccountById: function (id:number): TGameAccount {
        return prisma.gameAccount.findFirst({
            where: {
                id
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


