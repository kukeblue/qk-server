import prisma from "../../prisma";
import {TTask, TGameRole, TUser} from "../typing";

export const gameRoleDao = {
    updateGameRoleStatus: async function (gameId: string, status: string, order?: number) {
        console.log(order)
        const update: any = {
            status
        }
        if(order == 0) {
            update.order = Number(order)
        }
        if(order && order > 0) {
            update.order = Number(order)
        }
        return await prisma.gameRole.updateMany({
            where: {
                gameId,
            },
            data: update,
        })
    },
    saveGameRole: async function (gameRole: TGameRole) {
        let count = await prisma.gameRole.count(
            {
                where: {
                    gameId: gameRole.gameId
                }
            }
        )
        if(count === 0) {
            gameRole.order = 0
            return await prisma.gameRole.create({data: gameRole})
        }else {
            const {id, ...updateData} = gameRole
            if(id) {
                return await prisma.gameRole.updateMany({
                    where: {
                        id,
                    },
                   data: updateData,
                })
            }
            
        }
    },
    
    getGameRolePage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.gameRole.count({where: query})
        const list:TGameRole[] = await prisma.gameRole.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
        })
        return  {
            total: count,
            list
        }
    },
    getGameRoleByQueryCount: function (query: {
        gameId?: string, 
        name?: string,
        userId?: number,
        gameServer?: string,
        groupId?: number
        work?: string,
        status?: string,
    }): TGameRole[] {
        return prisma.gameRole.findMany({
            where: query,
        })
    },
    getGameRoleByQuery: async function (query: {
        gameId?: string, 
        name?: string,
        userId?: number,
        gameServer?: string,
        groupId?: number
        work?: string,
        status?: string,
    }): Promise<TGameRole | undefined> {
        const gameRoles:TGameRole[] = await prisma.gameRole.findMany({
            where: query,
        })
        if(gameRoles.length > 0) {
            if(gameRoles.length == 1) {
                return gameRoles[0]
            }else {
                const index = Math.floor(Math.random()*Math.floor(gameRoles.length));
                return gameRoles[index]
            }
        }
    },
    deleteById: async function (id:number) {
        return await prisma.gameRole.delete({
            where: {
                id,
            },
        })
    },
}


