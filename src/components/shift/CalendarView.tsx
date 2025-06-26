"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import MonthlyCalendar from "./calendar/MonthlyCalendar"
import WeeklyCalendar from "./calendar/WeeklyCalendar"
import type { Shift } from "../../types/shift"

interface CalendarViewProps {
    shifts: Shift[]
    onCreateShift: () => void
}

export default function CalendarView({ shifts, onCreateShift }: CalendarViewProps) {
    const [calendarView, setCalendarView] = useState<"monthly" | "weekly">("monthly")

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <CardTitle>Schedule</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={calendarView === "monthly" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCalendarView("monthly")}
                            className={calendarView === "monthly" ? "bg-purple-600 hover:bg-purple-700" : ""}
                        >
                            Monthly
                        </Button>
                        <Button
                            variant={calendarView === "weekly" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCalendarView("weekly")}
                            className={calendarView === "weekly" ? "bg-purple-600 hover:bg-purple-700" : ""}
                        >
                            Weekly
                        </Button>
                    </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={onCreateShift}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Shift
                </Button>
            </CardHeader>
            <CardContent>
                {calendarView === "monthly" ? <MonthlyCalendar shifts={shifts} /> : <WeeklyCalendar shifts={shifts} />}
            </CardContent>
        </Card>
    )
}
