const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

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

export interface ApiSkill {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string
}


// interface ApiResponse<T> {
//     success: boolean
//     message: string
//     data: T
// }

class ApiService {
    private getToken(): string | null {
        if (typeof window !== "undefined" && window.localStorage) {
            return localStorage.getItem("accessToken")
        }
        return null
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`

        const token = this.getToken()
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        }

        const config: RequestInit = {
            ...options,
            headers,
        }

        try {
            const response = await fetch(url, config)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            if (response.status === 204) {
                return {} as T
            }

            const jsonResponse = await response.json()

            // Check if response is wrapped in the API format
            if (jsonResponse && typeof jsonResponse === "object" && "data" in jsonResponse && "success" in jsonResponse) {
                return jsonResponse.data as T
            }

            // Return as-is if not wrapped
            return jsonResponse as T
        } catch (error) {
            console.error("API request failed:", error)
            throw error
        }
    }

    // --- Shift API methods ---
    async getShifts(): Promise<ApiShift[]> {
        return this.request<ApiShift[]>("/work-shifts/shifts")
    }

    async getShift(id: string): Promise<ApiShift> {
        return this.request<ApiShift>(`/work-shifts/shifts/${id}`)
    }

    async createShift(shift: CreateShiftRequest): Promise<ApiShift> {
        return this.request<ApiShift>("/work-shifts/shifts", {
            method: "POST",
            body: JSON.stringify(shift),
        })
    }

    async updateShift(id: string, shift: Partial<CreateShiftRequest>): Promise<ApiShift> {
        return this.request<ApiShift>(`/work-shifts/shifts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(shift),
        })
    }

    async deleteShift(id: string): Promise<void> {
        return this.request<void>(`/work-shifts/shifts/${id}`, {
            method: "DELETE",
        })
    }
    // --- Skills API methods ---
    async getSkills(): Promise<ApiSkill[]> {
        return this.request<ApiSkill[]>("/skill-management/skills")
    }
}

export const apiService = new ApiService()
