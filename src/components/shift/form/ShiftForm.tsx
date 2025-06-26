"use client"

import { useState } from "react"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import SkillsSelector from "./SkillsSelector"
import type { NewShift } from "../../../types/shift"

interface ShiftFormProps {
    shift: NewShift
    onChange: (shift: NewShift) => void
}

const colorOptions = [
    "#22d3ee", // cyan
    "#f87171", // red
    "#93c5fd", // blue
    "#c084fc", // purple
    "#fde047", // yellow
    "#d1d5db", // gray
    "#f9a8d4", // pink
    "#a5b4fc", // indigo
]

const dayOptions = [
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
]

export default function ShiftForm({ shift, onChange }: ShiftFormProps) {
    const [showAdvanced, setShowAdvanced] = useState(false)

    const updateShift = (updates: Partial<NewShift>) => {
        onChange({ ...shift, ...updates })
    }

    const updateAdvancedSettings = (updates: Partial<NewShift["advancedSettings"]>) => {
        onChange({
            ...shift,
            advancedSettings: { ...shift.advancedSettings, ...updates },
        })
    }

    const updateNotifications = (updates: Partial<NewShift["advancedSettings"]["notifications"]>) => {
        updateAdvancedSettings({
            notifications: { ...shift.advancedSettings.notifications, ...updates },
        })
    }

    const updateCoverRequests = (updates: Partial<NewShift["advancedSettings"]["coverRequests"]>) => {
        updateAdvancedSettings({
            coverRequests: { ...shift.advancedSettings.coverRequests, ...updates },
        })
    }

    const handleDayToggle = (day: string) => {
        const newDays = shift.days.includes(day) ? shift.days.filter((d) => d !== day) : [...shift.days, day]
        updateShift({ days: newDays })
    }

    const addBreak = () => {
        const newBreak = {
            name: `Break ${shift.breaks.length + 1}`,
            startTime: "12:00",
            endTime: "13:00",
        }
        updateShift({ breaks: [...shift.breaks, newBreak] })
    }

    const updateBreak = (index: number, updates: Partial<(typeof shift.breaks)[0]>) => {
        const newBreaks = [...shift.breaks]
        newBreaks[index] = { ...newBreaks[index], ...updates }
        updateShift({ breaks: newBreaks })
    }

    const removeBreak = (index: number) => {
        updateShift({ breaks: shift.breaks.filter((_, i) => i !== index) })
    }

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Shift Name</label>
                    <Input
                        placeholder="Enter shift name"
                        value={shift.name}
                        onChange={(e) => updateShift({ name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                    <Textarea
                        placeholder="Brief description"
                        value={shift.description}
                        onChange={(e) => updateShift({ description: e.target.value })}
                        className="min-h-[40px]"
                    />
                </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Color</label>
                <div className="flex gap-2">
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                                shift.color === color ? "border-gray-400" : "border-gray-200"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateShift({ color })}
                        />
                    ))}
                </div>
            </div>

            {/* Required Agents */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Required Agents</label>
                <Input
                    type="number"
                    min="1"
                    value={shift.agentCount}
                    onChange={(e) => updateShift({ agentCount: Number.parseInt(e.target.value) || 1 })}
                    className="w-32"
                />
            </div>

            {/* Working Days */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Working Days</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dayOptions.map((day) => (
                        <div
                            key={day.value}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                shift.days.includes(day.value) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleDayToggle(day.value)}
                        >
                            <div className="font-medium text-sm">{day.label}</div>
                            <div className="text-xs text-gray-500">
                                {shift.startTime} - {shift.endTime}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                    <Input type="time" value={shift.startTime} onChange={(e) => updateShift({ startTime: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Time</label>
                    <Input type="time" value={shift.endTime} onChange={(e) => updateShift({ endTime: e.target.value })} />
                </div>
            </div>

            {/* Validate Business Hours */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="validate-hours"
                    checked={shift.validateBusinessHours}
                    onCheckedChange={(checked) => updateShift({ validateBusinessHours: !!checked })}
                />
                <label htmlFor="validate-hours" className="text-sm text-gray-700">
                    Validate shift times against business hours
                </label>
            </div>

            {/* Breaks */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Breaks</label>
                    <Button type="button" variant="outline" size="sm" onClick={addBreak}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Break
                    </Button>
                </div>
                {shift.breaks.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No breaks added yet</p>
                ) : (
                    <div className="space-y-2">
                        {shift.breaks.map((breakItem, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                                <Input
                                    placeholder="Break name"
                                    value={breakItem.name}
                                    onChange={(e) => updateBreak(index, { name: e.target.value })}
                                    className="flex-1"
                                />
                                <Input
                                    type="time"
                                    value={breakItem.startTime}
                                    onChange={(e) => updateBreak(index, { startTime: e.target.value })}
                                    className="w-32"
                                />
                                <span className="text-gray-500">to</span>
                                <Input
                                    type="time"
                                    value={breakItem.endTime}
                                    onChange={(e) => updateBreak(index, { endTime: e.target.value })}
                                    className="w-32"
                                />
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeBreak(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills Selector */}
            <SkillsSelector selectedSkillIds={shift.skillIds} onSkillsChange={(skillIds) => updateShift({ skillIds })} />

            {/* Advanced Settings */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto text-blue-600">
                        {showAdvanced ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Hide Advanced Settings
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Show Advanced Settings
                            </>
                        )}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Recurrence</label>
                            <Select
                                value={shift.advancedSettings.recurrence}
                                onValueChange={(value) => updateAdvancedSettings({ recurrence: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="once">Once</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Overlap (minutes)</label>
                            <Input
                                type="number"
                                min="0"
                                value={shift.advancedSettings.overlapMinutes}
                                onChange={(e) => updateAdvancedSettings({ overlapMinutes: Number.parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Send Email Notifications</label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="notify-assignment"
                                        checked={shift.advancedSettings.notifications.notifyAgentsOnAssignment}
                                        onCheckedChange={(checked) => updateNotifications({ notifyAgentsOnAssignment: !!checked })}
                                    />
                                    <label htmlFor="notify-assignment" className="text-sm text-gray-700">
                                        Notify agents when assigned to this shift
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Send Reminders</label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="send-reminders"
                                        checked={shift.advancedSettings.notifications.sendReminders}
                                        onCheckedChange={(checked) => updateNotifications({ sendReminders: !!checked })}
                                    />
                                    <label htmlFor="send-reminders" className="text-sm text-gray-700">
                                        Send reminders before shift starts
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Allow Cover Requests</label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="allow-cover"
                                        checked={shift.advancedSettings.coverRequests.allowCoverRequests}
                                        onCheckedChange={(checked) => updateCoverRequests({ allowCoverRequests: !!checked })}
                                    />
                                    <label htmlFor="allow-cover" className="text-sm text-gray-700">
                                        Allow agents to request shift coverage
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Auto-approve Cover Requests</label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="auto-approve"
                                        checked={shift.advancedSettings.coverRequests.autoApproveCoverRequests}
                                        onCheckedChange={(checked) => updateCoverRequests({ autoApproveCoverRequests: !!checked })}
                                    />
                                    <label htmlFor="auto-approve" className="text-sm text-gray-700">
                                        Automatically approve coverage requests
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}
