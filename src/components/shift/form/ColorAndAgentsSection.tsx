"use client"

import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { colorOptions } from "../../../constants"
import type { NewShift } from "../../../types/shift.ts"

interface ColorAndAgentsSectionProps {
    shift: NewShift
    onChange: (shift: NewShift) => void
}

export default function ColorAndAgentsSection({ shift, onChange }: ColorAndAgentsSectionProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <Label className="text-base font-medium">Color</Label>
                <div className="flex gap-3 mt-3">
                    {colorOptions.map((color) => (
                        <button
                            key={color}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                shift.color === color ? "border-slate-400 scale-110" : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => onChange({ ...shift, color })}
                        />
                    ))}
                </div>
            </div>
            <div>
                <Label htmlFor="requiredAgents" className="text-base font-medium">
                    Required Agents
                </Label>
                <Input
                    id="requiredAgents"
                    type="number"
                    min="1"
                    value={shift.requiredAgents}
                    onChange={(e) =>
                        onChange({
                            ...shift,
                            requiredAgents: Number.parseInt(e.target.value) || 1,
                        })
                    }
                    className="mt-2"
                />
            </div>
        </div>
    )
}
