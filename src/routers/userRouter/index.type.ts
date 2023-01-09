export type TCreateUserQuery = {
    username: string
    password: string
    vipCardId?: number
}

export type TLoginQuery = {
    username: string
    password: string
}
