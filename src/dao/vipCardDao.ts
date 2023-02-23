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
        const count = await prisma.vipCard.count({where: query})
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
    saveVipCard: async function (vipCard: TVipCard) {
        if(!vipCard.id) {
            return await prisma.vipCard.create({data: vipCard})
        }
        let count = await prisma.vipCard.count(
            {
                where: {
                    id: vipCard.id
                }
            }
        )
        if(count === 0) {
            return await prisma.vipCard.create({data: vipCard})
        }else {
            const {createdTime, endTime} = vipCard
            return await prisma.vipCard.updateMany({
                where: {
                    id: vipCard.id
                },
               data: {createdTime, endTime, level: vipCard.level},
            })
        }
    },
}


