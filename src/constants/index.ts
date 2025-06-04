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
    { icon: BarChart3, label: "Dashboard", active: false },
    { icon: FileText, label: "Tickets", active: false },
    { icon: Phone, label: "Call Center", active: false },
    { icon: MessageSquare, label: "Social Media", active: false },
    { icon: GitBranch, label: "Collaboration", active: false },
    { icon: Calendar, label: "Work Shifts", active: true },
    { icon: BookOpen, label: "Knowledge Base", active: false },
    { icon: Workflow, label: "Workflow", active: false },
    { icon: BarChart3, label: "Reports", active: false },
    { icon: Users, label: "Users", active: false },
    { icon: Settings, label: "Settings", active: false },
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
