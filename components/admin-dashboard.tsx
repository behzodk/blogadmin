"use client"

import { useEffect, useMemo, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Sidebar } from "@/components/sidebar"
import { PostsList } from "@/components/posts-list"
import { PostEditor } from "@/components/post-editor"
import { PostPreview } from "@/components/post-preview"
import { SettingsPage } from "@/components/settings-page"
import { AnalyticsPage } from "@/components/analytics-page"

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  status: "draft" | "published" | "scheduled"
  author: string
  publishedAt?: string
  updatedAt: string
  contentBlocks: ContentBlock[]
}

export type ContentBlock = {
  id: string
  type: "text" | "image" | "video" | "quote"
  content: string
  order: number
}

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<"posts" | "editor" | "preview" | "settings" | "analytics">("posts")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  const isAuthorized = session?.user?.email === "behzodmusurmonqulov@gmail.com"

  const selectWithSections = useMemo(
    () =>
      `
        id,
        title,
        slug,
        excerpt,
        status,
        published_at,
        updated_at,
        sections:sections (
          id,
          type,
          content,
          position
        )
      `,
    []
  )

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from("posts")
        .select(selectWithSections)
        .order("updated_at", { ascending: false })
        .order("position", { referencedTable: "sections", ascending: true })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      const mapped = (data || []).map(mapDbPostToPost)
      setPosts(mapped)
      setIsLoading(false)
    }

    if (isAuthorized) {
      fetchPosts()
    }
  }, [selectWithSections, isAuthorized])

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setAuthLoading(false)
      if (!data.session) {
        router.replace("/signin")
      } else if (data.session.user.email !== "behzodmusurmonqulov@gmail.com") {
        router.replace("/sorry")
      }
    }
    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setAuthLoading(false)
      if (!newSession) {
        setPosts([])
        router.replace("/signin")
        return
      }
      if (newSession.user.email !== "behzodmusurmonqulov@gmail.com") {
        router.replace("/sorry")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setPosts([])
    setCurrentView("posts")
  }

  const handleCreatePost = () => {
    const newPost: Post = {
      id: `temp-${Date.now().toString()}`,
      title: "",
      slug: "",
      excerpt: "",
      status: "draft",
      author: "Admin",
      updatedAt: new Date().toISOString().split('T')[0],
      contentBlocks: [],
    }
    setPosts([newPost, ...posts])
    setSelectedPost(newPost)
    setCurrentView("editor")
  }

  const handleEditPost = (post: Post) => {
    setSelectedPost(post)
    setCurrentView("editor")
  }

  const handleDeletePost = async (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId))
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", postId)
    if (deleteError) {
      setError(deleteError.message)
    }
  }

  const handleSavePost = async (updatedPost: Post) => {
    setIsSaving(true)
    setError(null)

    const isExisting = posts.some((p) => p.id === updatedPost.id && !p.id.startsWith("temp-"))

    const postPayload = {
      title: updatedPost.title || "Untitled Post",
      slug: updatedPost.slug || updatedPost.title.toLowerCase().replace(/\s+/g, "-") || "untitled",
      excerpt: updatedPost.excerpt,
      status: updatedPost.status,
      published_at: updatedPost.status === "published" ? updatedPost.publishedAt || new Date().toISOString().split("T")[0] : null,
      updated_at: new Date().toISOString(),
    }

    if (isExisting) {
      const { error: updateError, data } = await supabase
        .from("posts")
        .update(postPayload)
        .eq("id", updatedPost.id)
        .select(selectWithSections)
        .single()

      if (updateError || !data) {
        setError(updateError?.message || "Unable to update post")
        setIsSaving(false)
        return
      }

      const sectionsError = await replaceSections(data.id, updatedPost.contentBlocks)
      if (sectionsError) {
        setError(sectionsError.message || "Unable to update post sections")
        setIsSaving(false)
        return
      }
      const mergedPost = {
        ...updatedPost,
        id: data.id.toString(),
        updatedAt: postPayload.updated_at.split("T")[0],
      }
      setPosts(posts.map((p) => (p.id === updatedPost.id ? mergedPost : p)))
    } else {
      const { data: created, error: createError } = await supabase
        .from("posts")
        .insert(postPayload)
        .select(selectWithSections)
        .single()

      if (createError || !created) {
        setError(createError?.message || "Unable to create post")
        setIsSaving(false)
        return
      }

      const sectionsError = await replaceSections(created.id, updatedPost.contentBlocks)
      if (sectionsError) {
        setError(sectionsError.message || "Unable to create post sections")
        setIsSaving(false)
        return
      }
      const mapped = mapDbPostToPost({
        ...created,
        sections: updatedPost.contentBlocks.map((block) => ({
          ...block,
          position: block.order,
        })),
      })
      setPosts([mapped, ...posts.filter((p) => !p.id.startsWith("temp-"))])
    }

    setCurrentView("posts")
    setSelectedPost(null)
    setIsSaving(false)
  }

  const handleBackToPosts = () => {
    setCurrentView("posts")
    setSelectedPost(null)
  }

  const handlePreviewPost = (post: Post) => {
    setSelectedPost(post)
    setCurrentView("preview")
  }

  const handleEditFromPreview = () => {
    if (selectedPost) {
      setCurrentView("editor")
    }
  }

  return (
    <>
      {authLoading || !session || !isAuthorized ? null : (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onCreatePost={handleCreatePost}
        onNavigate={(view) => {
          setCurrentView(view)
          if (view === "posts") setSelectedPost(null)
        }}
        userEmail={session?.user?.email ?? undefined}
        onSignOut={session ? handleSignOut : undefined}
      />
      <main className="flex-1 ml-64">
        {authLoading || !session || !isAuthorized ? null : isLoading ? (
          <div className="p-8 text-muted-foreground">Loading posts from Supabase...</div>
        ) : error ? (
          <div className="p-8 text-destructive">Error: {error}</div>
        ) : currentView === "posts" ? (
          <PostsList
            posts={posts}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onPreviewPost={handlePreviewPost}
          />
        ) : currentView === "settings" ? (
          <SettingsPage />
        ) : currentView === "analytics" ? (
          <AnalyticsPage />
        ) : currentView === "preview" ? (
          <PostPreview
            post={selectedPost!}
            onBack={handleBackToPosts}
            onEdit={handleEditFromPreview}
          />
        ) : (
          <PostEditor
            post={selectedPost}
            onSave={handleSavePost}
            onBack={handleBackToPosts}
            isSaving={isSaving}
          />
        )}
      </main>
    </div>
      )}
    </>
  )
}

const mapDbPostToPost = (row: any): Post => {
  return {
    id: row.id?.toString(),
    title: row.title || "",
    slug: row.slug || "",
    excerpt: row.excerpt || "",
    status: row.status || "draft",
    author: "Admin",
    publishedAt: row.published_at || undefined,
    updatedAt: (row.updated_at || "").toString().split("T")[0] || new Date().toISOString().split("T")[0],
    contentBlocks: (row.sections || [])
      .map((section: any) => ({
        id: section.id?.toString() || `section-${Math.random()}`,
        type: section.type,
        content: section.content || "",
        order: section.position ?? 0,
      }))
      .sort((a: ContentBlock, b: ContentBlock) => a.order - b.order),
  }
}

const replaceSections = async (postId: string, blocks: ContentBlock[]) => {
  const { error: deleteError } = await supabase.from("sections").delete().eq("post_id", postId)
  if (deleteError) {
    return deleteError
  }

  if (!blocks.length) return

  const payload = blocks.map((block, index) => ({
    post_id: postId,
    type: block.type,
    content: block.content,
    position: block.order ?? index,
  }))

  const { error: insertError } = await supabase.from("sections").insert(payload)
  if (insertError) {
    return insertError
  }
}
