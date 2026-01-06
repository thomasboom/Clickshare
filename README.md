# Flick - Digital Business Cards

A modern, responsive Next.js application for creating and sharing digital business cards with QR codes, vCard downloads, and analytics.

## Features

- **Beautiful Digital Cards**: Clean, minimalistic interface with customizable themes
- **QR Code Generation**: Instant scannable QR codes for easy sharing
- **vCard Download**: Export contacts as .vcf files compatible with all devices
- **Social Media Integration**: Link to LinkedIn, Twitter, GitHub, and Instagram
- **Analytics**: Track profile visits and QR code scans
- **Dark/Light Themes**: Built-in theme support with custom color options
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Supabase Backend**: Secure data persistence and storage
- **Vercel Deployment**: One-click deployment with custom URLs

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **UI Components**: Lucide React Icons
- **QR Codes**: QRCode.react
- **Theming**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Clickshare
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy:
   - Project URL
   - anon/public key
3. Create a storage bucket named `profiles` in the Supabase dashboard
4. Run the SQL migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor

### 4. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

### Creating a Card

1. Click "Create Your Card" on the homepage
2. Fill in your profile information
3. Upload a profile picture (optional)
4. Add social media links (optional)
5. Customize your theme color
6. Click "Create Card"

### Sharing Your Card

Your card will be available at: `your-domain.com/slug`

You can:
- Share the URL directly
- Let others scan the QR code
- Share via the share button (mobile)
- Provide the vCard download

### Analytics

View your profile's analytics in the Supabase dashboard or extend the app to show them in the UI.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel settings
5. Deploy!

### Custom Domain

1. Go to your Vercel project settings
2. Add your custom domain
3. Update DNS settings as instructed by Vercel

## Database Schema

### profiles table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| created_at | TIMESTAMP | Creation timestamp |
| full_name | TEXT | Full name |
| job_title | TEXT | Job title |
| company | TEXT | Company name |
| profile_image | TEXT | Profile image URL |
| bio | TEXT | Short biography |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| website | TEXT | Website URL |
| social_links | JSONB | Social media URLs |
| custom_theme | JSONB | Theme customization |
| slug | TEXT | URL slug (unique) |
| visits | INTEGER | Total visits |
| qr_code_scans | INTEGER | QR code scans |

## Project Structure

```
src/
├── app/
│   ├── [slug]/page.tsx      # Dynamic card pages
│   ├── create/page.tsx       # Card creation form
│   ├── layout.tsx            # Root layout with theme provider
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/
│   └── theme-provider.tsx    # Theme provider component
├── lib/
│   └── supabase.ts           # Supabase client
└── types/
    └── index.ts              # TypeScript types
```

## Future Enhancements

- [ ] PDF generation for offline sharing
- [ ] Calendar integration (Google/Outlook)
- [ ] Embedded map location
- [ ] Multiple card designs/templates
- [ ] Analytics dashboard
- [ ] Business card statistics
- [ ] Email notifications
- [ ] Custom branding options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
