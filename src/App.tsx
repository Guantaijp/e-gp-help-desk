"use client"

import { useState } from "react"
import Sidebar from "../src/components/layout/Sidebar"
import Header from "../src/components/layout/Header"
import ShiftManagement from "../src/components/shift/ShiftManagement"
import CreateShiftPage from "../src/components/shift/CreateShiftPage"
import type { Shift } from "./types/shift.ts"

export default function App() {
    const [currentView, setCurrentView] = useState<"main" | "create-shift">("main")
    const [shifts, setShifts] = useState<Shift[]>([
        {
            id: "1",
            name: "Morning Shift",
            description: "Regular morning hours",
            color: "#22d3ee",
            startTime: "09:00",
            endTime: "17:00",
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            requiredAgents: 1,
        },
    ])

    const handleCreateShift = (newShift: Omit<Shift, "id">) => {
        const shift: Shift = {
            id: Date.now().toString(),
            ...newShift,
        }
        setShifts([...shifts, shift])
        setCurrentView("main")
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header
                    title={currentView === "create-shift" ? "Create New Shift" : "Work Shift Management"}
                    subtitle={
                        currentView === "create-shift"
                            ? "Set up a new work shift for your team"
                            : "Manage agent work shifts and automatically allocate tickets based on shifts"
                    }
                    showBackButton={currentView === "create-shift"}
                    onBack={() => setCurrentView("main")}
                />

                {currentView === "main" ? (
                    <ShiftManagement shifts={shifts} onCreateShift={() => setCurrentView("create-shift")} />
                ) : (
                    <CreateShiftPage onCreateShift={handleCreateShift} onCancel={() => setCurrentView("main")} />
                )}
            </div>
        </div>
    )
}
