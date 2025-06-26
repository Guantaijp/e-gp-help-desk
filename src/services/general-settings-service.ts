const API_BASE_URL = "http://localhost:3000"

class GeneralSettingsService {
    private async request(endpoint: string, options: RequestInit = {}) {
        // Fix: Properly concatenate the endpoint to the base URL
        const url = `${API_BASE_URL}/general-settings${endpoint}`

        const token = localStorage.getItem("accessToken")

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
            ...options,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response.json()
    }

    async getSettings() {
        return this.request("")
    }

    async createSettings(data: any) {
        return this.request("", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateSettings(data: any) {
        if (!data.id) throw new Error("ID is required to update settings")

        return this.request(`/${data.id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deleteSettings(id: string) {
        return this.request(`/${id}`, {
            method: "DELETE",
        })
    }
}

export const generalSettingsService = new GeneralSettingsService()