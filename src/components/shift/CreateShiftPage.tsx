"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import ShiftForm from "./form/ShiftForm"
import type { NewShift } from "../../types/shift"

interface CreateShiftPageProps {
    onCreateShift: (shift: NewShift) => void
    onCancel: () => void
}

export default function CreateShiftPage({ onCreateShift, onCancel }: CreateShiftPageProps) {
    const [newShift, setNewShift] = useState<NewShift>({
        shiftName: "",
        description: "",
        color: "#22d3ee",
        startTime: "09:00",
        endTime: "17:00",
        days: [],
        requiredAgents: 1,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validationError, setValidationError] = useState<string | null>(null)

    const validateShift = (shift: NewShift): string | null => {
        if (!shift. shiftName.trim()) {
            return "Shift name is required"
        }
        if (shift.days.length === 0) {
            return "At least one day must be selected"
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
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 p-6">
            <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <ShiftForm shift={newShift} onChange={setNewShift} />

                    {validationError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{validationError}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Shift"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
