"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import ShiftForm from "./form/ShiftForm"
import type { Shift, NewShift } from "../../types/shift"

interface EditShiftPageProps {
    shift: Shift
    onUpdateShift: (id: string, shift: NewShift) => Promise<void>
    onCancel: () => void
}

export default function EditShiftPage({ shift, onUpdateShift, onCancel }: EditShiftPageProps) {
    const [editedShift, setEditedShift] = useState<NewShift>({
        name: shift.name,
        description: shift.description,
        color: shift.color,
        startTime: shift.startTime,
        endTime: shift.endTime,
        days: shift.days,
        agentCount: shift.agentCount,
        breaks: shift.breaks.map((b) => ({
            name: b.name,
            startTime: b.startTime,
            endTime: b.endTime,
        })),
        skillIds: [],
        agentIds: shift.agents.map((a) => a.id),
        validateBusinessHours: true,
        advancedSettings: {
            recurrence: "weekly",
            overlapMinutes: shift.settings.overlapMinutes,
            notifications: shift.settings.notifications,
            coverRequests: shift.settings.coverRequests,
        },
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validationError, setValidationError] = useState<string | null>(null)

    const validateShift = (shift: NewShift): string | null => {
        if (!shift.name.trim()) {
            return "Shift name is required"
        }
        if (shift.days.length === 0) {
            return "At least one day must be selected"
        }
        if (shift.startTime >= shift.endTime) {
            return "End time must be after start time"
        }
        return null
    }

    const handleSubmit = async () => {
        const error = validateShift(editedShift)
        if (error) {
            setValidationError(error)
            return
        }

        setValidationError(null)
        setIsSubmitting(true)

        try {
            await onUpdateShift(shift.id, editedShift)
        } catch (err) {
            console.error("Error updating shift:", err)
            setValidationError("Failed to update shift. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 p-6 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shifts
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Shift: {shift.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ShiftForm shift={editedShift} onChange={setEditedShift} />

                        {validationError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{validationError}</div>
                        )}

                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Shift"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
