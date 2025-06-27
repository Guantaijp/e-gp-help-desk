"use client"
import { TicketConfiguration } from "./ticket-configuration"

export default function TicketConfigurationPage() {
    return (
        <div className="flex h-screen bg-white">
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Ticket Configuration</h1>
                    <TicketConfiguration />
                </div>
            </div>
        </div>
    )
}
