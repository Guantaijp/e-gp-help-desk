"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../../ui/button"
import { daysOfWeek, monthNames } from "../../../constants"
import type { Shift } from "../../../types/shift.ts"
import { useCalendarUtils } from "../../../hooks/useCalendarUtils"

interface MonthlyCalendarProps {
    shifts: Shift[]
}

export default function MonthlyCalendar({ shifts }: MonthlyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const { getDaysInMonth, getShiftForDay } = useCalendarUtils(shifts)

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    return (
        <div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {daysOfWeek.map((day) => (
                    <div key={day} className="p-3 text-center font-medium text-sm text-slate-600 bg-gray-50">
                        {day.slice(0, 3)}
                    </div>
                ))}

                {/* Calendar Days */}
                {getDaysInMonth(currentDate).map((date, index) => {
                    if (!date) {
                        return <div key={index} className="p-3 h-24 border border-gray-100"></div>
                    }

                    const dayName = daysOfWeek[date.getDay()]
                    const shift = getShiftForDay(dayName)
                    const isToday = date.toDateString() === new Date().toDateString()

                    return (
                        <div
                            key={index}
                            className={`p-2 h-24 border border-gray-100 ${isToday ? "bg-blue-50 border-blue-200" : "bg-white"}`}
                        >
                            <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-slate-700"}`}>
                                {date.getDate()}
                            </div>
                            {shift && (
                                <div
                                    className="text-xs p-1 rounded text-white"
                                    style={{ backgroundColor: shift.color }}
                                    title={`${shift.shiftName} (${shift.startTime} - ${shift.endTime})`}
                                >
                                    <div className="truncate">{shift.shiftName}</div>
                                    <div className="text-[10px] opacity-80">{`${shift.startTime} - ${shift.endTime}`}</div>
                                </div>                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
