"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Badge } from "../../ui/badge"
import { AddCategoryModal } from "./modals/add-category-modal"
import { skillService } from "../../../services/skill-service"
import type { Category } from "../../../types/skill-management"
import {EditCategoryModal} from "./modals/edit-category-modal.tsx";

export function CategoriesTab() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [loading, setLoading] = useState(true)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            const response = await skillService.getCategories()
            setCategories(response.data)
        } catch (error) {
            console.error("Failed to load categories:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCategory = async (categoryData: any) => {
        try {
            await skillService.createCategory(categoryData)
            await loadCategories()
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Failed to create category:", error)
        }
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setIsEditModalOpen(true)
    }

    const handleUpdateCategory = async (categoryData: any) => {
        try {
            if (editingCategory) {
                await skillService.updateCategory(editingCategory.id, categoryData)
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
                await skillService.deleteCategory(categoryId)
                await loadCategories()
            } catch (error) {
                console.error("Failed to delete category:", error)
            }
        }
    }

    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || category.status === statusFilter
        return matchesSearch && matchesStatus
    })

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Skill Categories</h2>
                    <p className="text-sm text-gray-600 mt-1">Organize skills into logical categories for better management.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search categories..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                {filteredCategories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Category Name</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900 font-medium">{category.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{category.description}</td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            variant={category.status === "active" ? "default" : "secondary"}
                                            className={category.status === "active" ? "bg-green-100 text-green-800" : ""}
                                        >
                                            {category.status}
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
                            {searchTerm || statusFilter !== "all"
                                ? "No categories found matching your filters."
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

