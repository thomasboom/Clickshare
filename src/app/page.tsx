'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Plus } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (slug.trim()) {
      router.push(`/${slug.trim()}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 border-b-2 border-foreground">
        <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center font-bold mono rounded-full">
          CS
        </div>
        <button
          onClick={() => router.push('/create')}
          className="group flex items-center gap-2 px-5 py-2 bg-foreground text-background font-bold text-sm transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>MAKE ONE</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-4xl">
          <div className="mb-12">
            <h1 className="display-text leading-none">
              <span className="block">WHO</span>
              <span className="block">ARE</span>
              <span className="block text-accent">YOU</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl font-medium text-foreground/60 mb-12 max-w-xl">
            A link in bio. But honest. No algorithms. No tracking. No "engagement metrics." Just you.
          </p>

          <form onSubmit={handleSearch} className="max-w-lg mb-12">
            <div className="flex border-2 border-foreground bg-card">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="find someone..."
                className="flex-1 px-6 py-4 bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none text-lg font-medium"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-foreground text-background font-bold hover:bg-accent hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm mono text-foreground/40">
            <span>// FREE FOREVER</span>
            <span>// NO ACCOUNT NEEDED</span>
            <span>// YOUR DATA IS YOURS</span>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-foreground p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <p className="mono text-sm text-foreground/40">MADE WITH CLICKSHARE</p>
          <p className="mono text-sm text-foreground/40">2026</p>
        </div>
      </footer>

      {mounted && (
        <div className="fixed bottom-6 right-6 mono text-xs text-foreground/30 hidden md:block">
          2026
        </div>
      )}
    </div>
  )
}
