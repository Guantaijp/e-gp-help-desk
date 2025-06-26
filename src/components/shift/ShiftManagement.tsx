"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Calendar, List, Users, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"
import CalendarView from "./CalendarView"
import ShiftsList from "./ShiftsList"
import CreateShiftPage from "./CreateShiftPage"
import EditShiftPage from "./EditShiftPage"
import { apiService } from "../../services/api"
import { mapApiShiftToShift, mapNewShiftToCreateRequest } from "../../lib/shift-mapper.ts"
import type { Shift, NewShift } from "../../types/shift"

export default function ShiftManagement() {
    const [activeTab, setActiveTab] = useState("calendar")
    const [currentView, setCurrentView] = useState<"main" | "create" | "edit">("main")
    const [shifts, setShifts] = useState<Shift[]>([])
    const [editingShift, setEditingShift] = useState<Shift | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Fetch shifts on component mount
    useEffect(() => {
        fetchShifts()
    }, [])

    const fetchShifts = async () => {
        try {
            setLoading(true)
            setError(null)
            const apiShifts = await apiService.getShifts()
            const mappedShifts = apiShifts.map(mapApiShiftToShift)
            setShifts(mappedShifts)
        } catch (err) {
            console.error("Error fetching shifts:", err)
            setError("Failed to load shifts. Please try again.")
            setShifts([])
        } finally {
            setLoading(false)
        }
    }

    const handleCreateShift = async (newShift: NewShift) => {
        try {
            const createRequest = mapNewShiftToCreateRequest(newShift)
            const createdApiShift = await apiService.createShift(createRequest)
            const createdShift = mapApiShiftToShift(createdApiShift)
            setShifts((prev) => [...prev, createdShift])
            setCurrentView("main")
        } catch (err) {
            console.error("Error creating shift:", err)
            throw new Error("Failed to create shift")
        }
    }

    const handleUpdateShift = async (id: string, updatedShift: NewShift) => {
        try {
            const updateRequest = mapNewShiftToCreateRequest(updatedShift)
            const updatedApiShift = await apiService.updateShift(id, updateRequest)
            const mappedShift = mapApiShiftToShift(updatedApiShift)
            setShifts((prev) => prev.map((shift) => (shift.id === id ? mappedShift : shift)))
            setCurrentView("main")
            setEditingShift(null)
        } catch (err) {
            console.error("Error updating shift:", err)
            throw new Error("Failed to update shift")
        }
    }

    const handleDeleteShift = async (id: string) => {
        try {
            setIsDeleting(id)
            await apiService.deleteShift(id)
            setShifts((prev) => prev.filter((shift) => shift.id !== id))
        } catch (err) {
            console.error("Error deleting shift:", err)
            setError("Failed to delete shift. Please try again.")
        } finally {
            setIsDeleting(null)
        }
    }

    const handleEditShift = (shift: Shift) => {
        setEditingShift(shift)
        setCurrentView("edit")
    }

    // Calculate stats with improved logic
    const totalShifts = shifts.length

    // Get today's day name
    const today = new Date()
    const todayDayName = today.toLocaleDateString("en-US", { weekday: "long" })

    // Count shifts for today
    const todayShifts = shifts.filter((shift) => {
        const dayName = todayDayName.toLowerCase();
        return shift.days?.map(d => d.toLowerCase()).includes(dayName) || false
    }).length

    // Weekly shifts (next 7 days including today)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        return date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    })

    const thisWeekShifts = shifts.filter((shift) =>
        shift.days?.some(day => weekDays.includes(day.toLowerCase()))
    ).length

    // Show create form
    if (currentView === "create") {
        return <CreateShiftPage onCreateShift={handleCreateShift} onCancel={() => setCurrentView("main")} />
    }

    // Show edit form
    if (currentView === "edit" && editingShift) {
        return (
            <EditShiftPage
                shift={editingShift}
                onUpdateShift={handleUpdateShift}
                onCancel={() => {
                    setCurrentView("main")
                    setEditingShift(null)
                }}
            />
        )
    }

    return (
        <div className="flex-1 p-6 bg-white min-h-screen">
            <div className="mx-auto space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shift Management</h1>
                            <p className="text-slate-600 leading-relaxed">
                                Organize and manage your team's work schedules with ease. View shifts in calendar format or browse
                                through detailed lists.
                            </p>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert className="mt-4 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500 rounded-lg p-2">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-700">Total Shifts</p>
                                    <p className="text-2xl font-bold text-blue-900">{totalShifts}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-500 rounded-lg p-2">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-700">Today</p>
                                    <p className="text-2xl font-bold text-purple-900">{todayShifts}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500 rounded-lg p-2">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-700">This Week</p>
                                    <p className="text-2xl font-bold text-green-900">{thisWeekShifts}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading shifts...</p>
                        </div>
                    </div>
                ) : (
                    /* Tabs Section */
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b border-slate-200 bg-slate-50">
                                <TabsList className="grid w-full max-w-md grid-cols-2 m-4 h-full bg-white shadow-sm border border-slate-200">
                                    <TabsTrigger
                                        value="calendar"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500
                                   data-[state=active]:to-purple-600 data-[state=active]:text-white
                                   data-[state=active]:shadow-md transition-all duration-200
                                   flex items-center gap-2 py-3"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Calendar View
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="shifts"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500
                                   data-[state=active]:to-purple-600 data-[state=active]:text-white
                                   data-[state=active]:shadow-md transition-all duration-200
                                   flex items-center gap-2 py-3"
                                    >
                                        <List className="w-4 h-4" />
                                        List View
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="calendar" className="p-6 m-0">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-900">Calendar View</h2>
                                            <p className="text-slate-600 text-sm">Visual overview of all scheduled shifts across time</p>
                                        </div>
                                    </div>
                                    <CalendarView shifts={shifts} onCreateShift={() => setCurrentView("create")} />
                                </div>
                            </TabsContent>

                            <TabsContent value="shifts" className="p-6 m-0">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-900">Shifts List</h2>
                                            <p className="text-slate-600 text-sm">
                                                Detailed list view with complete shift information and actions
                                            </p>
                                        </div>
                                    </div>
                                    <ShiftsList
                                        shifts={shifts}
                                        onCreateShift={() => setCurrentView("create")}
                                        onEditShift={handleEditShift}
                                        onDeleteShift={handleDeleteShift}
                                        isDeleting={isDeleting ?? undefined}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    )
}