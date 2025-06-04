export interface Shift {
    id: string
    name: string
    description: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    requiredAgents: number
}

export interface NewShift {
    name: string
    description: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    requiredAgents: number
}
