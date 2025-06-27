"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import ShiftForm from "./form/ShiftForm"
import type { NewShift } from "../../types/shift"

interface CreateShiftPageProps {
    onCreateShift: (shift: NewShift) => void
    onCancel: () => void
}

export default function CreateShiftPage({ onCreateShift, onCancel }: CreateShiftPageProps) {
    const [newShift, setNewShift] = useState<NewShift>({
        name: "",
        description: "",
        color: "#22d3ee",
        startTime: "09:00",
        endTime: "17:00",
        days: [],
        agentCount: 1,
        breaks: [],
        skillIds: [],
        agentIds: [],
        validateBusinessHours: true,
        advancedSettings: {
            recurrence: "weekly",
            overlapMinutes: 15,
            notifications: {
                notifyAgentsOnAssignment: true,
                sendReminders: false,
            },
            coverRequests: {
                allowCoverRequests: true,
                autoApproveCoverRequests: false,
            },
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
        const error = validateShift(newShift)
        if (error) {
            setValidationError(error)
            return
        }

        setValidationError(null)
        setIsSubmitting(true)

        try {
            await onCreateShift(newShift)
        } catch (err) {
            console.error("Error submitting shift:", err)
            setValidationError("Failed to create shift. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 p-6">
            {/* Back Button */}
            <div className="mb-4">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    disabled={isSubmitting}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            <Card className="max-w-8xl mx-auto">
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Shift</h1>
                        <p className="text-gray-600">Set up a new shift schedule for your team</p>
                    </div>

                    <ShiftForm shift={newShift} onChange={setNewShift} />

                    {validationError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{validationError}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Shift"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}