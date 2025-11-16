"use client"

import { ArrowLeft, Edit, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Post } from "@/components/admin-dashboard"

type PostPreviewProps = {
  post: Post
  onBack: () => void
  onEdit: () => void
}

export function PostPreview({ post, onBack, onEdit }: PostPreviewProps) {
  const renderContentBlock = (block: any) => {
    switch (block.type) {
      case "text":
        return (
          <div 
            className="prose prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )
      case "image":
        return (
          <img
            src={block.content || "/placeholder.svg?height=400&width=800"}
            alt="Content"
            className="w-full rounded-lg"
          />
        )
      case "video":
        return (
          <video
            src={block.content}
            controls
            className="w-full rounded-lg"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to posts</span>
            </Button>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-balance">Post Preview</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Preview how your post will appear to readers
              </p>
            </div>
          </div>

          <Button onClick={onEdit} size="lg">
            <Edit className="mr-2 h-4 w-4" />
            Edit Post
          </Button>
        </div>
      </header>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <article className="max-w-4xl mx-auto p-8">
          <div className="bg-card border border-border rounded-lg p-8">
            {/* Post Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                  {post.status}
                </Badge>
                <span className="text-sm text-muted-foreground">By {post.author}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-balance">{post.title}</h1>
              
              {post.excerpt && (
                <p className="text-xl text-muted-foreground text-pretty">{post.excerpt}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-6 pt-6 border-t border-border">
                <span>Updated {post.updatedAt}</span>
                {post.publishedAt && (
                  <>
                    <span>•</span>
                    <span>Published {post.publishedAt}</span>
                  </>
                )}
              </div>
            </div>

            {/* Content Blocks - flowing together */}
            {post.contentBlocks.length > 0 ? (
              <div className="space-y-6">
                {post.contentBlocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <div key={block.id}>
                      {renderContentBlock(block)}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-lg p-12 text-center">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content yet</h3>
                <p className="text-sm text-muted-foreground">
                  This post doesn't have any content blocks. Click Edit to add some.
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
