"use client"
import { useState } from 'react'
import GeneralSettingsPage from "./general-settings/MainGeneralSettings.tsx";
import SkillManagementPage from "./skillmanagement/MainSkillManagement.tsx";
import TicketConfigurationPage from "./ticket-configuration/MainTicketConfiguration.tsx";


const CallCenterSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Call Center Settings</h3>
            <p className="text-gray-600">Manage call center configurations and settings.</p>
        </div>
    </div>
)

const KnowledgeBaseSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Knowledge Base Configuration</h3>
            <p className="text-gray-600">Configure knowledge base settings and content.</p>
        </div>
    </div>
)

const AutomationSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Automation Rules</h3>
            <p className="text-gray-600">Set up automation rules and workflows.</p>
        </div>
    </div>
)

const AIAssistantSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">AI Assistant Settings</h3>
            <p className="text-gray-600">Configure AI assistant behavior and settings.</p>
        </div>
    </div>
)



const IntegrationsSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Integrations</h3>
            <p className="text-gray-600">Configure third-party integrations.</p>
        </div>
    </div>
)

const EmailSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Email Settings</h3>
            <p className="text-gray-600">Configure email settings and templates.</p>
        </div>
    </div>
)

const SecuritySettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Security & Access</h3>
            <p className="text-gray-600">Manage security settings and access controls.</p>
        </div>
    </div>
)

const NotificationSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Notifications</h3>
            <p className="text-gray-600">Configure notification preferences and settings.</p>
        </div>
    </div>
)

const SystemLogsSettings = () => (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">System Logs</h3>
            <p className="text-gray-600">View and manage system logs and audit trails.</p>
        </div>
    </div>
)

interface SettingsSidebarProps {
    activeCategory: string
    onCategoryChange: (category: string) => void
    isMobileMenuOpen?: boolean
    onMobileMenuClose?: () => void
}

const settingsCategories = [
    { label: "General", key: "general" },
    { label: "Ticket Configuration", key: "tickets" },
    { label: "Call Center Settings", key: "call-center" },
    { label: "Knowledge Base Config", key: "knowledge-base" },
    { label: "Automation Rules", key: "automation" },
    { label: "AI Assistant Settings", key: "ai-assistant" },
    { label: "Skill Management", key: "skill-management" },
    { label: "Integrations", key: "integrations" },
    { label: "Email Settings", key: "email" },
    { label: "Security & Access", key: "security" },
    { label: "Notifications", key: "notifications" },
    { label: "System Logs", key: "logs" },
]

function SettingsSidebar({ activeCategory, onCategoryChange, isMobileMenuOpen, onMobileMenuClose }: SettingsSidebarProps) {
    return (
        <>
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileMenuClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:justify-start">
                    <h2 className="font-semibold text-lg text-gray-900">System Settings</h2>
                    {/* Close button for mobile */}
                    <button
                        onClick={onMobileMenuClose}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Settings Categories</h3>
                    <nav className="space-y-1">
                        {settingsCategories.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => {
                                    onCategoryChange(category.key)
                                    onMobileMenuClose?.()
                                }}
                                className={`w-full text-left block px-3 py-2 text-sm rounded-md transition-colors ${
                                    activeCategory === category.key
                                        ? "bg-purple-50 text-purple-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    )
}

export default function SettingsPage() {
    const [activeCategory, setActiveCategory] = useState("general")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const renderContent = () => {
        switch (activeCategory) {
            case "general":
                return <GeneralSettingsPage />
            case "tickets":
                return <TicketConfigurationPage />
            case "call-center":
                return <CallCenterSettings />
            case "knowledge-base":
                return <KnowledgeBaseSettings />
            case "automation":
                return <AutomationSettings />
            case "ai-assistant":
                return <AIAssistantSettings />
            case "skill-management":
                return <SkillManagementPage />
            case "integrations":
                return <IntegrationsSettings />
            case "email":
                return <EmailSettings />
            case "security":
                return <SecuritySettings />
            case "notifications":
                return <NotificationSettings />
            case "logs":
                return <SystemLogsSettings />
            default:
                return <GeneralSettingsPage />
        }
    }

    // const getCurrentTitle = () => {
    //     const category = settingsCategories.find(cat => cat.key === activeCategory)
    //     return category ? category.label : "General Settings"
    // }

    return (
        <div className="flex h-screen bg-white">
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white border shadow-sm"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <SettingsSidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 p-6  lg:p-6 pt-8 lg:pt-1">
                <div className="">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}