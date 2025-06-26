"use client"

interface SettingsSidebarProps {
    activeCategory?: string
}

const settingsCategories = [
    { label: "General", href: "/settings/general", key: "general" },
    { label: "Ticket Configuration", href: "/settings/tickets", key: "tickets" },
    { label: "Call Center Settings", href: "/settings/call-center", key: "call-center" },
    { label: "Knowledge Base Config", href: "/settings/knowledge-base", key: "knowledge-base" },
    { label: "Automation Rules", href: "/settings/automation", key: "automation" },
    { label: "AI Assistant Settings", href: "/settings/ai-assistant", key: "ai-assistant" },
    { label: "Skill Management", href: "/settings/skill-management", key: "skill-management" },
    { label: "Integrations", href: "/settings/integrations", key: "integrations" },
    { label: "Email Settings", href: "/settings/email", key: "email" },
    { label: "Security & Access", href: "/settings/security", key: "security" },
    { label: "Notifications", href: "/settings/notifications", key: "notifications" },
    { label: "System Logs", href: "/settings/logs", key: "logs" },
]

export function SettingsSidebar({ activeCategory }: SettingsSidebarProps) {
    return (
        <div className="w-64 bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-900">System Settings</h2>
            </div>

            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Settings Categories</h3>
                <nav className="space-y-1">
                    {settingsCategories.map((category, index) => (
                        <a
                            key={index}
                            href={category.href}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                activeCategory === category.key
                                    ? "bg-purple-50 text-purple-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {category.label}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    )
}
