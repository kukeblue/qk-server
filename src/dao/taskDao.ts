import prisma from "../../prisma";
import {TTaskStatus, TTask, TTaskLog} from "../typing";

export const taskDao = {
    createTask: function (task: TTask) {
        return prisma.task.create({data: task})
    },
    updateTaskById: function (id:number, data: {
        status?: TTaskStatus,
        taskCount?: number,
        income?: number
    }): TTask {
        return prisma.task.update({
            where: {
                id,
            },
            data,
        })
    },
    updateTaskByTaskNo: function (taskNo:string, data: {
        status: TTaskStatus,
    }): TTask {
        return prisma.task.updateMany({
            where: {
                taskNo,
            },
            data,
        })
    },
    getTasksByQuery: function (query: {
        name?: string,
        deviceId?: number,
        status?: TTaskStatus,
        date?: string
    }): Promise<TTask[]> {
        return prisma.task.findMany({
            where: query,
            orderBy: [
                {
                    'date': 'asc',
                },
            ],
        })
    },
    getTaskByQuery: function (query: {
        name?: string,
        deviceId?: number,
        status?: TTaskStatus,
        date?: string
    }): TTask {
        return prisma.task.findFirst({
            where: query,
            orderBy: [
                {
                    'date': 'asc',
                },
            ],
        })
    },
    getTaskPage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.task.count({where: query})
        const list:TTask[] = await prisma.task.findMany({
            skip: (pageNo-1) * pageSize,
            take: pageSize,
            where: query,
            orderBy: [
                {
                    'date': 'desc',
                },
            ],
        })
        return  {
            total: count,
            list
        }
    },
    deleteTaskById: async function (id: number) {
        return await prisma.task.delete({
            where: {
                id
            }
        })
    },
    getTaskById: async function (id: number) {
        return await prisma.task.findFirst({
            where: {
                id
            }
        })
    }
}


