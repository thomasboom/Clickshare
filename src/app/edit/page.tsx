'use client'

import Image from 'next/image'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Upload } from 'lucide-react'
import Link from 'next/link'

function EditCardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [saving, setSaving] = useState(false)
  const updateProfile = useMutation(api.profiles.update)
  const generateUploadUrl = useMutation(api.profileImages.generateUploadUrl)
  const profileData = useQuery(api.profiles.getByEditToken, token ? { editToken: token } : "skip")

  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
    github: '',
    instagram: '',
    mastodon: '',
    bluesky: '',
    whatsapp: '',
    signal: '',
    telegram: '',
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name,
        job_title: profileData.job_title,
        company: profileData.company,
        bio: profileData.bio,
        email: profileData.email,
        phone: profileData.phone,
        website: profileData.website || '',
        linkedin: profileData.social_links?.linkedin || '',
        twitter: profileData.social_links?.twitter || '',
        github: profileData.social_links?.github || '',
        instagram: profileData.social_links?.instagram || '',
        mastodon: profileData.social_links?.mastodon || '',
        bluesky: profileData.social_links?.bluesky || '',
        whatsapp: profileData.social_links?.whatsapp || '',
        signal: profileData.social_links?.signal || '',
        telegram: profileData.social_links?.telegram || '',
      })
      setPreviewImage(profileData.profile_image || null)
    }
  }, [profileData])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (!profileData) {
      alert('Profile not found')
      setSaving(false)
      return
    }

    try {
      let imageUrl = profileData.profile_image

      if (profileImage) {
        const { uploadUrl, storageId } = await generateUploadUrl()

        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          body: profileImage,
        })

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image')
        }

        imageUrl = storageId
      }

      await updateProfile({
        id: profileData._id,
        full_name: formData.full_name,
        job_title: formData.job_title,
        company: formData.company,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || undefined,
        profile_image: imageUrl || undefined,
        social_links: {
          linkedin: formData.linkedin || undefined,
          twitter: formData.twitter || undefined,
          github: formData.github || undefined,
          instagram: formData.instagram || undefined,
          mastodon: formData.mastodon || undefined,
          bluesky: formData.bluesky || undefined,
          whatsapp: formData.whatsapp || undefined,
          signal: formData.signal || undefined,
          telegram: formData.telegram || undefined,
        },
      })

      router.push(`/${profileData.slug}`)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!profileData && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center">
          <div className="display-text mb-4">ERROR</div>
          <p className="body-text text-foreground/50 mb-8">Invalid edit link</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-foreground text-background font-bold text-sm"
          >
            GO HOME
          </Link>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="mono text-sm text-foreground/40">loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-3 md:py-12 md:px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/${profileData.slug}`}
          className="inline-flex items-center gap-2 text-xs md:text-sm mono text-foreground/40 hover:text-foreground transition-colors mb-6 md:mb-8"
        >
          <span className="w-8 h-8 border border-foreground/20 flex items-center justify-center">←</span>
          <span>BACK</span>
        </Link>

        <div className="border-2 border-foreground bg-card rounded-lg md:rounded-none">
          <div className="p-4 md:p-6 border-b-2 border-foreground">
            <div className="text-xl md:display-text">EDIT CARD</div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6 md:space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-foreground/5 border-2 border-foreground flex items-center justify-center">
                  {previewImage ? (
                    <Image src={previewImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <span className="text-4xl md:text-5xl font-black text-foreground/20">?</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 border-2 border-foreground">
                  <Upload className="w-4 h-4 text-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="w-full">
                <label className="block mono text-xs text-foreground/40 mb-2">YOUR LINK</label>
                <div className="flex items-center bg-foreground/5 border-2 border-foreground rounded-lg overflow-hidden">
                  <span className="px-3 py-3 md:px-4 md:py-3 font-mono text-sm text-foreground/40">/</span>
                  <input
                    type="text"
                    value={profileData.slug}
                    disabled
                    className="flex-1 px-2 py-3 md:px-2 md:py-3 bg-transparent font-mono text-sm focus:outline-none opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <label className="block font-bold text-sm">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium rounded-lg"
                    placeholder="YOUR NAME"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-sm">TITLE</label>
                  <input
                    type="text"
                    required
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium rounded-lg"
                    placeholder="WHAT YOU DO"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-sm">COMPANY</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium rounded-lg"
                    placeholder="WHERE YOU WORK"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-sm">EMAIL</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium rounded-lg"
                    placeholder="EMAIL@EXAMPLE.COM"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-sm">PHONE</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium rounded-lg"
                    placeholder="+1 555 000 0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-sm">WEBSITE</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium rounded-lg"
                    placeholder="HTTPS://YOURSITE.COM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-sm">ABOUT</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors resize-none font-medium rounded-lg"
                  placeholder="TELL PEOPLE ABOUT YOURSELF..."
                />
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-sm">LINKS</label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <input
                    type="url"
                    placeholder="LINKEDIN"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="TWITTER"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="GITHUB"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="INSTAGRAM"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="MASTODON"
                    value={formData.mastodon}
                    onChange={(e) => setFormData({ ...formData, mastodon: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="BLUESKY"
                    value={formData.bluesky}
                    onChange={(e) => setFormData({ ...formData, bluesky: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="WHATSAPP"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="SIGNAL"
                    value={formData.signal}
                    onChange={(e) => setFormData({ ...formData, signal: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="TELEGRAM"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm rounded-lg md:col-span-2"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 md:py-5 bg-foreground text-background font-bold text-base md:text-lg hover:bg-accent hover:text-foreground transition-colors rounded-lg touch-manipulation"
            >
              {saving ? (
                <span className="mono">SAVING...</span>
              ) : (
                <span>SAVE CHANGES</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function EditCard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="mono text-sm text-foreground/40">loading...</div>
      </div>
    }>
      <EditCardContent />
    </Suspense>
  )
}
