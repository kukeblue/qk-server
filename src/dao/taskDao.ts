import prisma from "../../prisma";
import {TTaskStatus, TTask} from "../typing";

export const taskDao = {
    updateTaskById: function (id:number, data: {
        status: TTaskStatus,
    }): TTask {
        return prisma.task.update({
            where: {
                id,
            },
            data,
        })
    },
    getTaskByQuery: function (query: {
        name?: string,
        deviceId?: number,
        status?: TTaskStatus
    }): TTask {
        return prisma.task.findFirst({
            where: query,
        })
    }
}


