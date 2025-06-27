"use client"
import { SkillManagementTabs } from "./skill-management-tabs.tsx"
// import { SettingsSidebar } from "../settings-sidebar.tsx"

export default function SkillManagementPage() {
    return (
        <div className="flex h-screen ">
            {/*<SettingsSidebar />*/}
            <div className="flex-1 p-6">
                <div className="max-w-7xl">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Skill Management</h1>
                    <SkillManagementTabs />
                </div>
            </div>
        </div>
    )
}
