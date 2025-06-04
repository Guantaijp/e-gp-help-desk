"use client"

import { Label } from "../../ui/label"
import { daysOfWeek } from "../../../constants"
import type { NewShift } from "../../../types/shift.ts"

interface WorkingDaysSectionProps {
    shift: NewShift
    onChange: (shift: NewShift) => void
}

export default function WorkingDaysSection({ shift, onChange }: WorkingDaysSectionProps) {
    const toggleDay = (day: string) => {
        const newDays = shift.days.includes(day) ? shift.days.filter((d) => d !== day) : [...shift.days, day]
        onChange({ ...shift, days: newDays })
    }

    return (
        <div>
            <Label className="text-base font-medium">Working Days</Label>
            <div className="grid grid-cols-4 gap-3 mt-3">
                {daysOfWeek.map((day) => (
                    <div
                        key={day}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            shift.days.includes(day)
                                ? "bg-blue-50 border-blue-300 shadow-sm"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                        }`}
                        onClick={() => toggleDay(day)}
                    >
                        <div className="font-medium text-sm">{day}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {shift.startTime} - {shift.endTime}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
