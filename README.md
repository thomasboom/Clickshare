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
- **Convex Backend**: Secure data persistence and storage
- **Vercel Deployment**: One-click deployment with custom URLs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Convex
- **Storage**: Convex Storage
- **UI Components**: Lucide React Icons
- **QR Codes**: QRCode.react
- **Theming**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Convex account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Clickshare
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Convex

1. Run the following command to initialize Convex:
```bash
npx convex dev
```

2. Follow the prompts to:
   - Log in with GitHub
   - Create a new project or link to an existing one
   - Save your deployment URLs

This will create the `convex/` directory and sync your functions with the dev deployment.

### 4. Configure Environment Variables

The `npx convex dev` command automatically creates a `.env.local` file with your Convex deployment URL.

If you need to set it manually, create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Convex credentials:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

In one terminal, run:

```bash
npx convex dev
```

In another terminal, run:

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

View your profile's analytics in the [Convex dashboard](https://dashboard.convex.dev) or extend the app to show them in the UI.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add the `NEXT_PUBLIC_CONVEX_URL` environment variable in Vercel settings (use your production Convex URL)
5. Deploy!

To get your production Convex URL:
```bash
npx convex deploy
```

### Custom Domain

1. Go to your Vercel project settings
2. Add your custom domain
3. Update DNS settings as instructed by Vercel

## Database Schema

### profiles table

| Field | Type | Description |
|-------|------|-------------|
| _id | ID | Primary key |
| _creationTime | number | Creation timestamp |
| full_name | string | Full name |
| job_title | string | Job title |
| company | string | Company name |
| profile_image | string? | Profile image storage ID |
| bio | string | Short biography |
| email | string | Email address |
| phone | string | Phone number |
| website | string? | Website URL |
| social_links | object? | Social media URLs |
| custom_theme | object? | Theme customization |
| slug | string | URL slug (unique) |
| visits | number | Total visits |
| qr_code_scans | number | QR code scans |
| edit_token | string | Edit token (unique) |

## Project Structure

```
src/
├── app/
│   ├── [slug]/page.tsx         # Dynamic card pages
│   ├── ConvexClientProvider.tsx  # Convex provider wrapper
│   ├── create/page.tsx          # Card creation form
│   ├── edit/page.tsx            # Card editing form
│   ├── layout.tsx               # Root layout with theme & Convex providers
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/
│   └── theme-provider.tsx       # Theme provider component
├── convex/
│   ├── schema.ts                # Convex database schema
│   ├── profiles.ts              # Profile CRUD operations
│   └── profileImages.ts        # Profile image storage operations
└── types/
    └── index.ts                # TypeScript types
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
