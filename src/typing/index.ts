type TResponseStatus = 0 | -1

type TPagination<T> = {
    list: T[],
    total: number,
}

export type TResponse<T> = {
    status: number,
    data?: T,
    message?: String,
    list?: T[]
    error?: String | any[],
    page?: TPagination<T>
}

// ****************************** 任务相关 ******************************

export type TTaskStatus = '初始化' | '启动中' | '进行中' | '报障' | '暂停' | '完成' | ''

export type TTask = {
    id: number,
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
    status: '空闲' | '任务中' | ''
}

// *********************** 账号相关 ******************************

export type TGameAccount = {
    id?: number,
    name: string,
    nickName: string,
    username: string,
    password: string,
    gameServer: string,
}

// *********************** 日志相关 ******************************

export type TaskLogType = "launch" | "info" | "warn" | "error"

export type TTaskLog = {
    id: number
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
