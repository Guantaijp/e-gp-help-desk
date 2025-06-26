"use client"

import { useState, useEffect } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Checkbox } from "../../ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Alert, AlertDescription } from "../../ui/alert"
import { Info, Clock } from "lucide-react"
import { generalSettingsService } from "../../../services/general-settings-service"
import type {
    BusinessDayHours,
    BusinessDaysHours,
    GeneralSettings as GeneralSettingsType
} from "../../../types/general-settings"

const languages = [
    { value: "English", label: "English" },
    { value: "French", label: "French" },
    { value: "Spanish", label: "Spanish" },
    { value: "German", label: "German" },
]

const timeZones = [
    { value: "(UTC+00:00) London", label: "(UTC+00:00) London" },
    { value: "(UTC+01:00) Paris", label: "(UTC+01:00) Paris" },
    { value: "(UTC+03:00) Nairobi", label: "(UTC+03:00) Nairobi" },
    { value: "(UTC+05:00) Karachi", label: "(UTC+05:00) Karachi" },
    { value: "(UTC-05:00) New York", label: "(UTC-05:00) New York" },
]

const daysOfWeek = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
]

const weekDays: (keyof BusinessDaysHours)[] = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]
// Default settings for when no settings exist
const defaultSettings: GeneralSettingsType = {
    systemName: "",
    systemVersion: "",
    defaultLanguage: "English",
    timeZone: "(UTC+03:00) Nairobi",
    ticketNumberFormat: "TIC{year}-{id}",
    employeeIdFormat: "EMP-{year}-{id}",
    firstDayOfWeek: "Monday",
    businessDaysHours: {
        Monday: { start: "08:00", end: "17:00", enabled: true },
        Tuesday: { start: "08:00", end: "17:00", enabled: true },
        Wednesday: { start: "08:00", end: "17:00", enabled: true },
        Thursday: { start: "08:00", end: "17:00", enabled: true },
        Friday: { start: "08:00", end: "17:00", enabled: true },
        Saturday: { start: "09:00", end: "13:00", enabled: false },
        Sunday: { start: "09:00", end: "17:00", enabled: false },
    },
    isActive: true,
}

export function GeneralSettings() {
    const [settings, setSettings] = useState<GeneralSettingsType>(defaultSettings)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isNewSettings, setIsNewSettings] = useState(false) // Track if this is new settings

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            setLoading(true)
            const response = await generalSettingsService.getSettings()
            if (response.data && response.data.length > 0) {
                setSettings(response.data[0])
                setIsNewSettings(false)
            } else {
                // No settings exist, use defaults and mark as new
                setSettings(defaultSettings)
                setIsNewSettings(true)
            }
        } catch (error) {
            console.error("Failed to load settings:", error)
            // On error, also use defaults and mark as new
            setSettings(defaultSettings)
            setIsNewSettings(true)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            if (isNewSettings) {
                // Create new settings
                const response = await generalSettingsService.createSettings(settings)
                if (response.data) {
                    setSettings(response.data)
                    setIsNewSettings(false)
                }
            } else {
                if (!settings.id) {
                    throw new Error("Cannot update settings without an ID.")
                }

                // Update existing settings
                await generalSettingsService.updateSettings(settings)
            }

            // Show success message
            console.log("Settings saved successfully")
        } catch (error) {
            console.error("Failed to save settings:", error)
            // Show error message
        } finally {
            setSaving(false)
        }
    }


    const updateBusinessHours = (
        day: keyof BusinessDaysHours,
        field: keyof BusinessDayHours,
        value: string | boolean
    ) => {
        setSettings((prev) => ({
            ...prev,
            businessDaysHours: {
                ...prev.businessDaysHours,
                [day]: {
                    ...prev.businessDaysHours[day],
                    [field]: value,
                },
            },
        }))
    }

    const calculateDuration = (start: string, end: string) => {
        const startTime = new Date(`2000-01-01T${start}:00`)
        const endTime = new Date(`2000-01-01T${end}:00`)
        const diff = endTime.getTime() - startTime.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        return `${hours}h ${minutes.toString().padStart(2, "0")}m`
    }

    const generatePreview = (format: string, type: "ticket" | "employee") => {
        const currentYear = new Date().getFullYear()
        const sampleId = type === "ticket" ? "00123" : "123"
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0")

        return format.replace("{id}", sampleId).replace("{year}", currentYear.toString()).replace("{month}", currentMonth)
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div className="space-y-6">
            {/* Show indicator if this is new settings */}
            {isNewSettings && (
                <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        No settings found. You are creating new system settings. Please fill in the required fields and save.
                    </AlertDescription>
                </Alert>
            )}

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                System Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={settings.systemName}
                                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                placeholder="Enter system name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                System Version <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={settings.systemVersion}
                                onChange={(e) => setSettings({ ...settings, systemVersion: e.target.value })}
                                placeholder="Enter version"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Default Language <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={settings.defaultLanguage}
                                onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Time Zone <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={settings.timeZone}
                                onValueChange={(value) => setSettings({ ...settings, timeZone: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeZones.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ticket Number Format <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 items-center">
                            <Input
                                value={settings.ticketNumberFormat}
                                onChange={(e) => setSettings({ ...settings, ticketNumberFormat: e.target.value })}
                                placeholder="TIC{year}-{id}"
                                className="flex-1"
                            />
                            <div className="text-sm text-purple-600 font-medium">
                                Preview: {generatePreview(settings.ticketNumberFormat, "ticket")}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Available placeholders: {"{id}"} (ticket ID), {"{year}"} (current year), {"{month}"} (current month)
                        </p>
                        <Alert className="mt-2 bg-purple-50">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                The ticket number format will be used to generate unique identifiers for all tickets in the system. Make
                                sure to include the {"{id}"} placeholder which will be replaced with the actual ticket ID.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employee ID Format <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 items-center">
                            <Input
                                value={settings.employeeIdFormat}
                                onChange={(e) => setSettings({ ...settings, employeeIdFormat: e.target.value })}
                                placeholder="EMP-{year}-{id}"
                                className="flex-1"
                            />
                            <div className="text-sm text-purple-600 font-medium">
                                Preview: {generatePreview(settings.employeeIdFormat, "employee")}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Available placeholders: {"{id}"} (employee ID), {"{year}"} (current year), {"{month}"} (current month)
                        </p>
                        <Alert className="mt-2 bg-purple-50">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                The employee ID format will be used to generate unique identifiers for all employees in the system. Make
                                sure to include the {"{id}"} placeholder which will be replaced with the actual employee ID.
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>

            {/* Business Days & Hours */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Days & Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Day of Week <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4 items-center">
                            <Select
                                value={settings.firstDayOfWeek}
                                onValueChange={(value) => setSettings({ ...settings, firstDayOfWeek: value })}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {daysOfWeek.map((day) => (
                                        <SelectItem key={day.value} value={day.value}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Alert className="flex-1 bg-purple-50">
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    This setting determines which day appears first in calendars and weekly views throughout the system.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Set Working Days and Hours <span className="text-red-500">*</span>
                        </label>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Day</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-900">Enabled</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-900">Start Time</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-900">End Time</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-900">Duration</th>
                                </tr>
                                </thead>
                                <tbody>
                                {weekDays.map((day) => {
                                    const daySettings = settings.businessDaysHours[day]
                                    const isEnabled = daySettings.enabled
                                    return (
                                        <tr key={day} className="border-t">
                                            <td className="py-3 px-4 font-medium text-gray-900">{day}</td>
                                            <td className="py-3 px-4 text-center">
                                                <Checkbox
                                                    checked={isEnabled}
                                                    onCheckedChange={(checked) => updateBusinessHours(day, "enabled", checked as boolean)}
                                                    className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <Input
                                                        type="time"
                                                        value={daySettings.start}
                                                        onChange={(e) => updateBusinessHours(day, "start", e.target.value)}
                                                        className="w-24 text-center"
                                                        disabled={!isEnabled}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <Input
                                                        type="time"
                                                        value={daySettings.end}
                                                        onChange={(e) => updateBusinessHours(day, "end", e.target.value)}
                                                        className="w-24 text-center"
                                                        disabled={!isEnabled}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-medium ${isEnabled ? "text-purple-600" : "text-gray-400"}`}>
                            {isEnabled ? calculateDuration(daySettings.start, daySettings.end) : "-"}
                          </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                        <Alert className="mt-3 bg-purple-50">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                These business hours settings will be enforced when creating new work shifts and for call center
                                operations.
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => loadSettings()} disabled={saving}>
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-purple-500 hover:bg-purple-600">
                    {saving ? "Saving..." : isNewSettings ? "Create Settings" : "Save Changes"}
                </Button>
            </div>
        </div>
    )
}