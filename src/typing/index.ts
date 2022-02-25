type TResponseStatus = 0 | -1

type TPagination<T> = {
    list: T[],
    total: number,
}

export type TResponse<T> = {
    status: number,
    data?: T,
    message?: string,
    list?: T[]
    error?: string | any[],
    page?: TPagination<T>
}

// ****************************** 任务相关 ******************************

export type TTaskStatus = '初始化' | '启动中' | '进行中' | '报障' | '暂停' | '完成' | '停止'

export type TTask = {
    id?: number,
    date: string,
    name: string,
    startTime: number,
    updateTime: number,
    endTime: number,
    status?: TTaskStatus,  // 初始化 启动中 进行中 报障 暂停  完成
    note: string,
    taskNo: string,
    deviceId: number,
    accountId: number,
    income: number,
    taskCount?: number
    realIncome: number
}


// *************************** 设备相关 *************************

export type TDevice = {
    id: number,
    name: string,
    brand: string,
    robotName: string,
    robotId: string,
    online: Boolean,
    imei: string,
    ip?: string,
    touchId?:string,
    status: '空闲' | '任务中' | ''
}

// *********************** 账号相关 ******************************
export type TGameAccountOnline = '在线' | '离线'
export type TGameAccount = {
    id?: number,
    name: string,
    nickName: string,
    username: string,
    password: string,
    gameServer: string,
    online: TGameAccountOnline
}

// *********************** 日志相关 ******************************

export type TaskLogType = "launch" | "info" | "warn" | "error" | "finish"

export type TTaskLog = {
    id?: number
    imei: string
    nickName: string
    taskNo: string
    deviceId: number
    accountId: number
    taskName: string
    taskCount?: number
    note:  string
    type: TaskLogType
    time: number
}

// *********************** 报表相关 ******************************

export type TReportType = "day" | "month" | "year"

export type TReport = {
    id?: number
    type: TReportType
    time: number
    date: string
    income?: number
    expend?: number
}
