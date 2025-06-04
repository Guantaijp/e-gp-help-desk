"use client"

import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import type { NewShift } from "../../../types/shift.ts"

interface TimeSectionProps {
    shift: NewShift
    onChange: (shift: NewShift) => void
}

export default function TimeSection({ shift, onChange }: TimeSectionProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <Label htmlFor="startTime" className="text-base font-medium">
                    Start Time
                </Label>
                <Input
                    id="startTime"
                    type="time"
                    value={shift.startTime}
                    onChange={(e) => onChange({ ...shift, startTime: e.target.value })}
                    className="mt-2"
                />
            </div>
            <div>
                <Label htmlFor="endTime" className="text-base font-medium">
                    End Time
                </Label>
                <Input
                    id="endTime"
                    type="time"
                    value={shift.endTime}
                    onChange={(e) => onChange({ ...shift, endTime: e.target.value })}
                    className="mt-2"
                />
            </div>
        </div>
    )
}
