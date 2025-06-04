"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import CalendarView from "./CalendarView"
import ShiftsList from "./ShiftsList"
import type { Shift } from "../../types/shift.ts"

interface ShiftManagementProps {
    shifts: Shift[]
    onCreateShift: () => void
}

export default function ShiftManagement({ shifts, onCreateShift }: ShiftManagementProps) {
    const [activeTab, setActiveTab] = useState("calendar")

    return (
        <div className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                        Calendar
                    </TabsTrigger>
                    <TabsTrigger value="shifts">Shifts</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar" className="mt-6">
                    <CalendarView shifts={shifts} onCreateShift={onCreateShift} />
                </TabsContent>

                <TabsContent value="shifts" className="mt-6">
                    <ShiftsList shifts={shifts} onCreateShift={onCreateShift} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
