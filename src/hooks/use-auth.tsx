// hooks/use-auth.tsx
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { metaApiClient } from "../services/meta-api.ts"

interface User {
    id: string
    email: string
    name: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("accessToken")
            if (token) {
                // If token exists, assume user is authenticated
                // Set a basic user object or you can decode the JWT token to get user info
                setUser({ id: "user", email: "", name: "User" })
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await metaApiClient.login({ email, password })
            console.log(response)
            // Set a basic user object after successful login
            setUser({ id: "user", email: email, name: "User" })
        } catch (error) {
            throw error // Re-throw so LoginForm can handle it
        }
    }

    const logout = () => {
        metaApiClient.logout()
        setUser(null)
    }

    const value = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}