"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card.tsx"
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
import {
    Plus,
    Edit,
    Trash2,
    Send,
    MessageSquare,
    Eye,
    ChevronLeft,
    ChevronRight,
    Video,
    ImageIcon,
    Upload,
    X,
    User,
} from "lucide-react"
import { metaApiClient } from "../../services/meta-api.ts"
import { toast } from "sonner"

interface InstagramAccount {
    id: number
    username: string
    instagram_user_id: string
    access_token: string
    is_active: boolean
    createdAt: string
}

interface InstagramPost {
    id: number
    instagram_user_id: number
    account_id: number
    caption: string
    mediaType: "image" | "video" | "carousel"
    status: "draft" | "published"
    createdAt: string
    publishedAt?: string
    media_urls?: string[]
}

export function InstagramManager() {
    const [accounts, setAccounts] = useState<InstagramAccount[]>([])
    const [posts, setPosts] = useState<InstagramPost[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
    const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
    const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editType, setEditType] = useState<"account" | "post">("account")

    // File upload states
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)

    // Pagination states
    const [currentAccountPage, setCurrentAccountPage] = useState(1)
    const [currentPostPage, setCurrentPostPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
        loadAccounts()
        loadPosts()
    }, [])

    const loadAccounts = async () => {
        setLoading(true)
        try {
            const data = await metaApiClient.getInstagramAccounts()
            setAccounts(data)
        } catch (error) {
            console.error("Failed to load accounts:", error)
            toast("Error", {
                description: "Failed to load Instagram accounts.",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadPosts = async () => {
        setLoading(true)
        try {
            const data = await metaApiClient.getInstagramPosts()
            setPosts(data)
        } catch (error) {
            console.error("Failed to load posts:", error)
            toast("Error", {
                description: "Failed to load Instagram posts.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const validFiles = files.filter((file) => {
            const isImage = file.type.startsWith("image/")
            const isVideo = file.type.startsWith("video/")
            return isImage || isVideo
        })

        if (validFiles.length !== files.length) {
            toast("Invalid files", {
                description: "Only image and video files are allowed.",
            })
        }

        setSelectedFiles((prev) => [...prev, ...validFiles])
    }

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
        setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
    }

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) return []

        setUploading(true)
        try {
            const urls = await metaApiClient.uploadFiles(selectedFiles)
            setUploadedUrls(urls)
            return urls
        } catch (error) {
            console.error("Upload failed:", error)
            toast("Upload failed", {
                description: "Failed to upload media files. Please try again.",
            })
            return []
        } finally {
            setUploading(false)
        }
    }

    const resetFileState = () => {
        setSelectedFiles([])
        setUploadedUrls([])
    }

    const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        try {
            const accountData = {
                username: formData.get("username") as string,
                account_id: formData.get("account_id") as string,
                access_token: formData.get("access_token") as string,
            }

            const newAccount = await metaApiClient.createInstagramAccount(accountData)
            setAccounts((prev) => [...prev, newAccount])
            setIsAccountDialogOpen(false)
            toast("Account created", {
                description: "Instagram account has been successfully created.",
            })
        } catch (error) {
            console.error("Failed to create account:", error)
            toast("Error", {
                description: "Failed to create Instagram account.",
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
                username: formData.get("username") as string,
                account_id: formData.get("account_id") as string,
                access_token: formData.get("access_token") as string,
            }

            const updatedAccount = await metaApiClient.updateInstagramAccount(selectedAccount.id.toString(), accountData)
            setAccounts((prev) => prev.map((account) => (account.id === selectedAccount.id ? updatedAccount : account)))
            setIsEditDialogOpen(false)
            setSelectedAccount(null)
            toast("Account updated", {
                description: "Instagram account has been successfully updated.",
            })
        } catch (error) {
            console.error("Failed to update account:", error)
            toast("Error", {
                description: "Failed to update Instagram account.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        try {
            // Upload files first if any are selected
            let mediaUrls: string[] = []
            if (selectedFiles.length > 0) {
                mediaUrls = await uploadFiles()
                if (mediaUrls.length === 0) {
                    // Upload failed, don't proceed
                    setLoading(false)
                    return
                }
            }

            const formData = new FormData(event.currentTarget)
            const postData = {
                account_id: formData.get("account_id") as string,
                caption: formData.get("content") as string,
                media_urls: mediaUrls,
            }

            const newPost = await metaApiClient.createInstagramPost(postData)
            setPosts((prev) => [...prev, newPost])
            setIsPostDialogOpen(false)
            resetFileState()
            toast("Post created", {
                description: "Instagram post has been created as draft.",
            })
        } catch (error) {
            console.error("Failed to create post:", error)
            toast("Error", {
                description: "Failed to create Instagram post. Make sure to upload at least one image or video.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEditPost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!selectedPost) return

        setLoading(true)
        try {
            // Upload new files if any are selected
            let mediaUrls: string[] = uploadedUrls
            if (selectedFiles.length > 0) {
                const newUrls = await uploadFiles()
                if (newUrls.length > 0) {
                    mediaUrls = [...mediaUrls, ...newUrls]
                }
            }

            const formData = new FormData(event.currentTarget)
            const postData = {
                account_id: formData.get("account_id") as string,
                caption: formData.get("content") as string,
                media_urls: mediaUrls,
            }

            const updatedPost = await metaApiClient.updateInstagramPost(selectedPost.id.toString(), postData)
            setPosts((prev) => prev.map((post) => (post.id === selectedPost.id ? updatedPost : post)))
            setIsEditDialogOpen(false)
            setSelectedPost(null)
            resetFileState()
            toast("Post updated", {
                description: "Instagram post has been successfully updated.",
            })
        } catch (error) {
            console.error("Failed to update post:", error)
            toast("Error", {
                description: "Failed to update Instagram post.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePublishPost = async (postId: number) => {
        setLoading(true)
        try {
            await metaApiClient.publishInstagramPost(postId.toString())
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === postId
                        ? { ...post, status: "published" as const, publishedAt: new Date().toISOString().split("T")[0] }
                        : post,
                ),
            )
            toast("Post published", {
                description: "Instagram post has been successfully published.",
            })
        } catch (error) {
            console.error("Failed to publish post:", error)
            toast("Error", {
                description: "Failed to publish Instagram post.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async (account_id: number) => {
        setLoading(true)
        try {
            await metaApiClient.deleteInstagramAccount(account_id.toString())
            setAccounts((prev) => prev.filter((account) => account.id !== account_id))
            toast("Account deleted", {
                description: "Instagram account has been successfully deleted.",
            })
        } catch (error) {
            console.error("Failed to delete account:", error)
            toast("Error", {
                description: "Failed to delete Instagram account.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeletePost = async (postId: number) => {
        setLoading(true)
        try {
            await metaApiClient.deleteInstagramPost(postId.toString())
            setPosts((prev) => prev.filter((post) => post.id !== postId))
            toast("Post deleted", {
                description: "Instagram post has been successfully deleted.",
            })
        } catch (error) {
            console.error("Failed to delete post:", error)
            toast("Error", {
                description: "Failed to delete Instagram post.",
            })
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (type: "account" | "post", item: InstagramAccount | InstagramPost) => {
        setEditType(type)
        if (type === "account") {
            setSelectedAccount(item as InstagramAccount)
        } else {
            const post = item as InstagramPost
            setSelectedPost(post)
            // Pre-populate existing media URLs for editing
            if (post.media_urls) {
                setUploadedUrls(post.media_urls)
            }
        }
        setIsEditDialogOpen(true)
    }

    const openViewDialog = (type: "account" | "post", item: InstagramAccount | InstagramPost) => {
        setEditType(type)
        if (type === "account") {
            setSelectedAccount(item as InstagramAccount)
        } else {
            setSelectedPost(item as InstagramPost)
        }
        setIsViewDialogOpen(true)
    }

    const getMediaIcon = (mediaType: string) => {
        switch (mediaType) {
            case "video":
                return <Video className="w-4 h-4" />
            case "carousel":
                return <ImageIcon className="w-4 h-4" />
            default:
                return <ImageIcon className="w-4 h-4" />
        }
    }

    const getFilePreview = (file: File) => {
        if (file.type.startsWith("image/")) {
            return URL.createObjectURL(file)
        }
        return null
    }

    // Pagination logic
    const paginateAccounts = (accounts: InstagramAccount[], page: number) => {
        const startIndex = (page - 1) * itemsPerPage
        return accounts.slice(startIndex, startIndex + itemsPerPage)
    }

    const paginatePosts = (posts: InstagramPost[], page: number) => {
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
                    <TabsTrigger value="reels">Reels</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Instagram Accounts</h3>
                            <p className="text-sm text-muted-foreground">Manage your Instagram business accounts</p>
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
                                    <DialogTitle>Add Instagram Account</DialogTitle>
                                    <DialogDescription>Connect a new Instagram business account to your dashboard</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateAccount}>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="username">Username</Label>
                                            <Input id="username" name="username" placeholder="@mybusiness" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="account_id">Account ID</Label>
                                            <Input id="account_id" name="account_id" placeholder="123456789" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="access_token">Access Token</Label>
                                            <Input
                                                id="access_token"
                                                name="access_token"
                                                type="password"
                                                placeholder="Your Instagram access token"
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
                                            <TableHead>Username</TableHead>
                                            <TableHead>Account ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginateAccounts(accounts, currentAccountPage).map((account) => (
                                            <TableRow key={account.id}>
                                                <TableCell className="font-medium">{account.username}</TableCell>
                                                <TableCell>{account.instagram_user_id}</TableCell>
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
                                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-pink-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">No Instagram accounts found</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">
                                            Connect your Instagram Business account to start sharing photos, videos, and stories with your
                                            audience.
                                        </p>
                                    </div>
                                    <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => setIsAccountDialogOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Connect Instagram Account
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
                            <h3 className="text-lg font-semibold">Instagram Posts</h3>
                            <p className="text-sm text-muted-foreground">Create and manage your Instagram posts</p>
                        </div>
                        <Dialog
                            open={isPostDialogOpen}
                            onOpenChange={(open) => {
                                setIsPostDialogOpen(open)
                                if (!open) resetFileState()
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-purple-500 hover:bg-purple-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Post
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Create Instagram Post</DialogTitle>
                                    <DialogDescription>Create a new post for your Instagram account</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreatePost}>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="account_id">Account</Label>
                                            <select id="account_id" name="account_id" className="w-full p-2 border rounded-md" required>
                                                <option value="">Select an account</option>
                                                {accounts.map((account) => (
                                                    <option key={account.id} value={account.id}>
                                                        {account.username}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* File Upload Section */}
                                        <div>
                                            <Label>Media Files (Required)</Label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                                <div className="text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="mt-4">
                                                        <label htmlFor="file-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload images or videos
                              </span>
                                                            <input
                                                                id="file-upload"
                                                                name="file-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                multiple
                                                                accept="image/*,video/*"
                                                                onChange={handleFileSelect}
                                                            />
                                                        </label>
                                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF, MP4 up to 10MB each</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* File Preview */}
                                        {selectedFiles.length > 0 && (
                                            <div>
                                                <Label>Selected Files</Label>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    {selectedFiles.map((file, index) => (
                                                        <div key={index} className="relative border rounded-lg p-2">
                                                            <div className="flex items-center space-x-2">
                                                                {file.type.startsWith("image/") ? (
                                                                    <img
                                                                        src={getFilePreview(file) || ""}
                                                                        alt={file.name}
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                                                        <Video className="w-8 h-8 text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                                </div>
                                                                <Button type="button" variant="outline" size="sm" onClick={() => removeFile(index)}>
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="content">Caption</Label>
                                            <Textarea
                                                id="content"
                                                name="content"
                                                placeholder="Write a caption... #hashtags"
                                                rows={4}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="mt-6">
                                        <Button type="button" variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-purple-500 hover:bg-purple-600"
                                            disabled={loading || uploading || selectedFiles.length === 0}
                                        >
                                            {loading ? "Creating..." : uploading ? "Uploading..." : "Create Post"}
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
                                            <TableHead>Type</TableHead>
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
                                                    <TableCell className="max-w-xs truncate">{post.caption}</TableCell>
                                                    <TableCell>{account?.username}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-1">
                                                            {getMediaIcon(post.mediaType)}
                                                            <span className="capitalize">{post.mediaType}</span>
                                                        </div>
                                                    </TableCell>
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
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">No posts created yet</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">
                                            Share your story with beautiful photos and videos. Create your first Instagram post to get
                                            started.
                                        </p>
                                    </div>
                                    {accounts.length > 0 ? (
                                        <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => setIsPostDialogOpen(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Your First Post
                                        </Button>
                                    ) : (
                                        <p className="text-xs text-gray-400">Connect an Instagram account first to create posts</p>
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

                <TabsContent value="reels">
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <Video className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900">Instagram Reels</h3>
                                    <p className="text-sm text-gray-500 max-w-sm">
                                        Create engaging short-form videos to reach a wider audience. Reels management will be available here
                                        soon.
                                    </p>
                                </div>
                                <Button disabled className="bg-gray-100 text-gray-400">
                                    <Video className="w-4 h-4 mr-2" />
                                    Coming Soon
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="comments">
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900">Comments Management</h3>
                                    <p className="text-sm text-gray-500 max-w-sm">
                                        View and respond to comments on your Instagram posts. Stay connected with your community.
                                    </p>
                                </div>
                                <Button disabled className="bg-gray-100 text-gray-400">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Coming Soon
                                </Button>
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
                                    <Label>Username</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.username}</p>
                                </div>
                                <div>
                                    <Label>Account ID</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.instagram_user_id}</p>
                                </div>
                                <div>
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
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedPost.caption}</p>
                                </div>
                                <div>
                                    <Label>Account</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {accounts.find((acc) => acc.id === selectedPost.account_id)?.username}
                                    </p>
                                </div>
                                <div>
                                    <Label>Media Type</Label>
                                    <div className="flex items-center space-x-1">
                                        {getMediaIcon(selectedPost.mediaType)}
                                        <span className="capitalize text-sm text-muted-foreground">{selectedPost.mediaType}</span>
                                    </div>
                                </div>
                                {selectedPost.media_urls && selectedPost.media_urls.length > 0 && (
                                    <div>
                                        <Label>Media Files</Label>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {selectedPost.media_urls.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url || "/placeholder.svg"}
                                                    alt={`Media ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded border"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
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
            <Dialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) {
                        resetFileState()
                        setSelectedAccount(null)
                        setSelectedPost(null)
                    }
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editType === "account" ? "Edit Account" : "Edit Post"}</DialogTitle>
                    </DialogHeader>
                    {editType === "account" && selectedAccount && (
                        <form onSubmit={handleEditAccount}>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-username">Username</Label>
                                    <Input id="edit-username" name="username" defaultValue={selectedAccount.username} required />
                                </div>
                                <div>
                                    <Label htmlFor="edit-account_id">Account ID</Label>
                                    <Input
                                        id="edit-account_id"
                                        name="account_id"
                                        defaultValue={selectedAccount.instagram_user_id}
                                        required
                                    />
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
                                                {account.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Current Media Files */}
                                {uploadedUrls.length > 0 && (
                                    <div>
                                        <Label>Current Media Files</Label>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {uploadedUrls.map((url, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={url || "/placeholder.svg"}
                                                        alt={`Media ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded border"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="absolute top-1 right-1"
                                                        onClick={() => setUploadedUrls((prev) => prev.filter((_, i) => i !== index))}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add New Media Files */}
                                <div>
                                    <Label>Add New Media Files</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <div className="text-center">
                                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                            <div className="mt-2">
                                                <label htmlFor="edit-file-upload" className="cursor-pointer">
                                                    <span className="text-sm font-medium text-gray-900">Upload additional images or videos</span>
                                                    <input
                                                        id="edit-file-upload"
                                                        name="edit-file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        multiple
                                                        accept="image/*,video/*"
                                                        onChange={handleFileSelect}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* New File Preview */}
                                {selectedFiles.length > 0 && (
                                    <div>
                                        <Label>New Files to Upload</Label>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="relative border rounded-lg p-2">
                                                    <div className="flex items-center space-x-2">
                                                        {file.type.startsWith("image/") ? (
                                                            <img
                                                                src={getFilePreview(file) || ""}
                                                                alt={file.name}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                                <Video className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                                        </div>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => removeFile(index)}>
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="edit-content">Caption</Label>
                                    <Textarea id="edit-content" name="content" defaultValue={selectedPost.caption} rows={4} required />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-purple-500 hover:bg-purple-600"
                                    disabled={loading || uploading || (uploadedUrls.length === 0 && selectedFiles.length === 0)}
                                >
                                    {loading ? "Updating..." : uploading ? "Uploading..." : "Update Post"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
