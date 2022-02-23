import prisma from "../../prisma";
import {TTaskLog} from "../typing";

export const taskLogDao = {
    createTaskLog: function (taskLog: TTaskLog) {
        if(!taskLog.taskCount) {
            taskLog.taskCount = -1
        }
        return prisma.taskLog.create({data: taskLog})
    },
    getRecentlyTaskCountLog: async function (taskNo:string): Promise<TTaskLog> {
        return await prisma.taskLog.findFirst({
            where: {
                taskNo,
            },
            orderBy: [
                {
                    'taskCount': 'desc',
                },
            ],
        })
    },
    getTaskLogPage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.taskLog.count({where: query})
        const list:TTaskLog[] = await prisma.taskLog.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
            orderBy: [
                {
                    'time': 'desc',
                },
            ],
        })
        return  {
            total: count,
            list
        }
    }
}


