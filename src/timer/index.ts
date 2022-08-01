// @ts-ignore
import schedule from "node-schedule";
import {taskLogDao} from "../dao/taskLogDao";
// @ts-ignore
import moment from "moment";
import {taskDao} from "../dao/taskDao";
import {reportDao} from "../dao/reportDao";

export function initTimer() {
    // schedule.scheduleJob('0 */5 * * *', async () => {
    //     console.log('debug asyncTaskCount')
    //     await asyncTaskCount()
    // })
}

const asyncOneDay = async function (date: string) {
    const tasks = await taskDao.getTasksByQuery({
        date,
    })
    if(tasks && tasks.length > 0) {
        tasks.forEach(task=>{
            const taskLog = taskLogDao.getRecentlyTaskCountLog(task.taskNo)
            .then(async taskLog=>{
                if(taskLog) {
                    let income = 0
                    if(taskLog.taskName == '主线打图') {
                        income = Number.parseInt(String(taskLog.taskCount ? taskLog.taskCount / 10 : 0))
                    }
                    await taskDao.updateTaskById(task.id!, {
                        taskCount: taskLog.taskCount || 0,
                        income,
                    })
                }
            })
        })
    }
}

const buildReport = async function (date: string) {
    const tasks = await taskDao.getTasksByQuery({
        date,
    })
    let totalIncome = 0
    if(tasks && tasks.length > 0) {
        tasks.forEach(task=>{
            totalIncome = totalIncome + task.income
        })
    }
    await reportDao.saveReport({
        type: "day",
        time: Number.parseInt((new Date().getTime() / 1000).toFixed(0)),
        date,
        income: totalIncome,
        expend: 0
    })
}

export const asyncTaskCount = async function () {
    const date = moment().format('YYYY-MM-DD')
    const yesterday = moment().add( -1, 'days').format('YYYY-MM-DD')
    await asyncOneDay(date)
    await asyncOneDay(yesterday)
    await reportDao.saveReport({
        type: "day",
        time: Number.parseInt((new Date().getTime() / 1000).toFixed(0)),
        date: date,
        income: 10,
        expend: 0
    })
    buildReport(date)
    buildReport(yesterday)
}
