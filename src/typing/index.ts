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
    taskCount?: number,
    realIncome: number,
    userId: number,
    gameServer: string,
}


// *************************** 设备相关 *************************

export type TDevice = {
    id: number,
    deviceType?: string,
    name: string,
    brand: string,
    robotName: string,
    robotId: string,
    online: Boolean,
    imei: string,
    ip?: string,
    touchId?:string,
    status: '空闲' | '任务中' | ''
    userId: number,
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
    online: TGameAccountOnline,
    userId?: number,
    level: number
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
    userId?: number
}

// *********************** 报表相关 ******************************

export type TReportType = "watu_item" | "day" | "month" | "year"

export type TReport = {
    id?: number
    type: TReportType
    time: number
    date: string
    income?: number
    expend?: number
    taskCount?: number
    gameId?: string
    groupId?: number
    note?: string
    userId?: number
    profit?: number
}

// *********************** 用户相关 ******************************
export type TVipCard = {
    id?: number     
    level: number
    createdTime:number
    endTime:  number
    type?: number
}

export type TUser = {
    id?: number
    username: string
    password: string
    vipCardId?: number
    vipCard?: TVipCard
}

export type TGameGroup = {
    id?: number
    name: string
    userId: number
    gameServer: string
    priceConfig?: string
}

export type TGameRole = {
    id?: number
    accoutId?: number
    userId: number
    gameServer: string
    name: string
    gameId: string
    groupId: number,
    work: string
    status: string
    level?: number
    order?: number
}

// *********************** 图片配置 ******************************

export type TConfigImage = {
    id?: number
    name: string
    path: string
    taskId: number
    deviceId: number
    url: string
    userId: number
}

export type TUnloadDirective = {
    id?: number
    code?: string
    gameId: string
    status: string
    data?: string
    config?: string
    total: number
    totalPrice: number
    createTime?: number
    classifyNo?: string
}

export type TUnloadDirectiveConfig = {
    id?: number
    code?: string   
    config?: string
    createTime?: number
}

export type TGameRoleMonitor = {
    id?: number,
    userId: number
    date?: string,
    roleId?: number,
    work?: string,
    status?: string,
    name?: string,
    gameServer?: string,
    gameId?: string,
    groupId?: number,
    baotuCount?: number,
    cangkuCount?: number,
    amount?: number,
    lastIncome?: number,
    lastTime?: number,
}