import prisma from "../../prisma";
import {TConfigImage} from "../typing";

export const configImageDao = {
    create: function (configImage: TConfigImage) {
        return prisma.configImage.create({data: configImage})
    },
    getConfigImagePage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.configImage.count({where: query})
        const list:TConfigImage[] = await prisma.configImage.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
            orderBy: [
                {
                    'name': 'desc',
                },
            ],
        })
        return  {
            total: count,
            list
        }
    },
    deleteImageById: async function (id: number) {
        return await prisma.configImage.delete({
            where: {
                id
            }
        })
    },
}


