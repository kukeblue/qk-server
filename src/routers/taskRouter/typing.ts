import {TTaskStatus} from "../../typing";

export type TStartTaskRequest = {
    id: number,
    deviceId: number,
    accountId: number
}

export type TGetStartTaskRequest = {
    imei: string,
    taskName: string,
}


export type TGetStartTaskResponse = {
    taskName: string,
    taskNo: string,
    accountNickName: string,
    status?: TTaskStatus,
    deviceId: number,
    accountId: number,
}

