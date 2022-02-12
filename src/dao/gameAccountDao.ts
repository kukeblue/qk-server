import prisma from "../../prisma";
import {TTask, TDevice, TTaskStatus, TGameAccount} from "../typing";

export const gameAccountDao = {
    getGameAccountById: function (id:number): TGameAccount {
        return prisma.gameAccount.findFirst({
            where: {
                id
            },
        })
    },
}


