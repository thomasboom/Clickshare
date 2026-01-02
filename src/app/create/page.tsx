'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { Upload, ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

export default function CreateCard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    slug: '',
    linkedin: '',
    twitter: '',
    github: '',
    instagram: '',
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = getSupabaseClient()

    if (!supabase) {
      alert('Please configure Supabase environment variables')
      setLoading(false)
      return
    }

    try {
      let imageUrl = null

      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, profileImage)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            full_name: formData.full_name,
            job_title: formData.job_title,
            company: formData.company,
            bio: formData.bio,
            email: formData.email,
            phone: formData.phone,
            website: formData.website || null,
            slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
            profile_image: imageUrl,
            social_links: {
              linkedin: formData.linkedin || undefined,
              twitter: formData.twitter || undefined,
              github: formData.github || undefined,
              instagram: formData.instagram || undefined,
            },
            custom_theme: {},
            visits: 0,
            qr_code_scans: 0,
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/${formData.slug}`)
    } catch (error) {
      console.error('Error creating profile:', error)
      alert('Error creating profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mono text-foreground/40 hover:text-foreground transition-colors mb-8"
        >
          <span className="w-8 h-8 border border-foreground/20 flex items-center justify-center">←</span>
          <span>BACK</span>
        </Link>

        <div className="border-2 border-foreground bg-card">
          <div className="p-6 border-b-2 border-foreground">
            <div className="display-text">NEW CARD</div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-foreground/5 border-2 border-foreground flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-black text-foreground/20">?</span>
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
                <div className="flex items-center bg-foreground/5 border-2 border-foreground">
                  <span className="px-4 py-3 font-mono text-sm text-foreground/40">/</span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="your-name"
                    className="flex-1 px-2 py-3 bg-transparent font-mono text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-bold text-sm">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium"
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
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium"
                    placeholder="WHAT YOU DO"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-sm">COMPANY</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium"
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
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium"
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
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium"
                    placeholder="+1 555 000 0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-sm">WEBSITE</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-medium"
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
                  className="w-full px-4 py-4 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors resize-none font-medium"
                  placeholder="TELL PEOPLE ABOUT YOURSELF..."
                />
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-sm">LINKS</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="LINKEDIN"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm"
                  />
                  <input
                    type="url"
                    placeholder="TWITTER"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm"
                  />
                  <input
                    type="url"
                    placeholder="GITHUB"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm"
                  />
                  <input
                    type="url"
                    placeholder="INSTAGRAM"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-3 bg-foreground/5 border-2 border-foreground focus:bg-foreground/10 focus:outline-none transition-colors font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-5 bg-foreground text-background font-bold text-lg hover:bg-accent hover:text-foreground transition-colors"
            >
              {loading ? (
                <span className="mono">CREATING...</span>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>CREATE CARD</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
