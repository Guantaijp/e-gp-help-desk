"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "../src/components/layout/Sidebar"
import { SidebarProvider } from "./components/ui/sidebar"
import { SocialMediaDashboard } from "./components/socialmedia/social-media-dashboard"
import Dashboard from "../src/components/dashboard.tsx"
import { useAuth, AuthProvider } from "./hooks/use-auth.tsx"
import { Skeleton } from "./components/ui/skeleton.tsx"
import { LoginForm } from "./components/socialmedia/login-form.tsx"
import ShiftManagement from "./components/shift/ShiftManagement.tsx";
import SettingsPage from "./components/settings/settings-sidebar.tsx";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

// Main App Layout Component
function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="w-full h-screen flex bg-white overflow-hidden">
                <Sidebar className="flex-shrink-0" />
                <main className="flex-1 flex flex-col overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

// App Content Component
function AppContent() {
    const { isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                </div>
            </div>
        )
    }

    return (
        <Routes>
            {/* Login Route */}
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Dashboard />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/social-media"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <SocialMediaDashboard />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/work-shifts"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <ShiftManagement />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <SettingsPage />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            {/*<Route*/}
            {/*    path="/settings/general"*/}
            {/*    element={*/}
            {/*        <ProtectedRoute>*/}
            {/*            <AppLayout>*/}
            {/*                <GeneralSettings />*/}
            {/*            </AppLayout>*/}
            {/*        </ProtectedRoute>*/}
            {/*    }*/}
            {/*/>*/}

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}