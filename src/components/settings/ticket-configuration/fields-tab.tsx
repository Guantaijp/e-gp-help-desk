"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"
import { Switch } from "../../ui/switch"
import { AddFieldModal } from "./modals/add-field-modal"
import { EditFieldModal } from "./modals/edit-field-modal"
import { ticketConfigService } from "../../../services/ticket-config-service"
import type { TicketField } from "../../../types/ticket-configuration"

export function FieldsTab() {
    const [fields, setFields] = useState<TicketField[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingField, setEditingField] = useState<TicketField | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadFields()
    }, [])

    const loadFields = async () => {
        try {
            setLoading(true)
            const response = await ticketConfigService.getFields()
            setFields(response.data)
        } catch (error) {
            console.error("Failed to load fields:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddField = async (fieldData: any) => {
        try {
            await ticketConfigService.createField(fieldData)
            await loadFields()
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Failed to create field:", error)
        }
    }

    const handleEditField = (field: TicketField) => {
        setEditingField(field)
        setIsEditModalOpen(true)
    }

    const handleUpdateField = async (fieldData: any) => {
        try {
            if (editingField) {
                await ticketConfigService.updateField(editingField.id, fieldData)
                await loadFields()
                setIsEditModalOpen(false)
                setEditingField(null)
            }
        } catch (error) {
            console.error("Failed to update field:", error)
        }
    }

    const handleDeleteField = async (fieldId: string) => {
        if (confirm("Are you sure you want to delete this field?")) {
            try {
                await ticketConfigService.deleteField(fieldId)
                await loadFields()
            } catch (error) {
                console.error("Failed to delete field:", error)
            }
        }
    }

    const handleToggleField = async (field: TicketField) => {
        try {
            await ticketConfigService.updateField(field.id, { ...field, enabled: !field.enabled })
            await loadFields()
        } catch (error) {
            console.error("Failed to toggle field:", error)
        }
    }

    const filteredFields = fields.filter((field) => field.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Custom Fields Management</h2>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Filter fields..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Fields Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                {filteredFields.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Field Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Required</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Visible</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredFields.map((field) => (
                                <tr key={field.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900 font-medium">{field.name}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant="outline" className="capitalize">
                                            {field.type}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{field.description || "-"}</td>
                                    <td className="py-3 px-4">
                      <span className={field.required ? "text-green-600" : "text-red-600"}>
                        {field.required ? "Yes" : "No"}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                      <span className={field.visible ? "text-green-600" : "text-red-600"}>
                        {field.visible ? "Yes" : "No"}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            variant={field.enabled ? "default" : "secondary"}
                                            className={field.enabled ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {field.enabled ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditField(field)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteField(field.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Switch
                                                checked={field.enabled}
                                                onCheckedChange={() => handleToggleField(field)}
                                                className="data-[state=checked]:bg-purple-500"
                                            />
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
                            {searchTerm
                                ? "No fields found matching your search."
                                : 'No fields found. Click "Add Field" to create one.'}
                        </p>
                    </div>
                )}
            </div>

            <AddFieldModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddField} />
            <EditFieldModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingField(null)
                }}
                onSubmit={handleUpdateField}
                field={editingField}
            />
        </div>
    )
}
