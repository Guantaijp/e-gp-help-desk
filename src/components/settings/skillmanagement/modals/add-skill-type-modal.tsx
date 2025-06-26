"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import type {TrainingRequirement} from "../../../../types/skill-management.ts";
import {AddTrainingRequirementModal} from "./add-training-requirement-modal.tsx";

interface AddSkillTypeModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

export function AddSkillTypeModal({ isOpen, onClose, onSubmit }: AddSkillTypeModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        trainingLevel: "",
        tags: "",
    })

    const [trainingRequirements, setTrainingRequirements] = useState<TrainingRequirement[]>([])
    const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false)

    const handleAddTrainingRequirement = (reqData: any) => {
        setTrainingRequirements((prev) => [...prev, { ...reqData, id: Date.now().toString() }])
        setIsTrainingModalOpen(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const tagsArray = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        onSubmit({
            ...formData,
            tags: tagsArray,
            trainingRequirements,
        })
        setFormData({ name: "", description: "", trainingLevel: "", tags: "" })
        setTrainingRequirements([])
    }

    const handleCancel = () => {
        setFormData({ name: "", description: "", trainingLevel: "", tags: "" })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Skill Type</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter skill type name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter a detailed description of this skill type"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Training Level</label>
                        <Select
                            value={formData.trainingLevel}
                            onValueChange={(value) => setFormData({ ...formData, trainingLevel: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <Input
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Add tags separated by commas"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Training Requirements</label>
                        <div className="space-y-2">
                            {trainingRequirements.map((req, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div>
                                        <span className="font-medium">{req.name}</span>
                                        <span className="ml-2 text-sm text-gray-500">({req.status})</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setTrainingRequirements((reqs) => reqs.filter((_, i) => i !== index))}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsTrainingModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add Requirement
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-gray-500">* Required fields</span>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
            <AddTrainingRequirementModal
                isOpen={isTrainingModalOpen}
                onClose={() => setIsTrainingModalOpen(false)}
                onSubmit={handleAddTrainingRequirement}
            />
        </Dialog>
    )
}