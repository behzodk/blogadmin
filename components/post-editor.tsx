"use client"

import { useState } from "react"
import { ArrowLeft, Save, Eye, Type, ImageIcon, Video } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Post, ContentBlock } from "@/components/admin-dashboard"
import { ContentBlockEditor } from "@/components/content-block-editor"

type PostEditorProps = {
  post: Post | null
  onSave: (post: Post) => Promise<void>
  onBack: () => void
  isSaving: boolean
}

export function PostEditor({ post, onSave, onBack, isSaving }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(post?.status || "draft")
  const [author, setAuthor] = useState(post?.author || "Admin User")
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(post?.contentBlocks || [])

  const handleAddBlock = (type: "text" | "image" | "video") => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: type === "text" ? "<p>Start typing...</p>" : "",
      order: contentBlocks.length,
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const handleUpdateBlock = (id: string, content: string) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const handleDeleteBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id))
  }

  const handleMoveBlock = (id: string, direction: "up" | "down") => {
    const index = contentBlocks.findIndex(block => block.id === id)
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === contentBlocks.length - 1)
    ) {
      return
    }

    const newBlocks = [...contentBlocks]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
    
    // Update order
    newBlocks.forEach((block, i) => {
      block.order = i
    })
    
    setContentBlocks(newBlocks)
  }

  const handleSave = async () => {
    const postData: Post = {
      id: post?.id || Date.now().toString(),
      title: title || "Untitled Post",
      slug: slug || title.toLowerCase().replace(/\s+/g, "-") || "untitled",
      excerpt,
      status,
      author: "Admin",
      contentBlocks,
      updatedAt: new Date().toISOString().split("T")[0],
      publishedAt: status === "published" ? (post?.publishedAt || new Date().toISOString().split("T")[0]) : post?.publishedAt,
    }
    await onSave(postData)
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to posts</span>
            </Button>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-balance">
                {post?.id ? "Edit Post" : "Create New Post"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {post?.id ? "Update your post content" : "Add content blocks to build your post"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="lg">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSave} size="lg" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : `Save ${status === "published" ? "& Publish" : "Draft"}`}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Post Metadata */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold">Post Details</h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="post-url-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: "draft" | "published" | "scheduled") => setStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Content Blocks</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleAddBlock("text")}
                  variant="outline"
                  size="sm"
                >
                  <Type className="mr-2 h-4 w-4" />
                  Text
                </Button>
                <Button
                  onClick={() => handleAddBlock("image")}
                  variant="outline"
                  size="sm"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Image
                </Button>
                <Button
                  onClick={() => handleAddBlock("video")}
                  variant="outline"
                  size="sm"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </Button>
              </div>
            </div>

            {contentBlocks.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Type className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No content blocks yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 text-pretty">
                    Start building your post by adding text, images, or video blocks. You can rearrange them later.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => handleAddBlock("text")} variant="outline">
                      <Type className="mr-2 h-4 w-4" />
                      Add Text
                    </Button>
                    <Button onClick={() => handleAddBlock("image")} variant="outline">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                    <Button onClick={() => handleAddBlock("video")} variant="outline">
                      <Video className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {contentBlocks.map((block, index) => (
                  <ContentBlockEditor
                    key={block.id}
                    block={block}
                    isFirst={index === 0}
                    isLast={index === contentBlocks.length - 1}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                    onMove={handleMoveBlock}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
