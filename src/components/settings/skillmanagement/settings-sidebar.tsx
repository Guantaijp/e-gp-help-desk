"use client"

const settingsCategories = [
    { label: "General", href: "/settings/general" },
    { label: "Ticket Configuration", href: "/settings/tickets" },
    { label: "Call Center Settings", href: "/settings/call-center" },
    { label: "Knowledge Base Config", href: "/settings/knowledge-base" },
    { label: "Automation Rules", href: "/settings/automation" },
    { label: "AI Assistant Settings", href: "/settings/ai-assistant" },
    { label: "Skill Management", href: "/settings/skill-management", active: true },
    { label: "Integrations", href: "/settings/integrations" },
    { label: "Email Settings", href: "/settings/email" },
    { label: "Security & Access", href: "/settings/security" },
    { label: "Notifications", href: "/settings/notifications" },
    { label: "System Logs", href: "/settings/logs" },
]

export function SettingsSidebar() {
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
                                category.active ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-50"
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
