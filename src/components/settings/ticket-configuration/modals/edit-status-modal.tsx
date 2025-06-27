"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Switch } from "../../../ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"
import type { TicketStatus } from "../../../../types/ticket-configuration"

interface EditStatusModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    status: TicketStatus | null
}

const colorOptions = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Orange", value: "#F97316" },
    { name: "Yellow", value: "#EAB308" },
    { name: "Purple", value: "#A855F7" },
    { name: "Green", value: "#22C55E" },
    { name: "Red", value: "#EF4444" },
    { name: "Gray", value: "#6B7280" },
]

export function EditStatusModal({ isOpen, onClose, onSubmit, status }: EditStatusModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "#3B82F6",
        enabled: true,
        is_closed: false,
    })

    useEffect(() => {
        if (status) {
            setFormData({
                name: status.name,
                description: status.description,
                color: status.color,
                enabled: status.enabled,
                is_closed: status.is_closed,
            })
        }
    }, [status])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setFormData({ name: "", description: "", color: "#3B82F6", enabled: true, is_closed: false })
    }

    const handleCancel = () => {
        setFormData({ name: "", description: "", color: "#3B82F6", enabled: true, is_closed: false })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Status Level</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter status name"
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
                            placeholder="Enter status description"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Status Active</label>
                        <Switch
                            checked={formData.enabled}
                            onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                            className="data-[state=checked]:bg-purple-500"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                            Update Status
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
