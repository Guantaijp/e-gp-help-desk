const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export interface ApiShift {
    id: string
    shiftName: string
    description: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    requiredAgents: number
    createdAt: string
    updatedAt: string
}

export interface CreateShiftRequest {
    shiftName: string
    description?: string
    color: string
    startTime: string
    endTime: string
    days: string[]
    requiredAgents: number
}

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`

        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        }

        try {
            const response = await fetch(url, config)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Handle 204 No Content responses
            if (response.status === 204) {
                return {} as T
            }

            return await response.json()
        } catch (error) {
            console.error("API request failed:", error)
            throw error
        }
    }

    // Shifts API
    async getShifts(): Promise<ApiShift[]> {
        return this.request<ApiShift[]>("/shifts")
    }

    async getShift(id: string): Promise<ApiShift> {
        return this.request<ApiShift>(`/shifts/${id}`)
    }

    async createShift(shift: CreateShiftRequest): Promise<ApiShift> {
        return this.request<ApiShift>("/shifts", {
            method: "POST",
            body: JSON.stringify(shift),
        })
    }

    async updateShift(id: string, shift: Partial<CreateShiftRequest>): Promise<ApiShift> {
        return this.request<ApiShift>(`/shifts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(shift),
        })
    }

    async deleteShift(id: string): Promise<void> {
        return this.request<void>(`/shifts/${id}`, {
            method: "DELETE",
        })
    }
}

export const apiService = new ApiService()
