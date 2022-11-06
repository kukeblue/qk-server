import prisma from "../../prisma";
import {TTask, TGameRoleMonitor, TUser} from "../typing";

export const gameRoleMonitorDao = {
    // updateGameRoleMonitorStatus: async function (date: string ,gameId: string, status: string) {
    //     return await prisma.gameRoleMonitor.updateMany({
    //         where: {
    //             gameId,
    //         },
    //         data: {status},
    //     })
    // },
    saveGameRoleMonitor: async function (gameRoleMonitor: TGameRoleMonitor) {
        let oldGameRoleMonitor = await prisma.gameRoleMonitor.findFirst(
            {
                where: {
                    gameId: gameRoleMonitor.gameId,
                    date: gameRoleMonitor.date
                }
            }
        )
        if(!oldGameRoleMonitor) {
            return await prisma.gameRoleMonitor.create({data: gameRoleMonitor})
        }else {
            const {id, ...updateData} = gameRoleMonitor
            // updateData.lastIncome = updateData.lastIncome + oldGameRoleMonitor.lastIncome
            if(updateData.work == "挖图") {
                updateData.baotuCount = updateData.baotuCount + oldGameRoleMonitor.baotuCount
                updateData.lastIncome = updateData.lastIncome + oldGameRoleMonitor.lastIncome
            }
            return await prisma.gameRoleMonitor.updateMany({
                where: {
                    id: oldGameRoleMonitor.id,
                },
                data: updateData,
            })
        }
    },

    getGameRoleMonitorsByQuery: async function (query: {
        date: string
        userId: number
    }): Promise<TGameRoleMonitor[]> {
        return await prisma.gameRoleMonitor.findMany({
            where: query,
        })
        
    },
    deleteById: async function (id:number) {
        return await prisma.gameRoleMonitor.delete({
            where: {
                id,
            },
        })
    },
}


