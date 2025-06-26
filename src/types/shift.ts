// Updated types to match the new API format
export interface ApiShift {
    id: string
    name: string
    description: string
    color: string
    agentCount: number
    createdAt: string
    updatedAt: string
    validateBusinessHours: boolean
    recurrence: string
    recurrenceCount: number
    recurrenceEndDate: string | null
    days: string[]
    schedule: {
        startTime: string
        endTime: string
        shiftId: string
    }
    skillIds: string[]
    agentIds: string[]
    breaks: Array<{
        id: string
        shiftId: string
        name: string
        startTime: string
        endTime: string
        createdAt: string
        updatedAt: string
    }>
    skills: Array<{
        id: string
        name: string
    }>
    agents: Array<{
        id: string
        name: string
        email: string
        phone: string | null
    }>
    settings: {
        coverRequests: {
            allowCoverRequests: boolean
            autoApproveCoverRequests: boolean
        }
        notifications: {
            sendReminders: boolean
            notifyAgentsOnAssignment: boolean
        }
        overlapMinutes: number
    }
    _metadata: {
        skillsLoaded: number
        totalSkills: number
        agentsLoaded: number
        totalAgents: number
        dataComplete: boolean
    }
}

export interface CreateShiftRequest {
    name: string
    description?: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    agentCount: number
    breaks?: Array<{
        name: string
        startTime: string
        endTime: string
    }>
    skillIds?: string[]
    agentIds?: string[]
    validateBusinessHours?: boolean
    advancedSettings?: {
        recurrence?: string
        overlapMinutes?: number
        notifications?: {
            notifyAgentsOnAssignment?: boolean
            sendReminders?: boolean
        }
        coverRequests?: {
            allowCoverRequests?: boolean
            autoApproveCoverRequests?: boolean
        }
    }
}

// Simplified types for the UI components
export interface Shift {
    id: string
    name: string
    description: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    agentCount: number
    breaks: Array<{
        id?: string
        name: string
        startTime: string
        endTime: string
    }>
    agents: Array<{
        id: string
        name: string
        email: string
    }>
    settings: {
        coverRequests: {
            allowCoverRequests: boolean
            autoApproveCoverRequests: boolean
        }
        notifications: {
            sendReminders: boolean
            notifyAgentsOnAssignment: boolean
        }
        overlapMinutes: number
    }
}

export interface NewShift {
    name: string
    description: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    agentCount: number
    breaks: Array<{
        name: string
        startTime: string
        endTime: string
    }>
    skillIds: string[]
    agentIds: string[]
    validateBusinessHours: boolean
    advancedSettings: {
        recurrence: string
        overlapMinutes: number
        notifications: {
            notifyAgentsOnAssignment: boolean
            sendReminders: boolean
        }
        coverRequests: {
            allowCoverRequests: boolean
            autoApproveCoverRequests: boolean
        }
    }
}
