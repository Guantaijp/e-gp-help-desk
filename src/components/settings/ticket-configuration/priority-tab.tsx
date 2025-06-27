"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"
import { Switch } from "../../ui/switch"
import { AddPriorityModal } from "./modals/add-priority-modal"
// import { EditPriorityModal } from "./modals/edit-priority-modal"
import { ticketConfigService } from "../../../services/ticket-config-service"
import type { TicketPriority } from "../../../types/ticket-configuration"
import {EditPriorityModal} from "./modals/edit-priority-modal.tsx";

export function PriorityTab() {
    const [priorities, setPriorities] = useState<TicketPriority[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingPriority, setEditingPriority] = useState<TicketPriority | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPriorities()
    }, [])

    const loadPriorities = async () => {
        try {
            setLoading(true)
            const response = await ticketConfigService.getPriorities()
            setPriorities(response.data)
        } catch (error) {
            console.error("Failed to load priorities:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddPriority = async (priorityData: any) => {
        try {
            await ticketConfigService.createPriority(priorityData)
            await loadPriorities()
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Failed to create priority:", error)
        }
    }

    const handleEditPriority = (priority: TicketPriority) => {
        setEditingPriority(priority)
        setIsEditModalOpen(true)
    }

    const handleUpdatePriority = async (priorityData: any) => {
        try {
            if (editingPriority) {
                await ticketConfigService.updatePriority(editingPriority.id, priorityData)
                await loadPriorities()
                setIsEditModalOpen(false)
                setEditingPriority(null)
            }
        } catch (error) {
            console.error("Failed to update priority:", error)
        }
    }

    const handleDeletePriority = async (priorityId: string) => {
        if (confirm("Are you sure you want to delete this priority?")) {
            try {
                await ticketConfigService.deletePriority(priorityId)
                await loadPriorities()
            } catch (error) {
                console.error("Failed to delete priority:", error)
            }
        }
    }

    const handleTogglePriority = async (priority: TicketPriority) => {
        try {
            await ticketConfigService.updatePriority(priority.id, { ...priority, enabled: !priority.enabled })
            await loadPriorities()
        } catch (error) {
            console.error("Failed to toggle priority:", error)
        }
    }

    const filteredPriorities = priorities.filter((priority) =>
        priority.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Priority Management</h2>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Priority
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Filter priorities..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Priority Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                {filteredPriorities.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Priority Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">SLA (Hours)</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPriorities.map((priority) => (
                                <tr key={priority.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: priority.color }} />
                                            <span className="text-gray-900 font-medium">{priority.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{priority.description}</td>
                                    <td className="py-3 px-4 text-gray-600">{priority.sla}</td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            variant={priority.enabled ? "default" : "secondary"}
                                            className={priority.enabled ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {priority.enabled ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditPriority(priority)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeletePriority(priority.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Switch
                                                checked={priority.enabled}
                                                onCheckedChange={() => handleTogglePriority(priority)}
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
                                ? "No priorities found matching your search."
                                : 'No priorities found. Click "Add Priority" to create one.'}
                        </p>
                    </div>
                )}
            </div>

            <AddPriorityModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddPriority} />
            <EditPriorityModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingPriority(null)
                }}
                onSubmit={handleUpdatePriority}
                priority={editingPriority}
            />
        </div>
    )
}
