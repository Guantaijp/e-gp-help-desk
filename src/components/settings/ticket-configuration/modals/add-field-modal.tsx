"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Checkbox } from "../../../ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"

interface AddFieldModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

const fieldTypes = [
    { value: "Text", label: "Text" },
    { value: "Textarea", label: "Textarea" },
    { value: "Dropdown", label: "Dropdown" },
    { value: "Checkbox", label: "Checkbox" },
    { value: "Radio", label: "Radio" },
    { value: "Number", label: "Number" },
    { value: "Email", label: "Email" },
    { value: "Date", label: "Date" },
    { value: "File", label: "File" },
]

export function AddFieldModal({ isOpen, onClose, onSubmit }: AddFieldModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "Text",
        description: "",
        required: false,
        visible: true,
        enabled: true,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setFormData({ name: "", type: "Text", description: "", required: false, visible: true, enabled: true })
    }

    const handleCancel = () => {
        setFormData({ name: "", type: "Text", description: "", required: false, visible: true, enabled: true })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Custom Field</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter field name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter field description"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="required"
                                checked={formData.required}
                                onCheckedChange={(checked) => setFormData({ ...formData, required: checked as boolean })}
                                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            />
                            <label htmlFor="required" className="text-sm font-medium text-gray-700">
                                Required
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="visible"
                                checked={formData.visible}
                                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked as boolean })}
                                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            />
                            <label htmlFor="visible" className="text-sm font-medium text-gray-700">
                                Visible
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                            Save Field
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
