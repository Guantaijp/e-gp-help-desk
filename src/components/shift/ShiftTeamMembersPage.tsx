"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Users, Search, Star, UserMinus } from "lucide-react"
import type { Shift } from "../../types/shift"

interface Agent {
    id: string
    name: string
    email: string
    skills: number
}

interface ShiftTeamMembersPageProps {
    shift: Shift
}

export default function ShiftTeamMembersPage({ shift }: ShiftTeamMembersPageProps) {
    const [searchTerm, setSearchTerm] = useState("")

    // Mock available agents - replace with actual data from your API
    const [availableAgents, setAvailableAgents] = useState<Agent[]>([
        { id: "1", name: "Mle", email: "mle@gmail.com", skills: 0 },
        { id: "2", name: "Peter", email: "peter@mail.com", skills: 0 },
        { id: "3", name: "Peter", email: "pwambua@gmail.com", skills: 0 },
        { id: "4", name: "Peter", email: "dan@mail.com", skills: 0 },
    ])

    const [assignedAgents, setAssignedAgents] = useState<Agent[]>(
        shift.agents?.map((agent) => ({
            id: agent.id,
            name: agent.name,
            email: agent.email || "",
            skills: 0,
        })) || [],
    )

    const filteredAvailableAgents = availableAgents.filter(
        (agent) =>
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAssignAgent = (agent: Agent) => {
        setAvailableAgents((prev) => prev.filter((a) => a.id !== agent.id))
        setAssignedAgents((prev) => [...prev, agent])
    }

    const handleUnassignAgent = (agent: Agent) => {
        setAssignedAgents((prev) => prev.filter((a) => a.id !== agent.id))
        setAvailableAgents((prev) => [...prev, agent])
    }

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase()
    }

    const getAvatarColor = (name: string) => {
        const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"]
        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Team Assignment - {shift.name}</h2>
                <div className="text-sm text-gray-500">
                    {assignedAgents.length} of {shift.agentCount} agents assigned
                </div>
            </div>

            {/* Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                    <span className="font-medium">Tip:</span> Click on an agent to move them between lists, or drag and drop.
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Agents */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Available Agents
                            </CardTitle>
                            <Badge variant="secondary">{availableAgents.length}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search by name, email, or skill..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Agent List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredAvailableAgents.map((agent) => (
                                <div
                                    key={agent.id}
                                    onClick={() => handleAssignAgent(agent)}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(agent.name)}`}
                                    >
                                        {getInitials(agent.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900">{agent.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{agent.email}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <span>{agent.skills} matching skills</span>
                                        <Star className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                            {filteredAvailableAgents.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No available agents found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Assigned Agents */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Assigned to This Shift
                            </CardTitle>
                            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {assignedAgents.length} / {shift.agentCount}
                </span>
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-300"
                                        style={{ width: `${Math.min((assignedAgents.length / shift.agentCount) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {assignedAgents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(agent.name)}`}
                                    >
                                        {getInitials(agent.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900">{agent.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{agent.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleUnassignAgent(agent)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all"
                                        title="Remove from shift"
                                    >
                                        <UserMinus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {assignedAgents.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No agents assigned yet</p>
                                    <p className="text-sm">Click on available agents to assign them</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
