"use client"

import { useState } from "react"
import { GripVertical, Trash2, ChevronUp, ChevronDown, Type, ImageIcon, Video, Upload, Quote } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContentBlock } from "@/components/admin-dashboard"

type ContentBlockEditorProps = {
  block: ContentBlock
  isFirst: boolean
  isLast: boolean
  onUpdate: (id: string, content: string) => void
  onDelete: (id: string) => void
  onMove: (id: string, direction: "up" | "down") => void
}

export function ContentBlockEditor({
  block,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMove,
}: ContentBlockEditorProps) {
  const [imagePreview, setImagePreview] = useState(block.content)

  const getIcon = () => {
    switch (block.type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "quote":
        return <Quote className="h-4 w-4" />
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url)
    onUpdate(block.id, url)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 group hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-1 pt-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4" />
            <span className="sr-only">Drag to reorder</span>
          </Button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              {getIcon()}
              <span className="capitalize">{block.type} Block</span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMove(block.id, "up")}
                disabled={isFirst}
                className="h-8 w-8"
              >
                <ChevronUp className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMove(block.id, "down")}
                disabled={isLast}
                className="h-8 w-8"
              >
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Move down</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(block.id)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete block</span>
              </Button>
            </div>
          </div>

          {block.type === "text" && (
            <div className="space-y-2">
              <Label htmlFor={`content-${block.id}`}>Rich Text Content</Label>
              <Textarea
                id={`content-${block.id}`}
                placeholder="Enter your text content here. You can use HTML tags like <h2>, <p>, <strong>, <em>, etc."
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports HTML formatting for headings, paragraphs, bold, italic, and more.
              </p>
            </div>
          )}

          {block.type === "image" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`content-${block.id}`}>Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id={`content-${block.id}`}
                    placeholder="https://example.com/image.jpg or /placeholder.svg?height=400&width=800"
                    value={block.content}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Upload image</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter an image URL or use placeholder generator
                </p>
              </div>

              {imagePreview && (
                <div className="rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Content preview"
                    className="w-full h-auto"
                    onError={() => setImagePreview("/placeholder.svg?height=400&width=800")}
                  />
                </div>
              )}
            </div>
          )}

          {block.type === "video" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`content-${block.id}`}>Video URL</Label>
                <Input
                  id={`content-${block.id}`}
                  placeholder="https://example.com/video.mp4 or YouTube/Vimeo embed URL"
                  value={block.content}
                  onChange={(e) => onUpdate(block.id, e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Supports direct video URLs and embed links from YouTube, Vimeo, etc.
                </p>
              </div>

              {block.content && (
                <div className="rounded-lg overflow-hidden border border-border bg-muted aspect-video flex items-center justify-center">
                  {block.content.includes('youtube.com') || block.content.includes('youtu.be') || block.content.includes('vimeo.com') ? (
                    <div className="w-full h-full">
                      <iframe
                        src={block.content}
                        title="Video content"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      src={block.content}
                      controls
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
          )}

          {block.type === "quote" && (
            <div className="space-y-2">
              <Label htmlFor={`content-${block.id}`}>Quote</Label>
              <Textarea
                id={`content-${block.id}`}
                placeholder="Enter quote text..."
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                This will render as a styled quote in the preview.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
