"use client"

import { useState, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { AddSkillModal } from "./modals/add-skill-modal"
import { skillService } from "../../../services/skill-service"
import type { Skill, Category, SkillType } from "../../../types/skill-management"
import {EditSkillModal} from "./modals/ edit-skill-modal.tsx";

export function SkillsTab() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [skillTypes, setSkillTypes] = useState<SkillType[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedType, setSelectedType] = useState("all")
    const [loading, setLoading] = useState(true)
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [skillsData, categoriesData, typesData] = await Promise.all([
                skillService.getSkills(),
                skillService.getCategories(),
                skillService.getSkillTypes(),
            ])
            setSkills(skillsData.data)
            setCategories(categoriesData.data)
            setSkillTypes(typesData.data)
        } catch (error) {
            console.error("Failed to load data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSkill = async (skillData: any) => {
        try {
            await skillService.createSkill(skillData)
            await loadData()
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Failed to create skill:", error)
        }
    }

    const handleEditSkill = (skill: Skill) => {
        setEditingSkill(skill)
        setIsEditModalOpen(true)
    }

    const handleUpdateSkill = async (skillData: any) => {
        try {
            if (editingSkill) {
                await skillService.updateSkill(editingSkill.id, skillData)
                await loadData()
                setIsEditModalOpen(false)
                setEditingSkill(null)
            }
        } catch (error) {
            console.error("Failed to update skill:", error)
        }
    }

    const handleDeleteSkill = async (skillId: string) => {
        if (confirm("Are you sure you want to delete this skill?")) {
            try {
                await skillService.deleteSkill(skillId)
                await loadData()
            } catch (error) {
                console.error("Failed to delete skill:", error)
            }
        }
    }

    const filteredSkills = skills.filter((skill) => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || skill.categoryId === selectedCategory
        const matchesType = selectedType === "all" || skill.typeId === selectedType
        return matchesSearch && matchesCategory && matchesType
    })

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Skills Library</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage all skill definitions for the help desk system.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Skill
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search skills..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Category:</span>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Type:</span>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {skillTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Skills Table */}
            {filteredSkills.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Skill Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredSkills.map((skill) => (
                            <tr key={skill.id} className="border-b border-gray-100">
                                <td className="py-3 px-4 text-gray-900">{skill.name}</td>
                                <td className="py-3 px-4 text-gray-600">{skill.description}</td>
                                <td className="py-3 px-4 text-gray-600">{skill.category?.name}</td>
                                <td className="py-3 px-4 text-gray-600">{skill.type?.name}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditSkill(skill)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleDeleteSkill(skill.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {searchTerm || selectedCategory !== "all" || selectedType !== "all"
                            ? "No skills found matching your filters."
                            : 'No skills found. Click "Add New Skill" to create one.'}
                    </p>
                </div>
            )}

            <AddSkillModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSkill}
                categories={categories}
                skillTypes={skillTypes}
            />
            <EditSkillModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingSkill(null)
                }}
                onSubmit={handleUpdateSkill}
                categories={categories}
                skillTypes={skillTypes}
                skill={editingSkill}
            />
        </div>
    )
}

