"use client"

import { useState } from "react"
import { SkillsTab } from "./skills-tab"
import { CategoriesTab } from "./categories-tab"
import { SkillTypesTab } from "./skill-types-tab"

const tabs = [
    { id: "skills", label: "Skills" },
    { id: "categories", label: "Categories" },
    { id: "skill-types", label: "Skill Types" },
]

export function SkillManagementTabs() {
    const [activeTab, setActiveTab] = useState("skills")

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
                {activeTab === "skills" && <SkillsTab />}
                {activeTab === "categories" && <CategoriesTab />}
                {activeTab === "skill-types" && <SkillTypesTab />}
            </div>
        </div>
    )
}
