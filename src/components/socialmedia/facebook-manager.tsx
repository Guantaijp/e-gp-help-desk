"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.tsx"
import { Button } from "../ui/button.tsx"
import { Input } from "../ui/input.tsx"
import { Label } from "../ui/label.tsx"
import { Textarea } from "../ui/textarea.tsx"
import { Badge } from "../ui/badge.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.tsx"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table.tsx"
import { Plus, Edit, Trash2, Send, MessageSquare, TestTube, Eye, ChevronLeft, ChevronRight, User } from "lucide-react"
import { metaApiClient } from "../../services/meta-api.ts"
import { toast } from "sonner"

interface FacebookAccount {
    id: number
    page_name: string
    page_id: string
    access_token: string
    is_active: boolean
    createdAt: string
}

interface FacebookPost {
    id: number
    account_id: number
    content: string
    status: "draft" | "scheduled" | "published"
    createdAt: string
    publishedAt?: string
}

export function FacebookManager() {
    const [accounts, setAccounts] = useState<FacebookAccount[]>([])
    const [posts, setPosts] = useState<FacebookPost[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<FacebookAccount | null>(null)
    const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null)
    const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editType, setEditType] = useState<"account" | "post">("account")

    // Pagination states
    const [currentAccountPage, setCurrentAccountPage] = useState(1)
    const [currentPostPage, setCurrentPostPage] = useState(1)
    const itemsPerPage = 5

    // Mock data for demonstration
    useEffect(() => {
        loadAccounts()
        loadPosts()
    }, [])

    const loadAccounts = async () => {
        setLoading(true)
        try {
            const data = await metaApiClient.getFacebookAccounts()
            setAccounts(data)
        } catch (error) {
            console.error("Failed to load accounts:", error)
            toast("Error", {
                description: "Failed to load Facebook accounts.",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadPosts = async () => {
        setLoading(true)
        try {
            const data = await metaApiClient.getFacebookPosts()
            setPosts(data)
        } catch (error) {
            console.error("Failed to load posts:", error)
            toast("Error", {
                description: "Failed to load Facebook posts.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        try {
            const accountData = {
                page_name: formData.get("page_name") as string,
                page_id: formData.get("page_id") as string,
                access_token: formData.get("access_token") as string,
            }

            const newAccount = await metaApiClient.createFacebookAccount(accountData)
            setAccounts((prev) => [...prev, newAccount])
            setIsAccountDialogOpen(false)
            toast("Account created", {
                description: "Facebook account has been successfully created.",
            })
        } catch (error) {
            console.error("Failed to create account:", error)
            toast("Error", {
                description: "Failed to create Facebook account.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEditAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!selectedAccount) return

        setLoading(true)
        const formData = new FormData(event.currentTarget)
        try {
            const accountData = {
                page_name: formData.get("page_name") as string,
                page_id: formData.get("page_id") as string,
                access_token: formData.get("access_token") as string,
            }

            const updatedAccount = await metaApiClient.updateFacebookAccount(selectedAccount.id.toString(), accountData)
            setAccounts((prev) => prev.map((account) => (account.id === selectedAccount.id ? updatedAccount : account)))
            setIsEditDialogOpen(false)
            setSelectedAccount(null)
            toast("Account updated", {
                description: "Facebook account has been successfully updated.",
            })
        } catch (error) {
            console.error("Failed to update account:", error)
            toast("Error", {
                description: "Failed to update Facebook account.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        try {
            const postData = {
                account_id: Number.parseInt(formData.get("account_id") as string),
                content: formData.get("content") as string,
            }

            const newPost = await metaApiClient.createFacebookPost(postData)
            setPosts((prev) => [...prev, newPost])
            setIsPostDialogOpen(false)
            toast("Post created", {
                description: "Facebook post has been created as draft.",
            })
        } catch (error) {
            console.error("Failed to create post:", error)
            toast("Error", {
                description: "Failed to create Facebook post.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEditPost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!selectedPost) return

        setLoading(true)
        const formData = new FormData(event.currentTarget)
        try {
            const postData = {
                account_id: Number.parseInt(formData.get("account_id") as string),
                content: formData.get("content") as string,
            }

            const updatedPost = await metaApiClient.updateFacebookPost(selectedPost.id.toString(), postData)
            setPosts((prev) => prev.map((post) => (post.id === selectedPost.id ? updatedPost : post)))
            setIsEditDialogOpen(false)
            setSelectedPost(null)
            toast("Post updated", {
                description: "Facebook post has been successfully updated.",
            })
        } catch (error) {
            console.error("Failed to update post:", error)
            toast("Error", {
                description: "Failed to update Facebook post.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePublishPost = async (postId: number) => {
        setLoading(true)
        try {
            await metaApiClient.publishFacebookPost(postId.toString())
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === postId
                        ? { ...post, status: "published" as const, publishedAt: new Date().toISOString().split("T")[0] }
                        : post,
                ),
            )
            toast("Post published", {
                description: "Facebook post has been successfully published.",
            })
        } catch (error) {
            console.error("Failed to publish post:", error)
            toast("Error", {
                description: "Failed to publish Facebook post.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleTestCredentials = async (account_id: number) => {
        setLoading(true)
        try {
            await metaApiClient.testFacebookCredentials(account_id.toString())
            toast("Credentials tested", {
                description: "Facebook account credentials are valid.",
            })
        } catch (error) {
            console.error("Failed to test credentials:", error)
            toast("Error", {
                description: "Invalid Facebook account credentials.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async (account_id: number) => {
        setLoading(true)
        try {
            await metaApiClient.deleteFacebookAccount(account_id.toString())
            setAccounts((prev) => prev.filter((account) => account.id !== account_id))
            toast("Account deleted", {
                description: "Facebook account has been successfully deleted.",
            })
        } catch (error) {
            console.error("Failed to delete account:", error)
            toast("Error", {
                description: "Failed to delete Facebook account.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeletePost = async (postId: number) => {
        setLoading(true)
        try {
            await metaApiClient.deleteFacebookPost(postId.toString())
            setPosts((prev) => prev.filter((post) => post.id !== postId))
            toast("Post deleted", {
                description: "Facebook post has been successfully deleted.",
            })
        } catch (error) {
            console.error("Failed to delete post:", error)
            toast("Error", {
                description: "Failed to delete Facebook post.",
            })
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (type: "account" | "post", item: FacebookAccount | FacebookPost) => {
        setEditType(type)
        if (type === "account") {
            setSelectedAccount(item as FacebookAccount)
        } else {
            setSelectedPost(item as FacebookPost)
        }
        setIsEditDialogOpen(true)
    }

    const openViewDialog = (type: "account" | "post", item: FacebookAccount | FacebookPost) => {
        setEditType(type)
        if (type === "account") {
            setSelectedAccount(item as FacebookAccount)
        } else {
            setSelectedPost(item as FacebookPost)
        }
        setIsViewDialogOpen(true)
    }

    // Pagination logic
    const paginateAccounts = (accounts: FacebookAccount[], page: number) => {
        const startIndex = (page - 1) * itemsPerPage
        return accounts.slice(startIndex, startIndex + itemsPerPage)
    }

    const paginatePosts = (posts: FacebookPost[], page: number) => {
        const startIndex = (page - 1) * itemsPerPage
        return posts.slice(startIndex, startIndex + itemsPerPage)
    }

    const totalAccountPages = Math.ceil(accounts.length / itemsPerPage)
    const totalPostPages = Math.ceil(posts.length / itemsPerPage)

    return (
        <div className="space-y-6">
            <Tabs defaultValue="accounts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="accounts">Accounts ({accounts.length})</TabsTrigger>
                    <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Facebook Accounts</h3>
                            <p className="text-sm text-muted-foreground">Manage your Facebook page accounts</p>
                        </div>
                        <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-500 hover:bg-purple-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Facebook Account</DialogTitle>
                                    <DialogDescription>Connect a new Facebook page to your dashboard</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateAccount}>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="page_name">Page Name</Label>
                                            <Input id="page_name" name="page_name" placeholder="My Business Page" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="page_id">Page ID</Label>
                                            <Input id="page_id" name="page_id" placeholder="123456789" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="access_token">Access Token</Label>
                                            <Input
                                                id="access_token"
                                                name="access_token"
                                                type="password"
                                                placeholder="Your page access token"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-6">
                                        <Button type="button" variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600" disabled={loading}>
                                            {loading ? "Creating..." : "Create Account"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {accounts.length > 0 ? (
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Page ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginateAccounts(accounts, currentAccountPage).map((account) => (
                                            <TableRow key={account.id}>
                                                <TableCell className="font-medium">{account.page_name}</TableCell>
                                                <TableCell>{account.page_id}</TableCell>
                                                <TableCell>
                                                    <Badge variant={account.is_active ? "default" : "secondary"}>
                                                        {account.is_active ? "active" : "inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{account.createdAt}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" variant="outline" onClick={() => openViewDialog("account", account)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleTestCredentials(account.id)}>
                                                            <TestTube className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => openEditDialog("account", account)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleDeleteAccount(account.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">No Facebook accounts found</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">
                                            Get started by connecting your first Facebook page to manage posts and engage with your audience.
                                        </p>
                                    </div>
                                    <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => setIsAccountDialogOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination for Accounts */}
                    {accounts.length > 0 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {(currentAccountPage - 1) * itemsPerPage + 1} to{" "}
                                {Math.min(currentAccountPage * itemsPerPage, accounts.length)} of {accounts.length} accounts
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentAccountPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentAccountPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <span className="text-sm">
                  Page {currentAccountPage} of {totalAccountPages}
                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentAccountPage((prev) => Math.min(prev + 1, totalAccountPages))}
                                    disabled={currentAccountPage === totalAccountPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="posts" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Facebook Posts</h3>
                            <p className="text-sm text-muted-foreground">Create and manage your Facebook posts</p>
                        </div>
                        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-500 hover:bg-purple-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Post
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Facebook Post</DialogTitle>
                                    <DialogDescription>Create a new post for your Facebook page</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreatePost}>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="account_id">Account</Label>
                                            <select id="account_id" name="account_id" className="w-full p-2 border rounded-md" required>
                                                <option value="">Select an account</option>
                                                {accounts.map((account) => (
                                                    <option key={account.id} value={account.id}>
                                                        {account.page_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="content">Content</Label>
                                            <Textarea id="content" name="content" placeholder="What's on your mind?" rows={4} required />
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-6">
                                        <Button type="button" variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600" disabled={loading}>
                                            {loading ? "Creating..." : "Create Post"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {posts.length > 0 ? (
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Content</TableHead>
                                            <TableHead>Account</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatePosts(posts, currentPostPage).map((post) => {
                                            const account = accounts.find((acc) => acc.id === post.account_id)
                                            return (
                                                <TableRow key={post.id}>
                                                    <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                                                    <TableCell>{account?.page_name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                                                    </TableCell>
                                                    <TableCell>{post.createdAt}</TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button size="sm" variant="outline" onClick={() => openViewDialog("post", post)}>
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            {post.status === "draft" && (
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-purple-500 hover:bg-purple-600"
                                                                    onClick={() => handlePublishPost(post.id)}
                                                                >
                                                                    <Send className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            <Button size="sm" variant="outline" onClick={() => openEditDialog("post", post)}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                <MessageSquare className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">No posts created yet</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">
                                            Start creating engaging content for your Facebook pages. Your posts will appear here.
                                        </p>
                                    </div>
                                    {accounts.length > 0 ? (
                                        <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => setIsPostDialogOpen(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Post
                                        </Button>
                                    ) : (
                                        <p className="text-xs text-gray-400">Add a Facebook account first to create posts</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination for Posts */}
                    {posts.length > 0 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {(currentPostPage - 1) * itemsPerPage + 1} to{" "}
                                {Math.min(currentPostPage * itemsPerPage, posts.length)} of {posts.length} posts
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPostPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPostPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <span className="text-sm">
                  Page {currentPostPage} of {totalPostPages}
                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPostPage((prev) => Math.min(prev + 1, totalPostPages))}
                                    disabled={currentPostPage === totalPostPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="comments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Comments Management</CardTitle>
                            <CardDescription>View and respond to comments on your Facebook posts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Comments management will be available here</p>
                                <p className="text-sm">Sync and reply to comments from your Facebook posts</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editType === "account" ? "Account Details" : "Post Details"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {editType === "account" && selectedAccount && (
                            <>
                                <div>
                                    <Label>Page Name</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.page_name}</p>
                                </div>
                                <div>
                                    <Label>Page ID</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.page_id}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge variant={selectedAccount.is_active ? "default" : "secondary"}>
                                        {selectedAccount.is_active ? "active" : "inactive"}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Created Date</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.createdAt}</p>
                                </div>
                            </>
                        )}
                        {editType === "post" && selectedPost && (
                            <>
                                <div>
                                    <Label>Content</Label>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedPost.content}</p>
                                </div>
                                <div>
                                    <Label>Account</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {accounts.find((acc) => acc.id === selectedPost.account_id)?.page_name}
                                    </p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge variant={selectedPost.status === "published" ? "default" : "secondary"}>
                                        {selectedPost.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Created Date</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPost.createdAt}</p>
                                </div>
                                {selectedPost.publishedAt && (
                                    <div>
                                        <Label>Published Date</Label>
                                        <p className="text-sm text-muted-foreground">{selectedPost.publishedAt}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editType === "account" ? "Edit Account" : "Edit Post"}</DialogTitle>
                    </DialogHeader>
                    {editType === "account" && selectedAccount && (
                        <form onSubmit={handleEditAccount}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-name">Page Name</Label>
                                    <Input id="edit-name" name="name" defaultValue={selectedAccount.page_name} required />
                                </div>
                                <div>
                                    <Label htmlFor="edit-page_id">Page ID</Label>
                                    <Input id="edit-page_id" name="page_id" defaultValue={selectedAccount.page_id} required />
                                </div>
                                <div>
                                    <Label htmlFor="edit-access_token">Access Token</Label>
                                    <Input
                                        id="edit-access_token"
                                        name="access_token"
                                        type="password"
                                        defaultValue={selectedAccount.access_token}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-purple-500 hover:bg-purple-600" disabled={loading}>
                                    {loading ? "Updating..." : "Update Account"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                    {editType === "post" && selectedPost && (
                        <form onSubmit={handleEditPost}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-account_id">Account</Label>
                                    <select
                                        id="edit-account_id"
                                        name="account_id"
                                        className="w-full p-2 border rounded-md"
                                        defaultValue={selectedPost.account_id}
                                        required
                                    >
                                        {accounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.page_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="edit-content">Content</Label>
                                    <Textarea id="edit-content" name="content" defaultValue={selectedPost.content} rows={4} required />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-purple-500 hover:bg-purple-600" disabled={loading}>
                                    {loading ? "Updating..." : "Update Post"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
