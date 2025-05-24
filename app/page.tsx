"use client"

import { useState, useEffect } from "react"
import { InfluencerForm } from "@/components/influencer-form"
import { InfluencerTable } from "@/components/influencer-table"
import { StatusFilter } from "@/components/status-filter"

interface Video {
  link: string
  postedDate: Date | null
  views: number
}

interface Influencer {
  id: number
  username: string
  profileLink: string
  platform: string
  medianViews: number
  totalViews: number
  currentViews: number
  videos: Video[]
  status: string
  paid: boolean
}

export default function Home() {
  // Default demo data that always stays
  const demoInfluencers: Influencer[] = [
    {
      id: 1,
      username: "@charlidamelio",
      profileLink: "https://www.tiktok.com/@charlidamelio",
      platform: "TikTok",
      medianViews: 2500000,
      totalViews: 3000000,
      currentViews: 2847500,
      videos: [
        { link: "https://www.tiktok.com/@charlidamelio/video/7300000000000000000", postedDate: new Date('2024-01-15'), views: 1200000 },
        { link: "https://www.tiktok.com/@charlidamelio/video/7300000000000000001", postedDate: new Date('2024-01-18'), views: 847500 },
        { link: "https://www.tiktok.com/@charlidamelio/video/7300000000000000002", postedDate: new Date('2024-01-22'), views: 800000 },
        { link: "", postedDate: null, views: 0 }
      ],
      status: "Posted",
      paid: true
    },
    {
      id: 2,
      username: "@addisonre",
      profileLink: "https://www.tiktok.com/@addisonre",
      platform: "TikTok",
      medianViews: 1800000,
      totalViews: 2200000,
      currentViews: 950000,
      videos: [
        { link: "https://www.tiktok.com/@addisonre/video/7310000000000000000", postedDate: new Date('2024-01-20'), views: 950000 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 }
      ],
      status: "Posted",
      paid: false
    },
    {
      id: 3,
      username: "@khaby.lame",
      profileLink: "https://www.tiktok.com/@khaby.lame",
      platform: "TikTok",
      medianViews: 15000000,
      totalViews: 18000000,
      currentViews: 0,
      videos: [
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 }
      ],
      status: "In Progress",
      paid: false
    },
    {
      id: 4,
      username: "@bellapoarch",
      profileLink: "https://www.tiktok.com/@bellapoarch",
      platform: "TikTok",
      medianViews: 3200000,
      totalViews: 4000000,
      currentViews: 0,
      videos: [
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 }
      ],
      status: "Script Needed",
      paid: false
    },
    {
      id: 5,
      username: "@spencerx",
      profileLink: "https://www.tiktok.com/@spencerx",
      platform: "TikTok",
      medianViews: 850000,
      totalViews: 1200000,
      currentViews: 0,
      videos: [
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 }
      ],
      status: "Approve Needed",
      paid: false
    }
  ]

  const [influencers, setInfluencers] = useState<Influencer[]>(demoInfluencers)
  const [statusFilter, setStatusFilter] = useState<string[]>(["Script Needed", "Approve Needed", "Posted", "In Progress", "Draft Requested"])

  // Load user-added data from localStorage and merge with demo data
  useEffect(() => {
    const savedUserInfluencers = localStorage.getItem('userInfluencers')
    if (savedUserInfluencers) {
      try {
        const parsed = JSON.parse(savedUserInfluencers)
        // Convert date strings back to Date objects and recalculate currentViews for user data
        const userInfluencersWithDates = parsed.map((inf: any) => {
          const videosWithDates = inf.videos.map((video: any) => ({
            ...video,
            postedDate: video.postedDate ? new Date(video.postedDate) : null
          }))
          
          // Recalculate currentViews from actual video views to ensure consistency
          const recalculatedCurrentViews = videosWithDates.reduce((sum: number, video: any) => sum + (video.views || 0), 0)
          
          return {
            ...inf,
            videos: videosWithDates,
            currentViews: recalculatedCurrentViews
          }
        })
        
        // Merge demo data with user data
        setInfluencers([...demoInfluencers, ...userInfluencersWithDates])
      } catch (error) {
        console.error('Error loading user influencers from localStorage:', error)
        // If error, just use demo data
        setInfluencers(demoInfluencers)
      }
    }
  }, [])

  // Save only user-added influencers to localStorage (exclude demo data)
  useEffect(() => {
    // Filter out demo influencers (IDs 1-5) and save only user-added ones
    const userInfluencers = influencers.filter(inf => inf.id > 5)
    localStorage.setItem('userInfluencers', JSON.stringify(userInfluencers))
  }, [influencers])

  const addInfluencer = (newInfluencer: Influencer) => {
    setInfluencers(prev => [...prev, newInfluencer])
  }

  const updateInfluencer = (id: number, updates: Partial<Influencer>) => {
    setInfluencers(prev => 
      prev.map(inf => inf.id === id ? { ...inf, ...updates } : inf)
    )
  }

  const deleteInfluencer = (id: number) => {
    setInfluencers(prev => prev.filter(inf => inf.id !== id))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold-display tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent sm:text-5xl">Influencer Campaign Tracker</h1>
          <p className="mt-3 text-lg font-medium text-slate-700">Track and manage influencer posts for your marketing campaigns</p>
        </header>

        <div className="p-6 mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100">
          <InfluencerForm onAddInfluencer={addInfluencer} />
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
            <h2 className="text-xl font-heading text-slate-800">Campaign Dashboard</h2>
            <StatusFilter 
              activeFilters={statusFilter} 
              onFilterChange={setStatusFilter} 
            />
          </div>
          <InfluencerTable 
            influencers={influencers}
            onUpdateInfluencer={updateInfluencer}
            onDeleteInfluencer={deleteInfluencer}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </main>
  )
}
