"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import ShiftOverviewPage from "./ShiftOverviewPage"
import ShiftEscalationPage from "./ShiftEscalationPage"
import ShiftTeamMembersPage from "./ShiftTeamMembersPage"
import type { Shift } from "../../types/shift"

interface ViewShiftPageProps {
    shift: Shift
    onEdit: () => void
    onDelete: () => Promise<void>
    onBack: () => void
    isDeleting?: boolean
}

export default function ViewShiftPage({ shift, onEdit, onDelete, onBack, isDeleting = false }: ViewShiftPageProps) {
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <div className="flex-1 p-6 bg-white min-h-screen">
            <div className="max-w-8xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Shifts
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onEdit}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Shift
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" disabled={isDeleting}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{shift.name}"? This action cannot be undone and will remove all
                                        associated schedules.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                                        Delete Shift
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Shift Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: shift.color }} />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{shift.name}</h1>
                        {shift.description && <p className="text-gray-600 mt-1">{shift.description}</p>}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="escalation" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                            Escalation Path
                        </TabsTrigger>
                        <TabsTrigger value="team" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                            Team Members
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <ShiftOverviewPage shift={shift} />
                    </TabsContent>

                    <TabsContent value="escalation">
                        <ShiftEscalationPage shift={shift} />
                    </TabsContent>

                    <TabsContent value="team">
                        <ShiftTeamMembersPage shift={shift} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
