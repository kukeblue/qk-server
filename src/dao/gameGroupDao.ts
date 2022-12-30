import prisma from "../../prisma";
import {TTask, TGameGroup, TUser} from "../typing";

export const gameGroupDao = {
    saveGameGroup:  async function (gameGroup: TGameGroup) {
        return await prisma.gameGroup.create({data: gameGroup})
        
    },
    getGameGroupPage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.gameGroup.count({where: query})
        const list:TGameGroup[] = await prisma.gameGroup.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
        })
        return  {
            total: count,
            list
        }
    },
    getGameGroupByQuery: function (query: {
        id?: number,
        name?: string,
        userId?: number,
        gameServer?: string
    }): TGameGroup {
        return prisma.gameGroup.findFirst({
            where: query,
        })
    },
}


