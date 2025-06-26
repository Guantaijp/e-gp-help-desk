"use client"

import { Plus } from "lucide-react"
import { Button } from "../ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import type { Shift } from "../../types/shift.ts"

interface ShiftsListProps {
    shifts: Shift[]
    onCreateShift: () => void
}

export default function ShiftsList({ shifts, onCreateShift }: ShiftsListProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Shifts</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700" onClick={onCreateShift}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Shift
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {shifts.map((shift) => (
                        <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shift.color }} />
                                <div>
                                    <div className="font-medium">{shift.shiftName}</div>
                                    <div className="text-sm text-gray-500">{shift.description}</div>
                                    <div className="text-sm text-gray-500">
                                        {shift.startTime} - {shift.endTime} • {shift.days?.join(", ") || "No days"}
                                    </div>
                                </div>
                            </div>
                            <Badge variant="secondary">
                                {shift.requiredAgents} agent{shift.requiredAgents !== 1 ? "s" : ""}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
