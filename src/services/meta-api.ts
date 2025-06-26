// services/meta-api.ts
const API_BASE_URL = "http://localhost:3000" // Adjust to your backend URL

class MetaApiClient {
    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${API_BASE_URL}${endpoint}`
        const token = localStorage.getItem("accessToken")

        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        }

        const response = await fetch(url, config)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `API Error: ${response.status} - ${response.statusText}`)
        }

        return response.json()
    }

    // File upload method
    async uploadFile(file: File): Promise<string> {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || "Upload failed")
        }

        const data = await response.json()
        return data.url
    }

    // Upload multiple files
    async uploadFiles(files: File[]): Promise<string[]> {
        const uploadPromises = files.map((file) => this.uploadFile(file))
        return Promise.all(uploadPromises)
    }

    // Authentication methods
    async login(credentials: { email: string; password: string }) {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || `Login failed: ${response.status} - ${response.statusText}`)
        }

        // Handle the new response structure
        if (data.success && data.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken)

            // Return success without fetching user data
            return { success: true, message: data.message }
        } else {
            throw new Error(data.message || "Invalid response format")
        }
    }

    async logout() {
        localStorage.removeItem("accessToken")
    }

    async getCurrentUser() {
        const response = await this.request("/users/me")

        // Handle the standardized response format
        if (response.success && response.data) {
            return response.data
        }

        // Fallback for direct user data
        return response
    }

    // Dashboard stats methods
    async getDashboardStats() {
        const response = await this.request("/dashboard/stats")
        return response.success ? response.data : response
    }

    // Facebook API methods
    async getFacebookAccounts() {
        const response = await this.request("/meta/facebook/accounts")
        return response.success ? response.data : response
    }

    async createFacebookAccount(data: {
        page_name: string
        page_id: string
        access_token: string
    }) {
        const response = await this.request("/meta/facebook/accounts", {
            method: "POST",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async updateFacebookAccount(
        id: string,
        data: {
            page_name: string
            page_id: string
            access_token: string
        },
    ) {
        const response = await this.request(`/meta/facebook/accounts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async deleteFacebookAccount(id: string) {
        const response = await this.request(`/meta/facebook/accounts/${id}`, {
            method: "DELETE",
        })
        return response.success ? response.data : response
    }

    async testFacebookCredentials(id: string) {
        const response = await this.request(`/meta/facebook/accounts/${id}/test-credentials`, {
            method: "POST",
        })
        return response.success ? response.data : response
    }

    async getFacebookPosts(account_id?: number) {
        const query = account_id ? `?account_id=${account_id}` : ""
        const response = await this.request(`/meta/facebook/posts${query}`)
        return response.success ? response.data : response
    }

    async createFacebookPost(data: {
        account_id: number
        content: string
    }) {
        const response = await this.request("/meta/facebook/posts", {
            method: "POST",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async updateFacebookPost(
        id: string,
        data: {
            account_id: number
            content: string
        },
    ) {
        const response = await this.request(`/meta/facebook/posts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async deleteFacebookPost(id: string) {
        const response = await this.request(`/meta/facebook/posts/${id}`, {
            method: "DELETE",
        })
        return response.success ? response.data : response
    }

    async publishFacebookPost(id: string) {
        const response = await this.request(`/meta/facebook/posts/${id}/publish`, {
            method: "POST",
        })
        return response.success ? response.data : response
    }

    // Instagram API methods
    async getInstagramAccounts() {
        const response = await this.request("/meta/instagram/accounts")
        return response.success ? response.data : response
    }

    async createInstagramAccount(data: {
        username: string
        account_id: string
        access_token: string
    }) {
        const response = await this.request("/meta/instagram/accounts", {
            method: "POST",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async updateInstagramAccount(
        id: string,
        data: {
            username: string
            account_id: string
            access_token: string
        },
    ) {
        const response = await this.request(`/meta/instagram/accounts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async deleteInstagramAccount(id: string) {
        const response = await this.request(`/meta/instagram/accounts/${id}`, {
            method: "DELETE",
        })
        return response.success ? response.data : response
    }

    async getInstagramPosts(account_id?: number) {
        const query = account_id ? `?account_id=${account_id}` : ""
        const response = await this.request(`/meta/instagram/posts${query}`)
        return response.success ? response.data : response
    }

    async createInstagramPost(data: {
        account_id: string
        caption: string
        media_urls: string[]
    }) {
        const response = await this.request("/meta/instagram/posts", {
            method: "POST",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async updateInstagramPost(
        id: string,
        data: {
            account_id: string
            caption: string
            media_urls: string[]
        },
    ) {
        const response = await this.request(`/meta/instagram/posts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
        return response.success ? response.data : response
    }

    async deleteInstagramPost(id: string) {
        const response = await this.request(`/meta/instagram/posts/${id}`, {
            method: "DELETE",
        })
        return response.success ? response.data : response
    }

    async publishInstagramPost(id: string) {
        const response = await this.request(`/meta/instagram/posts/${id}/publish`, {
            method: "POST",
        })
        return response.success ? response.data : response
    }

    // Comments API methods
    async getFacebookComments(postId?: number) {
        const query = postId ? `?postId=${postId}` : ""
        const response = await this.request(`/meta/facebook/comments${query}`)
        return response.success ? response.data : response
    }

    async getInstagramComments(postId?: number) {
        const query = postId ? `?postId=${postId}` : ""
        const response = await this.request(`/meta/instagram/comments${query}`)
        return response.success ? response.data : response
    }

    async syncFacebookComments(postId: string) {
        const response = await this.request(`/meta/facebook/comments/sync/${postId}`, {
            method: "POST",
        })
        return response.success ? response.data : response
    }

    async syncInstagramComments(postId: string) {
        const response = await this.request(`/meta/instagram/comments/sync/${postId}`, {
            method: "POST",
        })
        return response.success ? response.data : response
    }


    // Messenger API methods
    async getMessengerAccounts() {
        return this.request("/meta/messenger/accounts")
    }

    async createMessengerAccount(data: {
        name: string
        pageId: string
        accessToken: string
    }) {
        return this.request("/meta/messenger/accounts", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async getMessengerConversations(accountId: number) {
        return this.request(`/meta/messenger/conversations/${accountId}`)
    }

    async getMessengerMessages(conversationId?: string, accountId?: number) {
        let query = ""
        if (conversationId) {
            query = `?conversationId=${conversationId}`
        } else if (accountId) {
            query = `?accountId=${accountId}`
        }
        return this.request(`/meta/messenger/messages${query}`)
    }

    async sendMessengerMessage(data: {
        conversationId: string
        content: string
        messageType: string
    }) {
        return this.request("/meta/messenger/messages/send", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async syncMessengerMessages(accountId: number) {
        return this.request("/meta/messenger/messages/sync", {
            method: "POST",
            body: JSON.stringify({ accountId }),
        })
    }

    // WhatsApp API methods
    async getWhatsAppAccounts() {
        return this.request("/meta/whatsapp/accounts")
    }

    async createWhatsAppAccount(data: {
        name: string
        phoneNumber: string
        businessAccountId: string
        accessToken: string
    }) {
        return this.request("/meta/whatsapp/accounts", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async getWhatsAppConversations(accountId: number) {
        return this.request(`/meta/whatsapp/messages?accountId=${accountId}`)
    }

    async getWhatsAppMessages(conversationId?: string, accountId?: number) {
        let query = ""
        if (conversationId) {
            query = `?conversationId=${conversationId}`
        } else if (accountId) {
            query = `?accountId=${accountId}`
        }
        return this.request(`/meta/whatsapp/messages${query}`)
    }

    async sendWhatsAppMessage(data: {
        conversationId: string
        content: string
        messageType: string
    }) {
        return this.request("/meta/whatsapp/messages/send", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async syncWhatsAppMessages(accountId: number) {
        return this.request("/meta/whatsapp/messages/sync", {
            method: "POST",
            body: JSON.stringify({ accountId }),
        })
    }





}

export const metaApiClient = new MetaApiClient()
