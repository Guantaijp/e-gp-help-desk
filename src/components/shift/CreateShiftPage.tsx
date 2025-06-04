"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import ShiftForm from "./form/ShiftForm"
import type { NewShift } from "../../types/shift.ts"

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
        requiredAgents: 1,
    })

    const handleSubmit = () => {
        if (newShift.name && newShift.days.length > 0) {
            onCreateShift(newShift)
        }
    }

    return (
        <div className="flex-1 p-6">
            <Card className="max-w-4xl">
                <CardContent className="p-6">
                    <ShiftForm shift={newShift} onChange={setNewShift} />

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                            Create Shift
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
