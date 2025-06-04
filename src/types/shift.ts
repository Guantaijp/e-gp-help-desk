export interface Shift {
    id: string
    shiftName: string
    description: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    requiredAgents: number
}

export interface NewShift {
    shiftName: string
    description: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    requiredAgents: number
}
