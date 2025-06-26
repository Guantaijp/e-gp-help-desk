"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../../ui/button"
import type { Shift } from "../../../types/shift"

interface MonthlyCalendarProps {
    shifts: Shift[]
}

export default function MonthlyCalendar({ shifts }: MonthlyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }

        return days
    }

    const getShiftsForDay = (date: Date | null) => {
        if (!date) return []

        const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
        return shifts.filter((shift) => shift.days && shift.days.some((day) => day.toLowerCase() === dayName))
    }

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

    const formatTime = (time: string) => {
        // Convert 24-hour format to 12-hour format
        const [hours, minutes] = time.split(":")
        const hour = Number.parseInt(hours)
        const ampm = hour >= 12 ? "PM" : "AM"
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    const days = getDaysInMonth(currentDate)
    const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return (
        <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{monthYear}</h3>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                        {day}
                    </div>
                ))}

                {/* Calendar Days */}
                {days.map((date, index) => {
                    const dayShifts = getShiftsForDay(date)
                    const isToday = date && date.toDateString() === new Date().toDateString()

                    return (
                        <div
                            key={index}
                            className={`min-h-[100px] p-2 border border-gray-200 ${
                                date ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                            } ${isToday ? "ring-2 ring-purple-500" : ""}`}
                        >
                            {date && (
                                <>
                                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-purple-600" : "text-gray-900"}`}>
                                        {date.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {dayShifts.slice(0, 3).map((shift) => (
                                            <div
                                                key={shift.id}
                                                className="text-xs p-2 rounded text-black font-medium border shadow-sm space-y-1"
                                                style={{
                                                    backgroundColor: shift.color,
                                                    borderColor: shift.color,
                                                }}
                                                title={`${shift.name} (${formatTime(shift.startTime)} - ${formatTime(shift.endTime)})`}
                                            >
                                                <div className="font-semibold">{shift.name}</div>
                                                <div>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</div>
                                                <div>
                                                    {shift.agentCount} agent{shift.agentCount !== 1 ? "s" : ""}
                                                </div>
                                            </div>


                                        ))}
                                        {dayShifts.length > 3 && (
                                            <div className="text-xs text-gray-500 text-center">+{dayShifts.length - 3} more</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
