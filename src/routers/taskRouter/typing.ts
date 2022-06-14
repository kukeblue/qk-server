import {TTaskStatus} from "../../typing";

export type TStopTaskRequest = {
    id: number,
    deviceId: number,
    accountId: number
}

export type TStartTaskRequest = {
    id: number,
    deviceId: number,
    accountId: number
    name: string,
    status?: TTaskStatus,
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
export type TCreateTaskQuery = {
    name: string,
    deviceId: number,
    accountId: number,
}


export type TEditTaskRequest = {
    id: number
    status?: TTaskStatus,
    taskCount?: number,
    income?: number
}
