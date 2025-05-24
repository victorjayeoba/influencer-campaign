# Influencer Campaign Tracker

A comprehensive web application for managing influencer marketing campaigns, tracking video posts, views, and payment status.

## Features

### 📊 Campaign Dashboard
- Real-time campaign statistics and totals
- Progress tracking with percentage completion
- Payment status overview

### 👥 Influencer Management
- Add influencers with platform details (Instagram, TikTok, or both)
- Track profile links and usernames
- Set median views and total view expectations

### 📹 Video Tracking
- Track up to 4 videos per influencer
- Record video links, post dates, and view counts
- Automatic calculation of current views
- Real reach calculation across all videos

### 📋 Status Management
- Multiple status options: Script Needed, Approve Needed, Posted, In Progress, Draft Requested
- Advanced filtering by status
- Visual status badges with color coding

### 💰 Payment Tracking
- Mark influencers as paid/unpaid
- Payment status confirmation dialogs
- Payment overview in dashboard

### 🎨 Modern UI
- Warm, engaging color scheme (orange, amber, teal)
- Responsive design for all devices
- Clean, professional interface
- Smooth animations and transitions

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd influencer-campaign-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Influencers
1. Use the "Add New Influencer" form at the top
2. Fill in required fields: username, profile link, platform, views median, total views, and status
3. Optionally add video information (links, dates, view counts)
4. Click "Add Influencer" to save

### Managing Videos
- Each influencer can have up to 4 videos tracked
- Add video links, post dates, and view counts
- The "Views Now" field automatically calculates from video view totals

### Filtering and Viewing
- Use the Filter button to show/hide influencers by status
- View real-time totals in the dashboard section
- Click external links to visit influencer profiles or videos

### Payment Management
- Click "Mark as Paid" to update payment status
- Confirmation dialogs prevent accidental changes
- View payment totals in the dashboard

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom warm color palette
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Data Storage**: Local Storage (browser-based)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and color variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── influencer-form.tsx    # Add influencer form
│   ├── influencer-table.tsx   # Main data table
│   ├── status-filter.tsx      # Filter dropdown
│   └── ui/                     # Shadcn/ui components
├── lib/                   # Utility functions
├── styles/               # Additional styles
└── public/               # Static assets
```

## Color Scheme

The app uses a warm, engaging color palette:
- **Primary**: Orange (#F59E0B) - buttons, links, highlights
- **Secondary**: Amber (#D97706) - gradients, accents
- **Accent**: Teal (#14B8A6) - data highlights, "Views Now"
- **Backgrounds**: Warm cream and orange gradients

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For questions or support, please contact [your-email@domain.com]. 