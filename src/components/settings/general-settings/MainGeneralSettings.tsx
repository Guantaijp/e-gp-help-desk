"use client"
import { GeneralSettings } from "./general-settings"
import { SettingsSidebar } from "../settings-sidebar"

export default function GeneralSettingsPage() {
    return (
        <div className="flex h-screen bg-whire">
            <SettingsSidebar activeCategory="general" />
            <div className="flex-1 p-6 overflow-auto">
                <div className="">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">General Settings</h1>
                    <GeneralSettings />
                </div>
            </div>
        </div>
    )
}
