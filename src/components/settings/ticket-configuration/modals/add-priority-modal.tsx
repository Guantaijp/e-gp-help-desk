"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"

interface AddPriorityModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

const colorOptions = [
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Yellow", value: "#EAB308" },
    { name: "Green", value: "#22C55E" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Purple", value: "#A855F7" },
    { name: "Gray", value: "#6B7280" },
]

export function AddPriorityModal({ isOpen, onClose, onSubmit }: AddPriorityModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sla: "",
        color: "#EF4444",
        enabled: true,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            sla: Number.parseInt(formData.sla),
        })
        setFormData({ name: "", description: "", sla: "", color: "#EF4444", enabled: true })
    }

    const handleCancel = () => {
        setFormData({ name: "", description: "", sla: "", color: "#EF4444", enabled: true })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Priority Level</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter priority name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Indicator</label>
                        <div className="flex gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className={`w-8 h-8 rounded border-2 ${
                                        formData.color === color.value ? "border-gray-800" : "border-gray-300"
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter priority description"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SLA (hours) <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            value={formData.sla}
                            onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
                            placeholder="Enter hours"
                            min="1"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                            Save Priority
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
