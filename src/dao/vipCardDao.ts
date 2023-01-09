import prisma from "../../prisma";
import {TVipCard} from "../typing";

export const vipCardDao = {
    getVipCardByQuery: function (query: {
        id: number,
    }): Promise<TVipCard> {
        return prisma.vipCard.findFirst({
            where: query,
        })
    },
    getVipCardPage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.user.count({where: query})
        const list:TVipCard[] = await prisma.vipCard.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
        })
        return  {
            total: count,
            list
        }
    },
    updateVipCard: async function (vipCard: TVipCard) {
        const {id, ...data} = vipCard
        return await prisma.user.updateMany({
            where: {
                id,
            },
            data,
        })
    },
}


