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
}


