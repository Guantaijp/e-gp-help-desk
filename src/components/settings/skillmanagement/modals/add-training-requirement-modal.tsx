"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Textarea } from "../../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group"
import { Label } from "../../../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog"

interface AddTrainingRequirementModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

export function AddTrainingRequirementModal({ isOpen, onClose, onSubmit }: AddTrainingRequirementModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        status: "required",
        description: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setFormData({ name: "", type: "", status: "required", description: "" })
    }

    const handleCancel = () => {
        setFormData({ name: "", type: "", status: "required", description: "" })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Training Requirement</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Requirement Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter requirement name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Requirement Type <span className="text-red-500">*</span>
                        </label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="certification">Certification</SelectItem>
                                <SelectItem value="course">Course</SelectItem>
                                <SelectItem value="assessment">Assessment</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <RadioGroup
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="required" id="required" />
                                <Label htmlFor="required">Required</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="optional" id="optional" />
                                <Label htmlFor="optional">Optional</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter requirement description"
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
