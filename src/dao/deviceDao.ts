import prisma from "../../prisma";
import {TTask, TDevice, TTaskStatus} from "../typing";

export const deviceDao = {
    updateDeviceById: function (id:number, data: {
        status: string
        taskCount?: number
    }): TDevice {
        return prisma.device.update({
            where: {
                id,
            },
            data,
        })
    },
    getDeviceById: function (id:number): TDevice {
        return prisma.device.findFirst({
            where: {
                id,
            },
        })
    },
    getDeviceByQuery: function (query: {
        imei: string
    }): TDevice {
        return prisma.device.findFirst({
            where: query,
        })
    },
    deleteById: function (id:number) {
        return prisma.device.delete({
            where: {
                id,
            },
        })
    },
}


