"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/button.tsx"

interface HeaderProps {
    title: string
    subtitle: string
    showBackButton?: boolean
    onBack?: () => void
}

export default function Header({ title, subtitle, showBackButton, onBack }: HeaderProps) {
    return (
        <div className="bg-white border-b p-6">
            <div className="flex items-center gap-4">
                {showBackButton && (
                    <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                )}
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <p className="text-slate-600 mt-1">{subtitle}</p>
                </div>
            </div>
        </div>
    )
}
