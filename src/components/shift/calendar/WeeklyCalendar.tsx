import { daysOfWeek } from "../../../constants"
import type { Shift } from "../../../types/shift.ts"
import { useCalendarUtils } from "../../../hooks/useCalendarUtils"

interface WeeklyCalendarProps {
    shifts: Shift[]
}

export default function WeeklyCalendar({ shifts }: WeeklyCalendarProps) {
    const { getWeekDays, getShiftForDay } = useCalendarUtils(shifts)

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">This Week</h2>
            <div className="grid grid-cols-7 gap-4">
                {getWeekDays().map((date, index) => {
                    const dayName = daysOfWeek[date.getDay()]
                    const shift = getShiftForDay(dayName)
                    const isToday = date.toDateString() === new Date().toDateString()

                    return (
                        <div key={index} className="text-center">
                            <div className={`font-medium text-sm mb-2 ${isToday ? "text-blue-600" : "text-slate-700"}`}>
                                {dayName}
                            </div>
                            <div className={`text-xs mb-2 ${isToday ? "text-blue-600" : "text-slate-500"}`}>
                                {date.getDate()}/{date.getMonth() + 1}
                            </div>
                            {shift ? (
                                <div className="p-3 rounded-lg text-white text-sm" style={{ backgroundColor: shift.color }}>
                                    <div className="font-medium">{shift.shiftName}</div>
                                    <div className="text-xs opacity-90">
                                        {shift.startTime} - {shift.endTime}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-lg bg-gray-100 text-gray-400 text-sm">No shift</div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
