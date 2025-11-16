"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function SorryPage() {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      const email = data.session?.user?.email
      if (!data.session) {
        router.replace("/signin")
      } else if (email === "behzodmusurmonqulov@gmail.com") {
        router.replace("/")
      }
    }
    check()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace("/signin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm space-y-4">
        <h1 className="text-2xl font-semibold text-destructive">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          This dashboard is only available to behzodmusurmonqulov@gmail.com.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-accent"
          >
            Sign out
          </button>
          <button
            onClick={() => router.replace("/signin")}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Switch account
          </button>
        </div>
      </div>
    </div>
  )
}
