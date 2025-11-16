"use client"

import { FileText, Plus, Settings, BarChart3, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"

type SidebarProps = {
  currentView: string
  onCreatePost: () => void
  onNavigate: (view: "posts" | "editor" | "settings" | "analytics") => void
  userEmail?: string
  onSignOut?: () => void
}

export function Sidebar({ currentView, onCreatePost, onNavigate, userEmail, onSignOut }: SidebarProps) {
  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split(".")
        .map((part) => part[0]?.toUpperCase() || "")
        .join("")
        .slice(0, 2)
    : "AC"

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col fixed left-0 top-0 h-screen">
      <div className="p-6 border-b border-border flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          Blog Admin
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Content Management
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Button
          onClick={onCreatePost}
          className="w-full justify-start gap-3"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          New Post
        </Button>

        <Button
          onClick={() => onNavigate("posts")}
          variant={currentView === "posts" ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
          size="lg"
        >
          <FileText className="h-5 w-5" />
          All Posts
        </Button>

        <Button
          onClick={() => onNavigate("analytics")}
          variant={currentView === "analytics" ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
          size="lg"
        >
          <BarChart3 className="h-5 w-5" />
          Analytics
        </Button>

        <Button
          onClick={() => onNavigate("settings")}
          variant={currentView === "settings" ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
          size="lg"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
      </nav>

      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {initials || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userEmail || "Signed in"}</p>
            <p className="text-xs text-muted-foreground truncate">Google</p>
          </div>
          {onSignOut && (
            <Button variant="ghost" size="icon" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
