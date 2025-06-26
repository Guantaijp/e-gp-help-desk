export interface Category {
    id: string
    name: string
    description: string
    status: "active" | "inactive"
    createdAt: string
    updatedAt: string
}

export interface SkillType {
    id: string
    name: string
    description: string
    trainingLevel: "beginner" | "intermediate" | "advanced" | "expert"
    tags: string[]
    createdAt: string
    updatedAt: string
}

export interface Skill {
    id: string
    name: string
    description: string
    categoryId: string
    typeId: string
    createdAt: string
    updatedAt: string
    category?: Category
    type?: SkillType
}

export interface TrainingRequirement {
    id: string
    name: string
    type: "certification" | "course" | "assessment"
    status: "required" | "optional" | "recommended"
    description: string
    createdAt: string
    updatedAt: string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}
