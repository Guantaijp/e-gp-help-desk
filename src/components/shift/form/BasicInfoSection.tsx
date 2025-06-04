"use client"

import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import type { NewShift } from "../../../types/shift.ts"

interface BasicInfoSectionProps {
    shift: NewShift
    onChange: (shift: NewShift) => void
}

export default function BasicInfoSection({ shift, onChange }: BasicInfoSectionProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <Label htmlFor="shiftName" className="text-base font-medium">
                    Shift Name
                </Label>
                <Input
                    id="shiftName"
                    placeholder="Enter shift name"
                    value={shift.name}
                    onChange={(e) => onChange({ ...shift, name: e.target.value })}
                    className="mt-2"
                />
            </div>
            <div>
                <Label htmlFor="description" className="text-base font-medium">
                    Description (Optional)
                </Label>
                <Textarea
                    id="description"
                    placeholder="Brief description"
                    value={shift.description}
                    onChange={(e) => onChange({ ...shift, description: e.target.value })}
                    className="mt-2"
                />
            </div>
        </div>
    )
}
