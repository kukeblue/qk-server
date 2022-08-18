import prisma from "../../prisma";
import {TTask, TDevice, TTaskStatus, TReport, TTaskLog} from "../typing";

export const reportDao = {
    saveReport:  async function (report: TReport) {
        return await prisma.report.create({data: report})
        // let count = await prisma.report.count(
        //     {
        //         where: {
        //             date: report.date
        //         }
        //     }
        // )
        // if(count === 0) {
            
        // }else {
        //     const {date, id, expend, ...data} = report
        //     return await prisma.report.updateMany({
        //         where: {
        //             date: report.date
        //         },
        //         data,
        //     })
        // }
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


