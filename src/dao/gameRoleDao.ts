import prisma from "../../prisma";
import {TTask, TGameRole, TUser} from "../typing";

export const gameRoleDao = {
    updateGameRoleStatus: async function (gameId: string, status: string) {
        return await prisma.gameRole.updateMany({
            where: {
                gameId,
            },
            data: {status},
        })
    },
    saveGameRole: async function (gameRole: TGameRole) {
        let count = await prisma.gameRole.count(
            {
                where: {
                    name: gameRole.name
                }
            }
        )
        if(count === 0) {
            return await prisma.gameRole.create({data: gameRole})
        }else {
            // const {id, ...updateData} = gameRole
            // return await prisma.gameRole.updateMany({
            //     where: {
            //         id,
            //     },
            //    data: updateData,
            // })
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
    getGameRoleByQuery: function (query: {
        gameId?: string, 
        name?: string,
        userId?: number,
        gameServer?: string,
        groupId?: number
        work?: string,
        status?: string,
    }): TGameRole {
        return prisma.gameRole.findFirst({
            where: query,
        })
    },
    deleteById: async function (id:number) {
        return await prisma.gameRole.delete({
            where: {
                id,
            },
        })
    },
}


