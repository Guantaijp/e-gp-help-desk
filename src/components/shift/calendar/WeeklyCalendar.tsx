import React from 'react';
import { format, startOfWeek, addDays,} from 'date-fns';

interface Shift {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    color: string;
    agentCount: number;
    days: string[];
}

interface WeeklyCalendarProps {
    shifts: Shift[];
}

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return format(date, 'h:mm a');
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ shifts }) => {
    const today = new Date();
    const startOfTheWeek = startOfWeek(today, { weekStartsOn: 0 });

    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfTheWeek, i));

    const getShiftsForDay = (date: Date) => {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
        return shifts.filter((shift) =>
            shift.days && shift.days.some(day => day.toLowerCase() === dayName)
        )
    }

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-7 gap-4">
                {days.map((day) => (
                    <div key={day.toISOString()} className="border rounded p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            {format(day, 'EEE, MMM d')}
                        </h2>
                        {getShiftsForDay(day).map((shift) => (
                            <div
                                key={shift.id}
                                className="p-2 rounded text-sm border shadow-sm"
                                style={{
                                    backgroundColor: shift.color,
                                    borderColor: shift.color,
                                }}
                            >
                                <div className="font-medium truncate text-black">{shift.name}</div>
                                <div className="text-xs text-black opacity-80">
                                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                </div>
                                <div className="text-xs text-black opacity-70">
                                    {shift.agentCount} agent{shift.agentCount !== 1 ? "s" : ""}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyCalendar;
