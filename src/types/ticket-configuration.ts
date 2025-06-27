export interface TicketStatus {
    id: string
    name: string
    color: string
    enabled: boolean
    description: string
    is_closed: boolean
    created_at?: string
    updated_at?: string
    createdAt: string
    updatedAt: string
}

export interface TicketPriority {
    id: string
    name: string
    description: string
    sla: number
    color: string
    enabled: boolean
    createdAt?: string
    updatedAt?: string
}

export interface TicketCategory {
    id: string
    name: string
    enabled: boolean
    description: string
    parent: string | null
    createdAt?: string
    updatedAt?: string
}

export interface TicketField {
    id: string
    name: string
    type: string
    required: boolean
    visible: boolean
    enabled: boolean
    description: string
    createdAt?: string
    updatedAt?: string
}

export interface ApiResponse<T> {
    success: boolean
    message?: string
    data: T
}
