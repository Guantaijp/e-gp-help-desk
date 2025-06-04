"use client"

import { useState } from "react"
import Sidebar from "../src/components/layout/Sidebar"
import Header from "../src/components/layout/Header"
import ShiftManagement from "../src/components/shift/ShiftManagement"
import CreateShiftPage from "../src/components/shift/CreateShiftPage"
import { useShifts } from "./hooks/useShifts.ts"
import type { NewShift } from "./types/shift"
import LoadingSpinner from "./components/ui/loading-spinner.tsx";
import ErrorMessage from "./components/ui/error-message.tsx";

export default function App() {
    const [currentView, setCurrentView] = useState<"main" | "create-shift">("main")
    const { shifts, loading, error, createShift } = useShifts()

    const handleCreateShift = async (newShift: NewShift) => {
        try {
            await createShift(newShift)
            setCurrentView("main")
        } catch (err) {
            console.error("Failed to create shift:", err)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <ErrorMessage message={error} />
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
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
