"use client"

import { Card, CardContent } from "../ui/card"
import { Clock, Users, Calendar, Coffee, UserPlus } from "lucide-react"
import type { Shift } from "../../types/shift"

interface ShiftOverviewPageProps {
    shift: Shift
}

export default function ShiftOverviewPage({ shift }: ShiftOverviewPageProps) {
    const formatTime = (time: string) => {
        try {
            const [hours, minutes] = time.split(":")
            const date = new Date()
            date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
        } catch {
            return time
        }
    }

    const calculateShiftDuration = () => {
        try {
            const [startHours, startMinutes] = shift.startTime.split(":").map(Number)
            const [endHours, endMinutes] = shift.endTime.split(":").map(Number)

            let totalMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes)

            if (totalMinutes < 0) {
                totalMinutes += 24 * 60
            }

            const hours = Math.floor(totalMinutes / 60)
            const minutes = totalMinutes % 60

            return `${hours} hour${hours !== 1 ? "s" : ""}${minutes > 0 ? ` ${minutes}m` : ""}`
        } catch {
            return "N/A"
        }
    }

    const getCoveragePercentage = () => {
        if (shift.agentCount === 0) return 0
        const assignedCount = shift.agents?.length || 0
        return Math.round((assignedCount / shift.agentCount) * 100)
    }

    // Mock recent activity data - replace with actual data from your API
    const recentActivity = [
        {
            type: "created",
            message: "Shift created",
            time: "2 days ago",
            user: "Admin User",
            icon: <div className="w-2 h-2 bg-green-500 rounded-full" />,
        },
        {
            type: "assigned",
            message: `${shift.agents?.length || 0} agents assigned`,
            time: "1 day ago",
            user: "Team Lead",
            icon: <UserPlus className="w-3 h-3 text-blue-500" />,
        },
    ]

    return (
        <div className="space-y-6">
            {/* Shift Info Header */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
            {shift.startTime} - {shift.endTime}
          </span>
                </div>
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
            {shift.agents?.length || 0} of {shift.agentCount} agents assigned
          </span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{shift.days?.join(", ") || "No days assigned"}</span>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-gray-700">{shift.description || shift.name}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">COVERAGE</p>
                            <p className="text-2xl font-bold text-gray-900">{getCoveragePercentage()}%</p>
                            <p className="text-sm text-gray-600">
                                {shift.agents?.length || 0} of {shift.agentCount} agents assigned
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">DURATION</p>
                            <p className="text-2xl font-bold text-gray-900">{calculateShiftDuration()}</p>
                            <p className="text-sm text-gray-600">
                                {shift.startTime} - {shift.endTime}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">REQUIRED SKILLS</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-sm text-gray-600">Skills needed for this shift</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Scheduled Breaks */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Breaks ({shift.breaks?.length || 0})</h3>
                <Card>
                    <CardContent className="p-4">
                        {shift.breaks && shift.breaks.length > 0 ? (
                            <div className="space-y-3">
                                {shift.breaks.map((breakItem, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Coffee className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">{breakItem.name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Coffee className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No breaks scheduled for this shift</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-medium">{activity.message}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {activity.time} by {activity.user}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No recent activity</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
