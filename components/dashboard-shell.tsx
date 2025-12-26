"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PostsList } from "@/components/posts-list"
import { PostEditor } from "@/components/post-editor"

export type Post = {
  id: string
  title: string
  slug: string
  status: "draft" | "published"
  author: string
  publishedAt?: string
  updatedAt: string
  excerpt: string
  content: ContentBlock[]
}

export type ContentBlock = {
  id: string
  type: "text" | "image" | "video" | "quote"
  content: string
  caption?: string
  order: number
}

// Mock data
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 16",
    slug: "getting-started-nextjs-16",
    status: "published",
    author: "Sarah Chen",
    publishedAt: "2024-11-15",
    updatedAt: "2024-11-15",
    excerpt: "Learn about the latest features in Next.js 16 including Turbopack improvements and React 19 support.",
    content: [
      { id: "1", type: "text", content: "Next.js 16 introduces groundbreaking improvements...", order: 0 },
      { id: "2", type: "image", content: "/placeholder.svg?height=400&width=800&query=nextjs dashboard", caption: "Next.js Dashboard", order: 1 }
    ]
  },
  {
    id: "2",
    title: "Building Modern Web Applications",
    slug: "building-modern-web-apps",
    status: "published",
    author: "Alex Kumar",
    publishedAt: "2024-11-14",
    updatedAt: "2024-11-14",
    excerpt: "Explore the best practices for building scalable and performant web applications in 2024.",
    content: []
  },
  {
    id: "3",
    title: "Advanced TypeScript Patterns",
    slug: "advanced-typescript-patterns",
    status: "draft",
    author: "Jordan Lee",
    updatedAt: "2024-11-13",
    excerpt: "Deep dive into advanced TypeScript patterns that will improve your code quality.",
    content: []
  }
]

type View = "list" | "edit" | "create"

export function DashboardShell() {
  const [view, setView] = useState<View>("list")
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const handleCreatePost = () => {
    setSelectedPost(null)
    setView("create")
  }

  const handleEditPost = (post: Post) => {
    setSelectedPost(post)
    setView("edit")
  }

  const handleSavePost = (post: Post) => {
    if (view === "create") {
      setPosts([...posts, { ...post, id: Date.now().toString() }])
    } else {
      setPosts(posts.map(p => p.id === post.id ? post : p))
    }
    setView("list")
    setSelectedPost(null)
  }

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId))
    if (selectedPost?.id === postId) {
      setView("list")
      setSelectedPost(null)
    }
  }

  const handleCancel = () => {
    setView("list")
    setSelectedPost(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentView={view} 
        onCreatePost={handleCreatePost} 
        onViewPosts={() => setView("list")}
      />
      <main className="flex-1 overflow-hidden">
        {view === "list" ? (
          <PostsList 
            posts={posts} 
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        ) : (
          <PostEditor 
            post={selectedPost}
            mode={view === "create" ? "create" : "edit"}
            onSave={handleSavePost}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  )
}
