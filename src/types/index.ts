export interface Profile {
  id: string
  created_at: string
  full_name: string
  job_title: string
  company: string
  profile_image: string | null
  bio: string
  email: string
  phone: string
  website: string | null
  social_links: {
    linkedin?: string
    twitter?: string
    github?: string
    instagram?: string
    mastodon?: string
    bluesky?: string
    whatsapp?: string
    signal?: string
    telegram?: string
  }
  custom_theme: {
    primary_color?: string
    background_color?: string
  }
  slug: string
  qr_code_scans: number
  visits: number
  edit_token?: string
}
