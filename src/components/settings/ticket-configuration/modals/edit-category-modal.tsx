"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import { ticketConfigService } from "../../../../services/ticket-config-service"
import type { TicketCategory } from "../../../../types/ticket-configuration"

interface EditCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    category: TicketCategory | null
}

export function EditCategoryModal({ isOpen, onClose, onSubmit, category }: EditCategoryModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent: "",
        enabled: true,
    })
    const [parentCategories, setParentCategories] = useState<TicketCategory[]>([])

    useEffect(() => {
        if (isOpen) {
            loadParentCategories()
        }
    }, [isOpen])

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description,
                parent: category.parent || "none",
                enabled: category.enabled,
            })
        }
    }, [category])

    const loadParentCategories = async () => {
        try {
            const response = await ticketConfigService.getCategories()
            // Filter out the current category to prevent self-referencing
            const filteredCategories = response.data.filter((cat: TicketCategory) => cat.id !== category?.id)
            setParentCategories(filteredCategories)
        } catch (error) {
            console.error("Failed to load parent categories:", error)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            parent: formData.parent === "none" ? null : formData.parent,
        })
        setFormData({ name: "", description: "", parent: "", enabled: true })
    }

    const handleCancel = () => {
        setFormData({ name: "", description: "", parent: "", enabled: true })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter category name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter category description"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                        <Select value={formData.parent} onValueChange={(value) => setFormData({ ...formData, parent: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent category (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {parentCategories.map((parentCategory) => (
                                    <SelectItem key={parentCategory.id} value={parentCategory.id}>
                                        {parentCategory.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                            Update Category
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
