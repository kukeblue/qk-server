import prisma from "../../prisma";
import {TTask, TTaskStatus, TUser} from "../typing";

export const userDao = {
    saveUser:  async function (user: TUser) {
        let count = await prisma.user.count(
            {
                where: {
                    username: user.username
                }
            }
        )
        if(count === 0) {
            return await prisma.user.create({data: user})
        }else {
            const {password, username} = user
            return await prisma.user.updateMany({
                where: {
                    username,
                },
               data: {password},
            })
        }
    },
    updateUser: async function (user: TUser) {
        const {id, ...data} = user
        return await prisma.user.updateMany({
            where: {
                id,
            },
            data,
        })
    },
    getUserPage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.user.count({where: query})
        const list:TUser[] = await prisma.user.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
        })
        return  {
            total: count,
            list
        }
    },
    getUserByQuery: function (query: {
        username?: string,
    }): Promise<TUser> {
        return prisma.user.findFirst({
            where: query,
        })
    },
    getUserById: function (id: number): Promise<TUser> {
        return prisma.user.findFirst({
            where: {id},
        })
    },
    getAllUser: function (): Promise<TUser[]> {
        return prisma.user.findMany({
            where: {},
        })
    },
}


