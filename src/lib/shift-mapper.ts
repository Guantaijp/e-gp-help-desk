import type { ApiShift, CreateShiftRequest } from '../services/api'
import type {  NewShift } from '../types/shift'

export function mapApiShiftToShift(apiShift: ApiShift) {
    const schedule = apiShift.schedule || { startTime: "", endTime: "" };

    return {
        id: apiShift.id,
        name: apiShift.name,
        description: apiShift.description || '',
        color: apiShift.color,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        days: (apiShift.days || []).map(day => day.toLowerCase()),
        agentCount: apiShift.agentCount,
        breaks: apiShift.breaks || [],
        skills: apiShift.skills || [],
        agents: apiShift.agents || [],
        settings: apiShift.settings
    };
}


export function mapNewShiftToCreateRequest(newShift: NewShift): CreateShiftRequest {
    return {
        name: newShift.name,
        description: newShift.description,
        color: newShift.color,
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        days: newShift.days,
        agentCount: newShift.agentCount,
        breaks: newShift.breaks,
        skillIds: newShift.skillIds || [],
        agentIds: newShift.agentIds || [],
        validateBusinessHours: newShift.validateBusinessHours,
        advancedSettings: newShift.advancedSettings
    }
}