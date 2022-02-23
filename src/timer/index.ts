// @ts-ignore
import schedule from "node-schedule";
import {taskLogDao} from "../dao/taskLogDao";
// @ts-ignore
import moment from "moment";
import {taskDao} from "../dao/taskDao";

export function initTimer() {
    schedule.scheduleJob('0 */5 * * *', async () => {
        console.log('debug asyncTaskCount')
        await asyncTaskCount()
    })
}



export const asyncTaskCount = async function () {
    const date = moment().format('YYYY-MM-DD')
    const tasks = await taskDao.getTasksByQuery({
        date,
    })
    if(tasks && tasks.length > 0) {
        tasks.forEach(task=>{
            taskLogDao.getRecentlyTaskCountLog(task.taskNo).then(async taskLog=>{
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
