import {TReportType} from "../../typing";

export type TCreateReportRequest = {
    type: TReportType
    time: number
    date: string
    income: number
    expend: number
    note?: string
}
