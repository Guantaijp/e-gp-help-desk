"use client"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog"

interface AddBreakModalProps {
    isOpen: boolean
    onClose: () => void
    onAddBreak: (breakItem: { name: string; startTime: string; endTime: string }) => void
}

export default function AddBreakModal({ isOpen, onClose, onAddBreak }: AddBreakModalProps) {
    const [breakData, setBreakData] = useState({
        name: "",
        startTime: "12:00",
        endTime: "13:00",
    })

    const handleSubmit = () => {
        if (breakData.name.trim()) {
            onAddBreak(breakData)
            setBreakData({ name: "", startTime: "12:00", endTime: "13:00" })
            onClose()
        }
    }

    const handleCancel = () => {
        setBreakData({ name: "", startTime: "12:00", endTime: "13:00" })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Break</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="breakName">Break Name</Label>
                        <Input
                            id="breakName"
                            value={breakData.name}
                            onChange={(e) => setBreakData({ ...breakData, name: e.target.value })}
                            placeholder="e.g., Lunch Break"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={breakData.startTime}
                                onChange={(e) => setBreakData({ ...breakData, startTime: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={breakData.endTime}
                                onChange={(e) => setBreakData({ ...breakData, endTime: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!breakData.name.trim()} className="bg-blue-600 hover:bg-blue-700">
                        Add Break
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
