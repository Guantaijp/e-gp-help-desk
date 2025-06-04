import type { Shift } from "../types/shift"

export function useCalendarUtils(shifts: Shift[]) {
    const getShiftForDay = (day: string) => {
        return shifts.find((shift) => shift.days.includes(day))
    }

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

    const getWeekDays = () => {
        const today = new Date()
        const currentWeekStart = new Date(today)
        currentWeekStart.setDate(today.getDate() - today.getDay())

        const weekDays = []
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart)
            day.setDate(currentWeekStart.getDate() + i)
            weekDays.push(day)
        }
        return weekDays
    }

    return {
        getShiftForDay,
        getDaysInMonth,
        getWeekDays,
    }
}
