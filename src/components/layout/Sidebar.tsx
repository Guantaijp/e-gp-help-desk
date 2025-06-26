import { ChevronLeft } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
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
} from "../ui/sidebar.tsx"

export default function AppSidebar(props: any) {
    const location = useLocation()

    return (
        <Sidebar variant="inset" {...props} className='max-w-[250px]' >
            <SidebarHeader>
                <div className="flex items-center space-x-2 px-2 py-2">
                    <ChevronLeft className="w-4 h-4" />
                    <h1 className="font-semibold">e-GP Help Desk</h1>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItems.map((item, index) => {
                                const isActive = location.pathname === item.url
                                return (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.url}
                                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                                                    isActive
                                                        ? "bg-purple-500 text-white"
                                                        : "text-black hover:bg-[#7f4bf7] hover:text-white"
                                                }`}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="flex items-center gap-2 px-4 py-2 border-t border-slate-700">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        P
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium truncate">Peter</div>
                        <div className="text-xs text-slate-400">admin</div>
                    </div>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
