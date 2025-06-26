"use client"

import { useState, useEffect } from "react"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { ScrollArea } from "../../ui/scroll-area"
import { apiService, type ApiSkill} from "../../../services/api"
import { ChevronDown, X, Loader2 } from "lucide-react"

interface SkillsSelectorProps {
    selectedSkillIds: string[]
    onSkillsChange: (skillIds: string[]) => void
}

export default function SkillsSelector({ selectedSkillIds, onSkillsChange }: SkillsSelectorProps) {
    const [skills, setSkills] = useState<ApiSkill[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            setLoading(true)
            setError(null)
            const fetchedSkills = await apiService.getSkills()
            setSkills(fetchedSkills)
        } catch (err) {
            console.error("Error fetching skills:", err)
            setError("Failed to load skills")
        } finally {
            setLoading(false)
        }
    }

    const selectedSkills = skills.filter((skill) => selectedSkillIds.includes(skill.id))

    const handleSkillToggle = (skillId: string) => {
        const newSelectedIds = selectedSkillIds.includes(skillId)
            ? selectedSkillIds.filter((id) => id !== skillId)
            : [...selectedSkillIds, skillId]

        onSkillsChange(newSelectedIds)
    }

    const handleRemoveSkill = (skillId: string) => {
        onSkillsChange(selectedSkillIds.filter((id) => id !== skillId))
    }

    if (loading) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Required Skills</label>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading skills...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Required Skills</label>
                <div className="text-sm text-red-600">{error}</div>
                <Button variant="outline" size="sm" onClick={fetchSkills}>
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Required Skills</label>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                            {skill.name}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                                onClick={() => handleRemoveSkill(skill.id)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Skills Selector */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        {selectedSkills.length === 0
                            ? "Select skills..."
                            : `${selectedSkills.length} skill${selectedSkills.length === 1 ? "" : "s"} selected`}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search skills..." />
                        <CommandList>
                            <CommandEmpty>No skills found.</CommandEmpty>
                            <CommandGroup>
                                <ScrollArea className="h-[200px]">
                                    {skills.map((skill) => (
                                        <CommandItem
                                            key={skill.id}
                                            onSelect={() => handleSkillToggle(skill.id)}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                checked={selectedSkillIds.includes(skill.id)}
                                                onChange={() => handleSkillToggle(skill.id)}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{skill.name}</div>
                                                {skill.description && <div className="text-sm text-gray-500">{skill.description}</div>}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </ScrollArea>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {skills.length === 0 && !loading && (
                <p className="text-sm text-gray-500 italic">No skills available. You can still create shifts without skills.</p>
            )}
        </div>
    )
}
