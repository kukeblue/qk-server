import { TGameAccount } from "../../typing";

export interface RequestAddGameRoles {
    gameAccounts: TGameAccount[]
    gameServer: string,
    work: string,
    groupId: number
}
