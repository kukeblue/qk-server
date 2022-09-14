import prisma from "../../prisma";
import {TUnloadDirective} from "../typing";

export const unloadDirectiveDao = {
    saveUnloadDirective:  async function (unloadDirective: TUnloadDirective) {
        return await prisma.unloadDirective.create({data: unloadDirective})
    },
    getUnloadDirectiveByQuery: function (query: {
        code?: string,
    }): Promise<TUnloadDirective> {
        return prisma.unloadDirective.findFirst({
            where: query,
        })
    },
    // getUnloadDirectiveByQuery: function (query: {
    //     date?: string,
    //     userId?: number,
    //     note?: string
    // }): Promise<TUnloadDirective> {
    //     return prisma.unloadDirective.findFirst({
    //         where: query,
    //     })
    // },
    // getUnloadDirectivePage: async function (pageNo:number, pageSize:number, query={}) {
    //     const count = await prisma.unloadDirective.count({where: query})
    //     const list:TUnloadDirective[] = await prisma.unloadDirective.findMany({
    //         skip: (pageNo-1) * pageSize,
    //         take: pageSize,
    //         where: query,
    //         orderBy: [
    //             {
    //                 'time': 'desc',
    //             },
    //         ],
    //     })
    //     return  {
    //         total: count,
    //         list
    //     }
    // }
    // , deleteById: async function (id: number) {
    //     return await prisma.unloadDirective.delete({
    //         where: {
    //             id
    //         }
    //     })
    // },
}


