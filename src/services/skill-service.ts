const API_BASE_URL = "http://localhost:3000";

class SkillService {
    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${API_BASE_URL}/skill-management${endpoint}`;

        // Get token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }), // add token if present
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // --- Categories ---
    async getCategories(active?: boolean) {
        const query = active ? "?active=true" : "";
        return this.request(`/categories${query}`);
    }

    async createCategory(data: any) {
        return this.request("/categories", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateCategory(id: string, data: any) {
        return this.request(`/categories/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteCategory(id: string) {
        return this.request(`/categories/${id}`, {
            method: "DELETE",
        });
    }

    // --- Skills ---
    async getSkills(categoryId?: string, typeId?: string) {
        const params = new URLSearchParams();
        if (categoryId) params.append("categoryId", categoryId);
        if (typeId) params.append("typeId", typeId);
        const query = params.toString() ? `?${params.toString()}` : "";
        return this.request(`/skills${query}`);
    }

    async createSkill(data: any) {
        return this.request("/skills", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateSkill(id: string, data: any) {
        return this.request(`/skills/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteSkill(id: string) {
        return this.request(`/skills/${id}`, {
            method: "DELETE",
        });
    }

    // --- Skill Types ---
    async getSkillTypes(trainingLevel?: string) {
        const query = trainingLevel ? `?trainingLevel=${trainingLevel}` : "";
        return this.request(`/skill-types${query}`);
    }

    async createSkillType(data: any) {
        return this.request("/skill-types", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateSkillType(id: string, data: any) {
        return this.request(`/skill-types/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteSkillType(id: string) {
        return this.request(`/skill-types/${id}`, {
            method: "DELETE",
        });
    }

    // --- Training Requirements ---
    async getTrainingRequirements(status?: string) {
        const query = status ? `?status=${status}` : "";
        return this.request(`/training-requirements${query}`);
    }

    async createTrainingRequirement(data: any) {
        return this.request("/training-requirements", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateTrainingRequirement(id: string, data: any) {
        return this.request(`/training-requirements/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteTrainingRequirement(id: string) {
        return this.request(`/training-requirements/${id}`, {
            method: "DELETE",
        });
    }
}

export const skillService = new SkillService();
