import prisma from "../../prisma";
import {TUnloadDirectiveConfig} from "../typing";

export const unloadDirectiveConfigDao = {
    saveUnloadDirectiveConfig:  async function (unloadDirectiveConfig: TUnloadDirectiveConfig) {
        return await prisma.unloadDirectiveConfig.create({data: unloadDirectiveConfig})
    },
    getUnloadDirectiveByQuery: function (query: {
        code?: string,
    }): Promise<TUnloadDirectiveConfig> {
        return prisma.unloadDirectiveConfig.findFirst({
            where: query,
        })
    },
    updateUnloadDirectiveConfigById: function (id: number, data: {
        config?: string,
    }): TUnloadDirectiveConfig {
        return prisma.unloadDirectiveConfig.update({
            where: {
                id,
            },
            data,
        })
    },
}


