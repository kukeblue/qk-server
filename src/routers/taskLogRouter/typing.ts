import {TaskLogType} from "../../typing";

export type TAddTaskLogRequest = {
    imei: string
    nickName: string
    taskNo: string
    deviceId: number
    accountId: number
    taskName: string
    note:  string
    type: TaskLogType
    time: number
}
