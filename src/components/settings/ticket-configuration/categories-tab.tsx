"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"
import { Switch } from "../../ui/switch"
// import { AddCategoryModal } from "./modals/add-category-modal"
// import { EditCategoryModal } from "./modals/edit-category-modal"
import { ticketConfigService } from "../../../services/ticket-config-service"
import type { TicketCategory } from "../../../types/ticket-configuration"
import {AddCategoryModal} from "./modals/add-category-modal.tsx";
import {EditCategoryModal} from "./modals/edit-category-modal.tsx";

export function CategoriesTab() {
    const [categories, setCategories] = useState<TicketCategory[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            const response = await ticketConfigService.getCategories()
            setCategories(response.data)
        } catch (error) {
            console.error("Failed to load categories:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCategory = async (categoryData: any) => {
        try {
            await ticketConfigService.createCategory(categoryData)
            await loadCategories()
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Failed to create category:", error)
        }
    }

    const handleEditCategory = (category: TicketCategory) => {
        setEditingCategory(category)
        setIsEditModalOpen(true)
    }

    const handleUpdateCategory = async (categoryData: any) => {
        try {
            if (editingCategory) {
                await ticketConfigService.updateCategory(editingCategory.id, categoryData)
                await loadCategories()
                setIsEditModalOpen(false)
                setEditingCategory(null)
            }
        } catch (error) {
            console.error("Failed to update category:", error)
        }
    }

    const handleDeleteCategory = async (categoryId: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await ticketConfigService.deleteCategory(categoryId)
                await loadCategories()
            } catch (error) {
                console.error("Failed to delete category:", error)
            }
        }
    }

    const handleToggleCategory = async (category: TicketCategory) => {
        try {
            await ticketConfigService.updateCategory(category.id, { ...category, enabled: !category.enabled })
            await loadCategories()
        } catch (error) {
            console.error("Failed to toggle category:", error)
        }
    }

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Category Management</h2>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Filter categories..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                {filteredCategories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Category Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Parent Category</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900 font-medium">{category.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{category.description}</td>
                                    <td className="py-3 px-4 text-gray-600">{category.parent || "None"}</td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            variant={category.enabled ? "default" : "secondary"}
                                            className={category.enabled ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {category.enabled ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteCategory(category.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Switch
                                                checked={category.enabled}
                                                onCheckedChange={() => handleToggleCategory(category)}
                                                className="data-[state=checked]:bg-purple-500"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {searchTerm
                                ? "No categories found matching your search."
                                : 'No categories found. Click "Add Category" to create one.'}
                        </p>
                    </div>
                )}
            </div>

            <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddCategory} />
            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingCategory(null)
                }}
                onSubmit={handleUpdateCategory}
                category={editingCategory}
            />
        </div>
    )
}
