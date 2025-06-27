import {
    BarChart3,
    FileText,
    Phone,
    MessageSquare,
    GitBranch,
    Calendar,
    BookOpen,
    Workflow,
    Settings,
    Users,
} from "lucide-react"

export const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", url: "/dashboard" },
    { icon: FileText, label: "Tickets", url: "/tickets" },
    { icon: Phone, label: "Call Center", url: "/call-center" },
    { icon: MessageSquare, label: "Social Media", url: "/social-media" },
    { icon: GitBranch, label: "Collaboration", url: "/collaboration" },
    { icon: Calendar, label: "Work Shifts", url: "/work-shifts" },
    { icon: BookOpen, label: "Knowledge Base", url: "/knowledge-base" },
    { icon: Workflow, label: "Workflow", url: "/workflow" },
    { icon: BarChart3, label: "Reports", url: "/reports" },
    { icon: Users, label: "Users", url: "/users" },
    { icon: Settings, label: "Settings", url: "/settings" },
]

export const colorOptions = ["#22d3ee", "#f472b6", "#a78bfa", "#fb7185", "#fbbf24", "#94a3b8", "#f87171", "#60a5fa"]

export const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]
