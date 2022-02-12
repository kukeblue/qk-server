import prisma from "../../prisma";
import {TTaskLog} from "../typing";

export const taskLogDao = {
    createTaskLog: function (taskLog: TTaskLog) {
        return prisma.taskLog.create({data: taskLog})
    },
    getTaskLogPage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.task.count({where: query})
        const list:TTaskLog[] = await prisma.taskLog.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
        })
        return  {
            total: count,
            list
        }
    }
}


