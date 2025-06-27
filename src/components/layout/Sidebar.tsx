"use client"

import { Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { sidebarItems } from "../../constants"
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
} from "../ui/sidebar"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"

interface AppSidebarProps {
    className?: string
    [key: string]: any
}

export default function AppSidebar(props: AppSidebarProps) {
    const location = useLocation()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm border shadow-sm"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <Sidebar
                variant="inset"
                {...props}
                className={`
                    fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:sticky lg:z-auto
                    border-r bg-white/95 backdrop-blur-sm
                    ${props.className || ""}
                `}
            >
                <SidebarHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0 z-10">
                    <div className="flex items-center justify-between px-4 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">eGP</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 text-sm">e-GP Help Desk</h1>
                                <p className="text-xs text-gray-500">Management Portal</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-8 w-8"
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </SidebarHeader>

                <SidebarContent className="px-2 py-4 flex-1 overflow-y-auto">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {sidebarItems.map((item, index) => {
                                    const isActive = location.pathname === item.url
                                    return (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    to={item.url}
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`
                                                        group flex items-center space-x-3 px-3 py-2.5 rounded-xl 
                                                        transition-all duration-200 ease-in-out
                                                        hover:scale-[1.02] active:scale-[0.98]
                                                        ${
                                                        isActive
                                                            ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                                    }
                                                    `}
                                                >
                                                    <item.icon
                                                        className={`
                                                        w-5 h-5 transition-transform duration-200
                                                        ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}
                                                        group-hover:scale-110
                                                    `}
                                                    />
                                                    <span className="font-medium text-sm">{item.label}</span>
                                                    {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t bg-gray-50/50 p-4 sticky bottom-0">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-purple-100">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                                P
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 truncate">Peter</p>
                                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                    Admin
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-500">System Administrator</p>
                        </div>
                    </div>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
        </>
    )
}