import prisma from "../../prisma";
import {TTask, TDevice, TTaskStatus, TReport, TTaskLog} from "../typing";

export const reportDao = {
    saveReport:  async function (report: TReport) {
        return await prisma.report.create({data: report})
    },
    getReportsByQuery: function (query: {
        date?: string,
        userId?: number,
        type?: string,
    }): Promise<TReport[]> {
        return prisma.report.findMany({
            where: query,
        })
    },
    getReportPage: async function (pageNo:number, pageSize:number, query={}) {
        const count = await prisma.report.count({where: query})
        const list:TReport[] = await prisma.report.findMany({
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


