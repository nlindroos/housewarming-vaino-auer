# 🏠 House Warming Party RSVP

A fun, colorful RSVP application for your house warming party! Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✨ Beautiful, responsive design with a silly party theme
- 🎉 Interactive RSVP form with first name, last name, attendance status, and guest count
- 💌 Optional message field for dietary restrictions or excitement notes
- 🚀 Real-time form validation and submission
- 📱 Mobile-friendly design
- 🎈 Capacity management (max 100 guests)
- 🎊 Fun animations and emojis throughout

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd housewarming-vaino-auer
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Option 1: Vercel (Recommended - Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project" and import your repository
4. Deploy! Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Netlify (Free)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up/login
3. Click "New site from Git" and connect your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Deploy!

### Option 3: Railway (Free tier available)

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign up/login
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository and deploy

## Customization

### Changing the Theme

Edit the colors in `src/app/page.tsx`:

- Background gradient: `from-pink-400 via-purple-500 to-indigo-600`
- Button colors: `from-pink-500 to-purple-600`
- Border colors: `border-purple-200`

### Updating Party Details

Modify the text content in `src/app/page.tsx`:

- Party title and description
- Form labels and placeholders
- Footer information

### Adding More Fields

To add additional RSVP fields:

1. Update the `RSVPForm` interface
2. Add form controls to the JSX
3. Update the API route validation

## API Endpoints

- `POST /api/rsvp` - Submit an RSVP
- `GET /api/rsvp` - Get all RSVP responses (for admin purposes)

## Data Storage

Currently uses in-memory storage for demo purposes. For production:

1. **Supabase** (Free tier): PostgreSQL database with real-time features
2. **PlanetScale** (Free tier): MySQL database
3. **MongoDB Atlas** (Free tier): NoSQL database
4. **Vercel KV** (Redis): For simple key-value storage

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this for your own parties! 🎉
