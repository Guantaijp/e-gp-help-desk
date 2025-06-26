"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import type { Category, SkillType } from "../../../../types/skill-management.ts"

interface AddSkillModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    categories: Category[]
    skillTypes: SkillType[]
}

export function AddSkillModal({ isOpen, onClose, onSubmit, categories, skillTypes }: AddSkillModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        typeId: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setFormData({ name: "", description: "", categoryId: "", typeId: "" })
    }

    const handleCancel = () => {
        setFormData({ name: "", description: "", categoryId: "", typeId: "" })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter skill name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <Select value={formData.typeId} onValueChange={(value) => setFormData({ ...formData, typeId: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {skillTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter skill description"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
