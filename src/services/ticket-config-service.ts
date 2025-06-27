const API_BASE_URL = "http://localhost:3000"

class TicketConfigService {
    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${API_BASE_URL}/ticket-configuration${endpoint}`

        const accessToken = localStorage.getItem("accessToken")

        const headers = {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...options.headers,
        }

        const response = await fetch(url, {
            ...options,
            headers,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response.json()
    }


    // Statuses
    async getStatuses(enabled?: boolean) {
        const query = enabled !== undefined ? `?enabled=${enabled}` : ""
        return this.request(`/statuses${query}`)
    }

    async createStatus(data: any) {
        return this.request("/statuses", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateStatus(id: string, data: any) {
        return this.request(`/statuses/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deleteStatus(id: string) {
        return this.request(`/statuses/${id}`, {
            method: "DELETE",
        })
    }

    // Priorities
    async getPriorities(enabled?: boolean) {
        const query = enabled !== undefined ? `?enabled=${enabled}` : ""
        return this.request(`/priorities${query}`)
    }

    async createPriority(data: any) {
        return this.request("/priorities", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updatePriority(id: string, data: any) {
        return this.request(`/priorities/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deletePriority(id: string) {
        return this.request(`/priorities/${id}`, {
            method: "DELETE",
        })
    }

    // Categories
    async getCategories(enabled?: boolean, parent?: string) {
        const params = new URLSearchParams()
        if (enabled !== undefined) params.append("enabled", enabled.toString())
        if (parent) params.append("parent", parent)
        const query = params.toString() ? `?${params.toString()}` : ""
        return this.request(`/categories${query}`)
    }

    async createCategory(data: any) {
        return this.request("/categories", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateCategory(id: string, data: any) {
        return this.request(`/categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deleteCategory(id: string) {
        return this.request(`/categories/${id}`, {
            method: "DELETE",
        })
    }

    // Fields
    async getFields(enabled?: boolean, type?: string) {
        const params = new URLSearchParams()
        if (enabled !== undefined) params.append("enabled", enabled.toString())
        if (type) params.append("type", type)
        const query = params.toString() ? `?${params.toString()}` : ""
        return this.request(`/fields${query}`)
    }

    async createField(data: any) {
        return this.request("/fields", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateField(id: string, data: any) {
        return this.request(`/fields/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deleteField(id: string) {
        return this.request(`/fields/${id}`, {
            method: "DELETE",
        })
    }
}

export const ticketConfigService = new TicketConfigService()
