"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { AlertTriangle, Phone, Mail } from "lucide-react"
import type { Shift } from "../../types/shift"

interface ShiftEscalationPageProps {
    shift: Shift
}

export default function ShiftEscalationPage({ shift }: ShiftEscalationPageProps) {
    console.log("ShiftEscalationPage", shift)
    // Mock escalation path data - replace with actual data from your API
    const escalationPath = [
        {
            level: 1,
            title: "Team Lead",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            phone: "+1 (555) 123-4567",
            responseTime: "15 minutes",
        },
        {
            level: 2,
            title: "Shift Supervisor",
            name: "Mike Chen",
            email: "mike.chen@company.com",
            phone: "+1 (555) 234-5678",
            responseTime: "30 minutes",
        },
        {
            level: 3,
            title: "Operations Manager",
            name: "Lisa Rodriguez",
            email: "lisa.rodriguez@company.com",
            phone: "+1 (555) 345-6789",
            responseTime: "1 hour",
        },
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Escalation Path
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Contact hierarchy for issues and emergencies during this shift</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {escalationPath.map((contact, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-orange-700">{contact.level}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{contact.title}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                Response: {contact.responseTime}
                                            </Badge>
                                        </div>
                                        <p className="text-base font-medium text-gray-800 mb-2">{contact.name}</p>
                                        <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                                                    {contact.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                                                    {contact.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {index < escalationPath.length - 1 && (
                                    <div className="flex justify-center py-2">
                                        <div className="w-px h-4 bg-gray-300"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
