"use client"

import BasicInfoSection from "./BasicInfoSection"
import ColorAndAgentsSection from "./ColorAndAgentsSection"
import WorkingDaysSection from "./WorkingDaysSection"
import TimeSection from "./TimeSection"
import AdvancedSection from "./AdvancedSection"
import type { NewShift } from "../../../types/shift.ts"

interface ShiftFormProps {
    shift: NewShift
    onChange: (shift: NewShift) => void
}

export default function ShiftForm({ shift, onChange }: ShiftFormProps) {
    return (
        <div className="grid gap-8">
            <BasicInfoSection shift={shift} onChange={onChange} />
            <ColorAndAgentsSection shift={shift} onChange={onChange} />
            <WorkingDaysSection shift={shift} onChange={onChange} />
            <TimeSection shift={shift} onChange={onChange} />
            <AdvancedSection />
        </div>
    )
}
