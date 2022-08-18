import prisma from "../../prisma";
import {TTask, TGameGroup, TUser} from "../typing";

export const gameGroupDao = {
    saveGameGroup:  async function (gameGroup: TGameGroup) {
        let count = await prisma.gameGroup.count(
            {
                where: {
                    name: gameGroup.name
                }
            }
        )
        if(count === 0) {
            return await prisma.gameGroup.create({data: gameGroup})
        }else {
            return await prisma.gameGroup.updateMany({
                where: {
                    id: gameGroup.id,
                },
               data: { name: gameGroup.name },
            })
        }
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


