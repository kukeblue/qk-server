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
