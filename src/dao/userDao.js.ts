import prisma from "../../prisma";
import {TTask, TTaskStatus, TUser} from "../typing";

export const userDao = {
    saveUser:  async function (user: TUser) {
        let count = await prisma.user.count(
            {
                where: {
                    date: user.username
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


