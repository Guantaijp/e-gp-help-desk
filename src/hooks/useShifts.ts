"use client"

import { useState, useEffect } from "react"
import { apiService, type ApiShift, type CreateShiftRequest } from "../services/api"
import type { Shift } from "../types/shift"

// Convert API shift to frontend shift format
const convertApiShiftToShift = (apiShift: ApiShift): Shift => ({
    id: apiShift.id,
    name: apiShift.name,
    description: apiShift.description || "",
    color: apiShift.color,
    startTime: apiShift.startTime,
    endTime: apiShift.endTime,
    days: apiShift.days,
    requiredAgents: apiShift.requiredAgents,
})

// Convert frontend shift to API format
const convertShiftToApiRequest = (shift: Omit<Shift, "id">): CreateShiftRequest => ({
    name: shift.name,
    description: shift.description || undefined,
    color: shift.color,
    startTime: shift.startTime,
    endTime: shift.endTime,
    days: shift.days,
    requiredAgents: shift.requiredAgents,
})

export function useShifts() {
    const [shifts, setShifts] = useState<Shift[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchShifts = async () => {
        try {
            setLoading(true)
            setError(null)
            const apiShifts = await apiService.getShifts()
            const convertedShifts = apiShifts.map(convertApiShiftToShift)
            setShifts(convertedShifts)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch shifts")
            console.error("Error fetching shifts:", err)
        } finally {
            setLoading(false)
        }
    }

    const createShift = async (shiftData: Omit<Shift, "id">): Promise<Shift> => {
        try {
            setError(null)
            const apiRequest = convertShiftToApiRequest(shiftData)
            const apiShift = await apiService.createShift(apiRequest)
            const newShift = convertApiShiftToShift(apiShift)
            setShifts((prev) => [newShift, ...prev])
            return newShift
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create shift"
            setError(errorMessage)
            throw new Error(errorMessage)
        }
    }

    const updateShift = async (id: string, shiftData: Partial<Omit<Shift, "id">>): Promise<Shift> => {
        try {
            setError(null)
            const apiRequest = convertShiftToApiRequest(shiftData as Omit<Shift, "id">)
            const apiShift = await apiService.updateShift(id, apiRequest)
            const updatedShift = convertApiShiftToShift(apiShift)
            setShifts((prev) => prev.map((shift) => (shift.id === id ? updatedShift : shift)))
            return updatedShift
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update shift"
            setError(errorMessage)
            throw new Error(errorMessage)
        }
    }

    const deleteShift = async (id: string): Promise<void> => {
        try {
            setError(null)
            await apiService.deleteShift(id)
            setShifts((prev) => prev.filter((shift) => shift.id !== id))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete shift"
            setError(errorMessage)
            throw new Error(errorMessage)
        }
    }

    useEffect(() => {
        fetchShifts()
    }, [])

    return {
        shifts,
        loading,
        error,
        createShift,
        updateShift,
        deleteShift,
        refetch: fetchShifts,
    }
}
