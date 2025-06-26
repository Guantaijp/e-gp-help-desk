"use client"
import { Plus, Edit, Trash2, Clock, Users, Coffee } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import type { Shift } from "../../types/shift"

interface ShiftsListProps {
    shifts: Shift[]
    onCreateShift: () => void
    onEditShift: (shift: Shift) => void
    onDeleteShift: (id: string) => Promise<void>
    isDeleting?: string
}

export default function ShiftsList({ shifts, onCreateShift, onEditShift, onDeleteShift, isDeleting }: ShiftsListProps) {
    if (!shifts || shifts.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Shifts</CardTitle>
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={onCreateShift}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Shift
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts created yet</h3>
                        <p className="text-gray-500 mb-4">Create your first shift to get started with scheduling</p>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={onCreateShift}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Shift
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Shifts ({shifts.length})</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={onCreateShift}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Shift
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {shifts.map((shift) => (
                        <div
                            key={shift.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: shift.color }} />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{shift.name}</div>
                                    {shift.description && <div className="text-sm text-gray-500 truncate">{shift.description}</div>}
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {shift.startTime} - {shift.endTime}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {shift.agentCount} agent{shift.agentCount !== 1 ? "s" : ""}
                                        </div>
                                        {shift.breaks.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Coffee className="w-4 h-4" />
                                                {shift.breaks.length} break{shift.breaks.length !== 1 ? "s" : ""}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {shift.days?.length ? (
                                            shift.days.map((day) => (
                                                <Badge key={day} variant="secondary" className="text-xs">
                                                    {day.slice(0, 3)}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">No days assigned</span>
                                        )}
                                    </div>
                                    {shift.agents.length > 0 && (
                                        <div className="mt-2">
                                            <div className="text-xs text-gray-500 mb-1">Assigned Agents:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {shift.agents.map((agent) => (
                                                    <Badge key={agent.id} variant="outline" className="text-xs">
                                                        {agent.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <Button variant="outline" size="sm" onClick={() => onEditShift(shift)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" disabled={isDeleting === shift.id}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{shift.name}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDeleteShift(shift.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
