import {TaskLogType} from "../../typing";

export type TAddTaskLogRequest = {
    imei: String
    nickName: String
    taskNo: String
    deviceId: number
    accountId: number
    taskName: String
    note:  String
    type: TaskLogType
    time: number
}
