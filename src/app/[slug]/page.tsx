'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Mail, Phone, Globe, Linkedin, Twitter, Github, Instagram, Download, Share2, Edit, Lock, MessageCircle, Send, MessageSquare, Users, QrCode } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import { Profile } from '@/types'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function BusinessCard() {
  const params = useParams()
  const searchParams = useSearchParams()
  const editToken = searchParams.get('edit_token')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [editLinkCopied, setEditLinkCopied] = useState(false)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  const slug = params.slug as string

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

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

  const copyEditLink = () => {
    if (!profile?.edit_token) return
    const editLink = `${origin}/edit?token=${profile.edit_token}`
    navigator.clipboard.writeText(editLink)
    setEditLinkCopied(true)
    setTimeout(() => setEditLinkCopied(false), 2000)
  }

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

  const shareCard = () => {
    const cleanUrl = `${origin}/${slug}`
    navigator.clipboard.writeText(cleanUrl)
    setShareLinkCopied(true)
    setTimeout(() => setShareLinkCopied(false), 2000)
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
    <div className="min-h-screen py-6 px-3 md:py-12 md:px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs md:text-sm mono text-foreground/40 hover:text-foreground transition-colors mb-6 md:mb-8"
        >
          <span className="w-8 h-8 border border-foreground/20 flex items-center justify-center">←</span>
          <span>BACK</span>
        </Link>

        <div className="border-2 border-foreground bg-card">
          <div className="h-28 md:h-32 bg-foreground/5 flex items-end p-4 md:p-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-background bg-foreground/10 -mb-8 md:-mb-10 overflow-hidden">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold">
                  {profile.full_name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="pt-10 md:pt-14 px-4 md:px-6 pb-4 md:pb-6">
            <p className="text-2xl md:text-3xl font-black tracking-tight mb-1">{profile.full_name}</p>
            <p className="text-base md:text-lg text-foreground/60 mb-1">{profile.job_title}</p>
            {profile.company && (
              <p className="text-xs md:text-sm mono text-accent">{profile.company}</p>
            )}

            {profile.bio && (
              <p className="mt-4 md:mt-6 text-sm md:text-base text-foreground/70 leading-relaxed border-l-2 border-foreground/20 pl-3 md:pl-4">
                {profile.bio}
              </p>
            )}

            <div className="mt-6 md:mt-8 space-y-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm md:text-base break-all">{profile.email}</span>
              </a>

              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm md:text-base">{profile.phone}</span>
              </a>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}

              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Linkedin className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">LinkedIn</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Twitter className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">Twitter</span>
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Github className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">GitHub</span>
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Instagram className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">Instagram</span>
                </a>
              )}
              {socialLinks.mastodon && (
                <a
                  href={socialLinks.mastodon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Users className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">Mastodon</span>
                </a>
              )}
              {socialLinks.bluesky && (
                <a
                  href={socialLinks.bluesky}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">Bluesky</span>
                </a>
              )}
              {socialLinks.whatsapp && (
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">WhatsApp</span>
                </a>
              )}
              {socialLinks.signal && (
                <a
                  href={socialLinks.signal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <MessageSquare className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">Signal</span>
                </a>
              )}
              {socialLinks.telegram && (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-lg touch-manipulation"
                >
                  <Send className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">Telegram</span>
                </a>
              )}
            </div>

            <div className="flex gap-2 mt-4 md:mt-6">
              <button
                onClick={shareCard}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-4 md:px-4 md:py-4 bg-foreground text-background font-bold text-sm hover:bg-accent hover:text-foreground transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareLinkCopied ? 'COPIED!' : 'SHARE'}</span>
              </button>
              <button
                onClick={downloadVCard}
                className="px-4 py-4 md:px-5 md:py-4 bg-foreground/10 font-bold hover:bg-foreground hover:text-background transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className={`px-4 py-4 md:px-5 md:py-4 font-bold transition-colors ${showQR ? 'bg-accent text-foreground' : 'bg-foreground/10 hover:bg-foreground hover:text-background'}`}
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>

            {editToken && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-accent/10 border-2 border-accent rounded-lg">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <Lock className="w-4 h-4 text-foreground" />
                  <span className="font-bold text-xs md:text-sm">YOUR SECRET EDIT LINK</span>
                </div>
                <p className="text-xs mono text-foreground/70 mb-3 break-all">
                  {`${origin}/edit?token=${editToken}`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={copyEditLink}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-3 md:px-4 md:py-3 bg-accent text-foreground font-bold hover:opacity-90 transition-opacity text-xs md:text-sm"
                  >
                    {editLinkCopied ? 'COPIED!' : 'COPY LINK'}
                  </button>
                  <Link
                    href={`/edit?token=${editToken}`}
                    className="flex items-center justify-center px-3 py-3 md:px-4 md:py-3 bg-foreground text-background font-bold hover:bg-accent hover:text-foreground transition-colors text-xs md:text-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs text-foreground/50 mt-3">
                  Save this link to edit your profile later
                </p>
              </div>
            )}

            {showQR && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowQR(false)}>
                <div className="bg-background border-2 border-foreground rounded-lg p-4 md:p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowQR(false)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground"
                  >
                    ×
                  </button>
                  <div className="flex justify-center p-4 md:p-6 bg-white rounded-lg">
                    <QRCodeSVG
                      value={`${origin}/${slug}`}
                      size={Math.min(200, window.innerWidth - 80)}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className="text-center mono text-xs mt-4 text-foreground/40">SCAN TO SAVE</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mono text-xs text-foreground/30 mt-4 md:mt-6">
          MADE WITH CLICKSHARE
        </p>
      </div>
    </div>
  )
}
