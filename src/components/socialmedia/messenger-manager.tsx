"use client"

import { useState, useEffect } from "react"
import { Card, CardContent,CardHeader, CardTitle } from "../ui/card.tsx"
import { Button } from "../ui/button.tsx"
import { Input } from "../ui/input.tsx"
import { Label } from "../ui/label.tsx"
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
import { Plus, Send, MessageSquare, Eye, ChevronLeft, ChevronRight, User, FolderSyncIcon as Sync } from 'lucide-react'
import { metaApiClient } from "../../services/meta-api.ts"
import {ScrollArea} from "../ui/scroll-area.tsx";
import { toast } from "sonner"

interface MessengerAccount {
    id: number
    name: string
    pageId: string
    accessToken: string
    status: "active" | "inactive"
    createdAt: string
}

interface MessengerConversation {
    id: string
    accountId: number
    participantName: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    status: "active" | "archived"
}

interface MessengerMessage {
    id: string
    conversationId: string
    senderId: string
    senderName: string
    content: string
    messageType: "text" | "image" | "file"
    timestamp: string
    isFromPage: boolean
}

export function MessengerManager() {
    const [accounts, setAccounts] = useState<MessengerAccount[]>([])
    const [conversations, setConversations] = useState<MessengerConversation[]>([])
    const [messages, setMessages] = useState<MessengerMessage[]>([])
    const [selectedConversation, setSelectedConversation] = useState<MessengerConversation | null>(null)
    const [loading, setLoading] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<MessengerAccount | null>(null)
    const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [newMessage, setNewMessage] = useState("")

    // Pagination states
    const [currentAccountPage, setCurrentAccountPage] = useState(1)
    const [currentConversationPage, setCurrentConversationPage] = useState(1)
    const itemsPerPage = 5


    useEffect(() => {
        loadAccounts()
    }, [])

    useEffect(() => {
        if (selectedAccount) {
            loadConversations(selectedAccount.id)
        }
    }, [selectedAccount])

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id)
        }
    }, [selectedConversation])

    const loadAccounts = async () => {
        setLoading(true)
        try {
            const data = await metaApiClient.getMessengerAccounts()
            setAccounts(data)
            if (data.length > 0 && !selectedAccount) {
                setSelectedAccount(data[0])
            }
        } catch (error) {
            console.error("Failed to load accounts:", error)
            toast("Error",{
                description: "Failed to load Messenger accounts.",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadConversations = async (accountId: number) => {
        setLoading(true)
        try {
            const data = await metaApiClient.getMessengerConversations(accountId)
            setConversations(data)
        } catch (error) {
            console.error("Failed to load conversations:", error)
            toast( "Error",{
                description: "Failed to load conversations.",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadMessages = async (conversationId: string) => {
        setLoading(true)
        try {
            const data = await metaApiClient.getMessengerMessages(conversationId)
            setMessages(data)
        } catch (error) {
            console.error("Failed to load messages:", error)
            toast("Error",{
                description: "Failed to load messages.",
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
                name: formData.get("name") as string,
                pageId: formData.get("pageId") as string,
                accessToken: formData.get("accessToken") as string,
            }

            const newAccount = await metaApiClient.createMessengerAccount(accountData)
            setAccounts((prev) => [...prev, newAccount])
            setIsAccountDialogOpen(false)
            toast("Account created",{
                description: "Messenger account has been successfully created.",
            })
        } catch (error) {
            console.error("Failed to create account:", error)
            toast("Error",{
                description: "Failed to create Messenger account.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!selectedConversation || !newMessage.trim()) return

        setLoading(true)
        try {
            const messageData = {
                conversationId: selectedConversation.id,
                content: newMessage,
                messageType: "text",
            }

            await metaApiClient.sendMessengerMessage(messageData)
            setNewMessage("")
            // Reload messages to show the new one
            await loadMessages(selectedConversation.id)
            toast("Message sent",{
                description: "Your message has been sent successfully.",
            })
        } catch (error) {
            console.error("Failed to send message:", error)
            toast("Error",{
                description: "Failed to send message.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSyncMessages = async () => {
        if (!selectedAccount) return

        setLoading(true)
        try {
            await metaApiClient.syncMessengerMessages(selectedAccount.id)
            await loadConversations(selectedAccount.id)
            if (selectedConversation) {
                await loadMessages(selectedConversation.id)
            }
            toast("Messages synced",{
                description: "Messages have been synchronized successfully.",
            })
        } catch (error) {
            console.error("Failed to sync messages:", error)
            toast("Error",{
                description: "Failed to sync messages.",
            })
        } finally {
            setLoading(false)
        }
    }

    const openViewDialog = (account: MessengerAccount) => {
        setSelectedAccount(account)
        setIsViewDialogOpen(true)
    }

    // Pagination logic
    const paginateAccounts = (accounts: MessengerAccount[], page: number) => {
        const validAccounts = Array.isArray(accounts) ? accounts : []
        const startIndex = (page - 1) * itemsPerPage
        return validAccounts.slice(startIndex, startIndex + itemsPerPage)
    }


    const paginateConversations = (conversations: MessengerConversation[], page: number) => {
        const startIndex = (page - 1) * itemsPerPage
        return conversations.slice(startIndex, startIndex + itemsPerPage)
    }

    const totalAccountPages = Math.ceil(accounts.length / itemsPerPage)
    const totalConversationPages = Math.ceil(conversations.length / itemsPerPage)

    return (
        <div className="space-y-6">
            <Tabs defaultValue="accounts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="accounts">Accounts ({accounts.length})</TabsTrigger>
                    <TabsTrigger value="conversations">Conversations ({conversations.length})</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Messenger Accounts</h3>
                            <p className="text-sm text-muted-foreground">Manage your Facebook Messenger accounts</p>
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
                                    <DialogTitle>Add Messenger Account</DialogTitle>
                                    <DialogDescription>Connect a new Facebook page for Messenger</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateAccount}>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Page Name</Label>
                                            <Input id="name" name="name" placeholder="My Business Page" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="pageId">Page ID</Label>
                                            <Input id="pageId" name="pageId" placeholder="123456789" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="accessToken">Access Token</Label>
                                            <Input
                                                id="accessToken"
                                                name="accessToken"
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
                                                <TableCell className="font-medium">{account.name}</TableCell>
                                                <TableCell>{account.pageId}</TableCell>
                                                <TableCell>
                                                    <Badge variant={account.status === "active" ? "default" : "secondary"}>{account.status}</Badge>
                                                </TableCell>
                                                <TableCell>{account.createdAt}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" variant="outline" onClick={() => openViewDialog(account)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => setSelectedAccount(account)}>
                                                            <MessageSquare className="w-4 h-4" />
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
                                        <MessageSquare className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">No Messenger accounts found</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">
                                            Connect your Facebook page to start managing customer conversations through Messenger.
                                        </p>
                                    </div>
                                    <Button
                                        className="bg-purple-500 hover:bg-purple-600"
                                        onClick={() => setIsAccountDialogOpen(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Connect Messenger Account
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

                <TabsContent value="conversations" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Conversations</h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedAccount
                                    ? `Conversations for ${selectedAccount.name}`
                                    : "Select an account to view conversations"}
                            </p>
                        </div>
                        <Button onClick={handleSyncMessages} disabled={!selectedAccount || loading}>
                            <Sync className="w-4 h-4 mr-2" />
                            Sync Messages
                        </Button>
                    </div>

                    {selectedAccount ? (
                        conversations.length > 0 ? (
                            <Card>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Participant</TableHead>
                                                <TableHead>Last Message</TableHead>
                                                <TableHead>Time</TableHead>
                                                <TableHead>Unread</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginateConversations(conversations, currentConversationPage).map((conversation) => (
                                                <TableRow key={conversation.id}>
                                                    <TableCell className="font-medium">{conversation.participantName}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{conversation.lastMessage}</TableCell>
                                                    <TableCell>{conversation.lastMessageTime}</TableCell>
                                                    <TableCell>
                                                        {conversation.unreadCount > 0 && (
                                                            <Badge variant="destructive">{conversation.unreadCount}</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button size="sm" variant="outline" onClick={() => setSelectedConversation(conversation)}>
                                                            <MessageSquare className="w-4 h-4" />
                                                        </Button>
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
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-8 h-8 text-green-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold text-gray-900">No conversations yet</h3>
                                            <p className="text-sm text-gray-500 max-w-sm">
                                                When customers message your page, their conversations will appear here. Start engaging with your audience!
                                            </p>
                                        </div>
                                        <Button onClick={handleSyncMessages} disabled={loading}>
                                            <Sync className="w-4 h-4 mr-2" />
                                            Sync Messages
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">Select an account</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">
                                            Choose a Messenger account from the accounts tab to view and manage conversations.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination for Conversations */}
                    {selectedAccount && conversations.length > 0 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing {(currentConversationPage - 1) * itemsPerPage + 1} to{" "}
                                {Math.min(currentConversationPage * itemsPerPage, conversations.length)} of {conversations.length}{" "}
                                conversations
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentConversationPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentConversationPage === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {currentConversationPage} of {totalConversationPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentConversationPage((prev) => Math.min(prev + 1, totalConversationPages))}
                                    disabled={currentConversationPage === totalConversationPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                    {selectedConversation ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Chat with {selectedConversation.participantName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-96 mb-4">
                                        {messages.length > 0 ? (
                                            <div className="space-y-4">
                                                {messages.map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={`flex ${message.isFromPage ? "justify-end" : "justify-start"}`}
                                                    >
                                                        <div
                                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                                message.isFromPage ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-900"
                                                            }`}
                                                        >
                                                            <p className="text-sm">{message.content}</p>
                                                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <MessageSquare className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-900">No messages yet</p>
                                                    <p className="text-xs text-gray-500">Start the conversation by sending a message</p>
                                                </div>
                                            </div>
                                        )}
                                    </ScrollArea>
                                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1"
                                        />
                                        <Button type="submit" disabled={loading || !newMessage.trim()}>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Conversation Info</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Participant</Label>
                                            <p className="text-sm text-muted-foreground">{selectedConversation.participantName}</p>
                                        </div>
                                        <div>
                                            <Label>Status</Label>
                                            <Badge variant={selectedConversation.status === "active" ? "default" : "secondary"}>
                                                {selectedConversation.status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Label>Unread Messages</Label>
                                            <p className="text-sm text-muted-foreground">{selectedConversation.unreadCount}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">Select a conversation</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">
                                            Choose a conversation from the conversations tab to view and send messages.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Account Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedAccount && (
                            <>
                                <div>
                                    <Label>Page Name</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.name}</p>
                                </div>
                                <div>
                                    <Label>Page ID</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.pageId}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Badge variant={selectedAccount.status === "active" ? "default" : "secondary"}>
                                        {selectedAccount.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label>Created Date</Label>
                                    <p className="text-sm text-muted-foreground">{selectedAccount.createdAt}</p>
                                </div>
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
        </div>
    )
}
