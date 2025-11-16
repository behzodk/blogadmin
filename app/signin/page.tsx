"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { FaGoogle } from "react-icons/fa"

const ALLOWED_EMAIL = "behzodmusurmonqulov@gmail.com"

export default function SignInPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const email = data.session?.user?.email
      if (email === ALLOWED_EMAIL) {
        router.replace("/")
        return
      }
      if (email) {
        router.replace("/sorry")
        return
      }
      setChecking(false)
    }
    checkSession()
  }, [router])

  const handleSignIn = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/",
        scopes: "email profile",
      },
    })
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in with Google to access the dashboard.
        </p>
        {checking ? (
          <div className="text-muted-foreground">Checking session...</div>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            <FaGoogle className="h-4 w-4" />
            Continue with Google
          </button>
        )}
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      </div>
    </div>
  )
}
