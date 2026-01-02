'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Mail, Phone, Globe, Linkedin, Twitter, Github, Instagram, Download, Share2 } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import { Profile } from '@/types'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function BusinessCard() {
  const params = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const slug = params.slug as string

  useEffect(() => {
    async function fetchProfile() {
      const supabase = getSupabaseClient()

      if (!supabase) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setProfile(data)

        await supabase
          .from('profiles')
          .update({ visits: (data.visits || 0) + 1 })
          .eq('id', data.id)
      }

      setLoading(false)
    }

    if (slug) {
      fetchProfile()
    }
  }, [slug])

  const downloadVCard = () => {
    if (!profile) return

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name}
TITLE:${profile.job_title}
ORG:${profile.company}
EMAIL:${profile.email}
TEL:${profile.phone}
URL:${profile.website || ''}
NOTE:${profile.bio}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.full_name.replace(/\s+/g, '_')}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareCard = async () => {
    if (navigator.share && profile) {
      try {
        await navigator.share({
          title: `${profile.full_name}'s Digital Card`,
          text: `Check out ${profile.full_name}'s digital business card!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="mono text-sm text-foreground/40">loading...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center">
          <div className="display-text mb-4">404</div>
          <p className="body-text text-foreground/50 mb-8">This person doesn't exist here.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-foreground text-background font-bold text-sm"
          >
            MAKE YOUR OWN
          </Link>
        </div>
      </div>
    )
  }

  const socialLinks = profile.social_links || {}

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mono text-foreground/40 hover:text-foreground transition-colors mb-8"
        >
          <span className="w-8 h-8 border border-foreground/20 flex items-center justify-center">←</span>
          <span>BACK</span>
        </Link>

        <div className="border-2 border-foreground bg-card">
          <div className="h-32 bg-foreground/5 flex items-end p-6">
            <div className="w-20 h-20 rounded-full border-4 border-background bg-foreground/10 -mb-10 overflow-hidden">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                  {profile.full_name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="pt-14 px-6 pb-6">
            <h1 className="text-3xl font-black tracking-tight mb-1">{profile.full_name}</h1>
            <p className="text-lg text-foreground/60 mb-1">{profile.job_title}</p>
            {profile.company && (
              <p className="text-sm mono text-accent">{profile.company}</p>
            )}

            {profile.bio && (
              <p className="mt-6 text-foreground/70 leading-relaxed border-l-2 border-foreground/20 pl-4">
                {profile.bio}
              </p>
            )}

            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 p-3 bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">{profile.email}</span>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-4 p-3 bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">{profile.phone}</span>
              </a>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-medium truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>

            {(socialLinks.linkedin || socialLinks.twitter || socialLinks.github || socialLinks.instagram) && (
              <div className="flex gap-2 mt-6">
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-foreground text-background hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={downloadVCard}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-foreground text-background font-bold hover:bg-accent hover:text-foreground transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>SAVE</span>
              </button>
              <button
                onClick={shareCard}
                className="px-5 py-4 bg-foreground/10 font-bold hover:bg-foreground hover:text-background transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className={`px-5 py-4 font-bold transition-colors ${showQR ? 'bg-accent text-foreground' : 'bg-foreground/10 hover:bg-foreground hover:text-background'}`}
              >
                QR
              </button>
            </div>

            {showQR && (
              <div className="mt-6 p-4 bg-background border-2 border-foreground">
                <div className="flex justify-center p-4 bg-white">
                  <QRCodeSVG
                    value={window.location.href}
                    size={180}
                    level="H"
                    includeMargin
                  />
                </div>
                <p className="text-center mono text-xs mt-3 text-foreground/40">SCAN TO SAVE</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mono text-xs text-foreground/30 mt-6">
          MADE WITH CLICKSHARE
        </p>
      </div>
    </div>
  )
}
