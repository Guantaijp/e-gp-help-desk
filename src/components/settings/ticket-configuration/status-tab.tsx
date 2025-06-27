"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"
import { Switch } from "../../ui/switch"
import { AddStatusModal } from "./modals/add-status-modal"
import { EditStatusModal } from "./modals/edit-status-modal"
import { ticketConfigService } from "../../../services/ticket-config-service"
import type { TicketStatus } from "../../../types/ticket-configuration"

export function StatusTab() {
    const [statuses, setStatuses] = useState<TicketStatus[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingStatus, setEditingStatus] = useState<TicketStatus | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStatuses()
    }, [])

    const loadStatuses = async () => {
        try {
            setLoading(true)
            const response = await ticketConfigService.getStatuses()
            setStatuses(response.data)
        } catch (error) {
            console.error("Failed to load statuses:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddStatus = async (statusData: any) => {
        try {
            await ticketConfigService.createStatus(statusData)
            await loadStatuses()
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Failed to create status:", error)
        }
    }

    const handleEditStatus = (status: TicketStatus) => {
        setEditingStatus(status)
        setIsEditModalOpen(true)
    }

    const handleUpdateStatus = async (statusData: any) => {
        try {
            if (editingStatus) {
                await ticketConfigService.updateStatus(editingStatus.id, statusData)
                await loadStatuses()
                setIsEditModalOpen(false)
                setEditingStatus(null)
            }
        } catch (error) {
            console.error("Failed to update status:", error)
        }
    }

    const handleDeleteStatus = async (statusId: string) => {
        if (confirm("Are you sure you want to delete this status?")) {
            try {
                await ticketConfigService.deleteStatus(statusId)
                await loadStatuses()
            } catch (error) {
                console.error("Failed to delete status:", error)
            }
        }
    }

    const handleToggleStatus = async (status: TicketStatus) => {
        try {
            await ticketConfigService.updateStatus(status.id, { ...status, enabled: !status.enabled })
            await loadStatuses()
        } catch (error) {
            console.error("Failed to toggle status:", error)
        }
    }

    const filteredStatuses = statuses.filter((status) => status.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Status Management</h2>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Status
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Filter statuses..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Status Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                {filteredStatuses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredStatuses.map((status) => (
                                <tr key={status.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                                            <span className="text-gray-900 font-medium">{status.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{status.description}</td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            variant={status.enabled ? "default" : "secondary"}
                                            className={status.enabled ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {status.enabled ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditStatus(status)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteStatus(status.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Switch
                                                checked={status.enabled}
                                                onCheckedChange={() => handleToggleStatus(status)}
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
                                ? "No statuses found matching your search."
                                : 'No statuses found. Click "Add Status" to create one.'}
                        </p>
                    </div>
                )}
            </div>

            <AddStatusModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddStatus} />
            <EditStatusModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingStatus(null)
                }}
                onSubmit={handleUpdateStatus}
                status={editingStatus}
            />
        </div>
    )
}
