"use client"

import { useState } from "react"
import { StatusTab } from "./status-tab"
import { PriorityTab } from "./priority-tab"
import { CategoriesTab } from "./categories-tab"
import { FieldsTab } from "./fields-tab"

const tabs = [
    { id: "status", label: "Status" },
    { id: "priority", label: "Priority" },
    { id: "categories", label: "Categories" },
    { id: "fields", label: "Fields" },
]

export function TicketConfiguration() {
    const [activeTab, setActiveTab] = useState("status")

    return (
        <div>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? "border-purple-500 text-purple-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === "status" && <StatusTab />}
                {activeTab === "priority" && <PriorityTab />}
                {activeTab === "categories" && <CategoriesTab />}
                {activeTab === "fields" && <FieldsTab />}
            </div>
        </div>
    )
}
