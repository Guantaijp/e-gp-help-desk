import { ChevronLeft } from "lucide-react"
import { sidebarItems } from "../../constants"

export default function Sidebar() {
    return (
        <div className="w-64 bg-slate-800 text-white flex flex-col h-screen fixed left-0 top-0 z-10">
            <div className="p-4 border-b border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <h1 className="font-semibold">e-GP Help Desk</h1>
                </div>
            </div>

            <nav className="flex-1 p-2 overflow-y-auto">
                <div className="space-y-1">
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                item.active ? "bg-green-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                            }`}
                        >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">{item.label}</span>
                        </div>
                    ))}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        P
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium truncate">Peter</div>
                        <div className="text-xs text-slate-400">admin</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
