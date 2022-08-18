export interface TCreateGameGroup {
    name: string,
    userId: number
    gameServer: string,
    type: string,
    priceConfig?: string
}