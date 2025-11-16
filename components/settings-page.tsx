"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Check, MoreVertical, Plus, Trash2, UserPlus, Users, Moon, Sun, Palette } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"

type TeamMember = {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  avatar: string
}

const themeColors = [
  { name: "White", value: "#ffffff", dark: "#0a0a0a" },
  { name: "Slate", value: "#f8fafc", dark: "#0f172a" },
  { name: "Blue", value: "#eff6ff", dark: "#1e3a8a" },
  { name: "Purple", value: "#faf5ff", dark: "#581c87" },
  { name: "Green", value: "#f0fdf4", dark: "#14532d" },
  { name: "Rose", value: "#fff1f2", dark: "#881337" },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState("White")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@example.com",
      role: "editor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Emma Williams",
      email: "emma@example.com",
      role: "viewer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "editor" as const })

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setTeamMembers([...teamMembers, member])
      setNewMember({ name: "", email: "", role: "editor" })
      setIsAddMemberOpen(false)
    }
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }

  const handleUpdateRole = (id: string, role: "admin" | "editor" | "viewer") => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, role } : m)))
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your theme preferences and team members
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl space-y-8">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the appearance of your dashboard with theme colors and mode
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 pb-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Theme Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      id="theme-mode"
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeToggle}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Currently using {theme === "dark" ? 'Dark' : 'Light'} mode
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
