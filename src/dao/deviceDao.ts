import prisma from "../../prisma";
import {TTask, TDevice, TTaskStatus} from "../typing";

export const deviceDao = {
    updateDeviceById: function (id:number, data: {
        status: string
    }): TDevice {
        return prisma.device.update({
            where: {
                id,
            },
            data,
        })
    },
    getDeviceByQuery: function (query: {
        imei: string
    }): TDevice {
        return prisma.device.findFirst({
            where: query,
        })
    }
}


