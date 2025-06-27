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

interface AddCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

export function AddCategoryModal({ isOpen, onClose, onSubmit }: AddCategoryModalProps) {
    const [formData, setFormData] = useState<{
        name: string
        description: string
        parent: string | null
        enabled: boolean
    }>({
        name: "",
        description: "",
        parent: null,
        enabled: true,
    })
    const [parentCategories, setParentCategories] = useState<TicketCategory[]>([])

    useEffect(() => {
        if (isOpen) {
            loadParentCategories()
        }
    }, [isOpen])

    const loadParentCategories = async () => {
        try {
            const response = await ticketConfigService.getCategories()
            setParentCategories(response.data)
        } catch (error) {
            console.error("Failed to load parent categories:", error)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            parent: formData.parent || null,
        })
        setFormData({ name: "", description: "", parent: null, enabled: true })
    }

    const handleCancel = () => {
        setFormData({ name: "", description: "", parent: null, enabled: true })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
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
                        <Select
                            value={formData.parent ?? ""}
                            onValueChange={(value) =>
                                setFormData({ ...formData, parent: value === "" ? null : value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent category (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {parentCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
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
                            Save Category
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
