"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { AddSkillTypeModal } from "./modals/add-skill-type-modal"
import { skillService } from "../../../services/skill-service.ts"
import type { SkillType } from "../../../types/skill-management"
import { EditSkillTypeModal } from "./modals/edit-skill-type-modal.tsx"

export function SkillTypesTab() {
    const [skillTypes, setSkillTypes] = useState<SkillType[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editingSkillType, setEditingSkillType] = useState<SkillType | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        loadSkillTypes()
    }, [])

    const loadSkillTypes = async () => {
        try {
            setLoading(true)
            const response = await skillService.getSkillTypes()
            setSkillTypes(response.data)
        } catch (error) {
            console.error("Failed to load skill types:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSkillType = async (skillTypeData: any) => {
        try {
            await skillService.createSkillType(skillTypeData)
            await loadSkillTypes()
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Failed to create skill type:", error)
        }
    }

    const handleEditSkillType = (skillType: SkillType) => {
        setEditingSkillType(skillType)
        setIsEditModalOpen(true)
    }

    const handleUpdateSkillType = async (skillTypeData: any) => {
        try {
            if (editingSkillType) {
                await skillService.updateSkillType(editingSkillType.id, skillTypeData)
                await loadSkillTypes()
                setIsEditModalOpen(false)
                setEditingSkillType(null)
            }
        } catch (error) {
            console.error("Failed to update skill type:", error)
        }
    }

    const handleDeleteSkillType = async (skillTypeId: string) => {
        if (confirm("Are you sure you want to delete this skill type?")) {
            try {
                await skillService.deleteSkillType(skillTypeId)
                await loadSkillTypes()
            } catch (error) {
                console.error("Failed to delete skill type:", error)
            }
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Skill Types</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Classify skills by type to better organize help desk capabilities
                    </p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill Type
                </Button>
            </div>

            {/* Skill Types Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                {skillTypes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Type Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Training Level</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Tags</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {skillTypes.map((skillType) => (
                                <tr key={skillType.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900 font-medium">{skillType.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{skillType.description}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant="outline" className="capitalize">
                                            {skillType.trainingLevel}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {skillType.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditSkillType(skillType)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteSkillType(skillType.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                        <p className="text-gray-500">{'No skill types found. Click "Add Skill Type" to create one.'}</p>
                    </div>
                )}
            </div>

            <AddSkillTypeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSkillType}
            />
            <EditSkillTypeModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingSkillType(null)
                }}
                onSubmit={handleUpdateSkillType}
                skillType={editingSkillType}
            />
        </div>
    )
}

