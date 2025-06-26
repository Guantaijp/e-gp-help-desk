"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx"
import { FacebookManager } from "./facebook-manager"
import { InstagramManager } from "./instagram-manager"
import {Facebook, Instagram, Users, TrendingUp, LogOut, MessageCircle, Phone} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx"
import {useEffect, useState } from "react"
import { metaApiClient } from "../../services/meta-api.ts"
import { useAuth } from "../../hooks/use-auth.tsx"
import { Skeleton } from "../ui/skeleton.tsx"
import {Button} from "../ui/button.tsx";
import {MessengerManager} from "./messenger-manager.tsx";
import {WhatsAppManager} from "./whatsapp-manager.tsx";
import {toast} from "sonner";


interface DashboardStats {
    totalAccounts: number
    facebookAccounts: number
    instagramAccounts: number
    publishedPosts: number
    draftPosts: number
    engagement: number
    postsThisWeek: number
    engagementChange: number
}

export function SocialMediaDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { logout, user } = useAuth()

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            setIsLoading(true)
            const data = await metaApiClient.getDashboardStats()
            setStats(data)
        } catch (error) {
            toast("Error",{
                description: "Failed to fetch dashboard statistics",
            })
            // Fallback to default stats if API fails
            setStats({
                totalAccounts: 0,
                facebookAccounts: 0,
                instagramAccounts: 0,
                publishedPosts: 0,
                draftPosts: 0,
                engagement: 0,
                postsThisWeek: 0,
                engagementChange: 0,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        toast("Logged out",{
            description: "You have been successfully logged out",
        })
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-12 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Social Media</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.name || user?.email}! Manage your Facebook and Instagram presence
                    </p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalAccounts || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.facebookAccounts || 0} Facebook, {stats?.instagramAccounts || 0} Instagram
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.publishedPosts || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.postsThisWeek ? `+${stats.postsThisWeek}` : "0"} from last week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.draftPosts || 0}</div>
                        <p className="text-xs text-muted-foreground">Ready to publish</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.engagement || 0}%</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.engagementChange ? `${stats.engagementChange > 0 ? "+" : ""}${stats.engagementChange}%` : "0%"}{" "}
                            from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="facebook" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="facebook" className="flex items-center space-x-2">
                        <Facebook className="w-4 h-4" />
                        <span>Facebook</span>
                    </TabsTrigger>
                    <TabsTrigger value="instagram" className="flex items-center space-x-2">
                        <Instagram className="w-4 h-4" />
                        <span>Instagram</span>
                    </TabsTrigger>
                    <TabsTrigger value="messenger" className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Messenger</span>
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>WhatsApp</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="facebook">
                    <FacebookManager />
                </TabsContent>

                <TabsContent value="instagram">
                    <InstagramManager />
                </TabsContent>

                <TabsContent value="messenger">
                    <MessengerManager />
                </TabsContent>

                <TabsContent value="whatsapp">
                    <WhatsAppManager />
                </TabsContent>
            </Tabs>
        </div>
    )
}