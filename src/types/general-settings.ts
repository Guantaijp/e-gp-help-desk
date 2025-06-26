export interface BusinessDayHours {
    start: string
    end: string
    enabled: boolean
}

export interface BusinessDaysHours {
    Monday: BusinessDayHours
    Tuesday: BusinessDayHours
    Wednesday: BusinessDayHours
    Thursday: BusinessDayHours
    Friday: BusinessDayHours
    Saturday: BusinessDayHours
    Sunday: BusinessDayHours
}

export interface GeneralSettings {
    id?: string
    systemName: string
    systemVersion: string
    defaultLanguage: string
    timeZone: string
    ticketNumberFormat: string
    employeeIdFormat: string
    firstDayOfWeek: string
    businessDaysHours: BusinessDaysHours
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}
