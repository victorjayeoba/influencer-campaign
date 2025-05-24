"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface Video {
  link: string
  postedDate: Date | null
  views: number
}

interface InfluencerFormData {
  username: string
  profileLink: string
  platform: string
  medianViews: number
  totalViews: number
  currentViews: number
  videos: Video[]
  status: string
}

interface InfluencerFormProps {
  onAddInfluencer: (influencer: any) => void
}

export function InfluencerForm({ onAddInfluencer }: InfluencerFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [formData, setFormData] = useState<InfluencerFormData>({
    username: "",
    profileLink: "",
    platform: "",
    medianViews: 0,
    totalViews: 0,
    currentViews: 0,
    videos: [
      { link: "", postedDate: null, views: 0 },
      { link: "", postedDate: null, views: 0 },
      { link: "", postedDate: null, views: 0 },
      { link: "", postedDate: null, views: 0 }
    ],
    status: ""
  })

  const handleInputChange = (field: keyof InfluencerFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVideoChange = (index: number, field: keyof Video, value: any) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.map((video, i) => 
        i === index ? { ...video, [field]: value } : video
      )
    }))
  }

  // Calculate current views as sum of all video views
  const calculateCurrentViews = () => {
    return formData.videos.reduce((sum, video) => sum + (video.views || 0), 0)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      profileLink: "",
      platform: "",
      medianViews: 0,
      totalViews: 0,
      currentViews: 0,
      videos: [
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 },
        { link: "", postedDate: null, views: 0 }
      ],
      status: ""
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username || !formData.profileLink || !formData.platform || !formData.status) {
      alert("Please fill in all required fields")
      return
    }

    const calculatedCurrentViews = calculateCurrentViews()

    const newInfluencer = {
      id: Date.now(),
      username: formData.username,
      profileLink: formData.profileLink,
      platform: formData.platform,
      medianViews: formData.medianViews,
      totalViews: formData.totalViews,
      currentViews: calculatedCurrentViews,
      videos: formData.videos,
      status: formData.status,
      paid: false
    }

    onAddInfluencer(newInfluencer)
    resetForm()
    
    // Show success toast
    toast.success(`🎉 ${newInfluencer.username} added to campaign!`, {
      description: `Platform: ${newInfluencer.platform} | Status: ${newInfluencer.status}`,
    })
  }

  return (
    <div className="space-y-4">
      {/* Form Header with Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Add New Influencer</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Minimize Form
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Expand Form
            </>
          )}
        </Button>
      </div>

      {/* Collapsible Form Content */}
      {isExpanded && (
    <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input 
                id="username" 
                placeholder="@username" 
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required 
              />
        </div>

        <div className="space-y-2">
              <Label htmlFor="profile-link">Profile Link *</Label>
              <Input 
                id="profile-link" 
                placeholder="https://..." 
                value={formData.profileLink}
                onChange={(e) => handleInputChange("profileLink", e.target.value)}
                required 
              />
        </div>

        <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select value={formData.platform} onValueChange={(value) => handleInputChange("platform", value)}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Instagram + TikTok">Instagram + TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
              <Label htmlFor="median-views">Views Median *</Label>
          <Input
            id="median-views"
            type="number"
            min="0"
                value={formData.medianViews || ""}
                onChange={(e) => handleInputChange("medianViews", Number.parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div className="space-y-2">
              <Label htmlFor="total-views">Total Views *</Label>
              <Input 
                id="total-views" 
                type="number" 
                min="0"
                value={formData.totalViews || ""}
                onChange={(e) => handleInputChange("totalViews", Number.parseInt(e.target.value) || 0)}
                required
              />
        </div>

        <div className="space-y-2">
              <Label htmlFor="current-views">Views Now (Auto-calculated)</Label>
              <Input 
                id="current-views" 
                type="number" 
                value={calculateCurrentViews()} 
                readOnly 
                className="bg-slate-50" 
              />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">Video Information</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((num) => (
                <div key={num} className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-bold text-slate-700">Video #{num}</h4>
                  
              <div className="space-y-2">
                    <Label htmlFor={`video-link-${num}`}>Video Link</Label>
                    <Input 
                      id={`video-link-${num}`} 
                      placeholder="https://..." 
                      value={formData.videos[num - 1].link}
                      onChange={(e) => handleVideoChange(num - 1, "link", e.target.value)}
                    />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`posted-date-${num}`}>Posted On</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id={`posted-date-${num}`}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                            !formData.videos[num - 1].postedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                          {formData.videos[num - 1].postedDate ? 
                            format(formData.videos[num - 1].postedDate!, "PPP") : 
                            "Select date"
                          }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                          selected={formData.videos[num - 1].postedDate || undefined}
                          onSelect={(date) => handleVideoChange(num - 1, "postedDate", date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

                  <div className="space-y-2">
                    <Label htmlFor={`video-views-${num}`}>Views</Label>
                    <Input 
                      id={`video-views-${num}`} 
                      type="number" 
                      min="0"
                      placeholder="0"
                      value={formData.videos[num - 1].views || ""}
                      onChange={(e) => handleVideoChange(num - 1, "views", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                    <SelectItem value="Script Needed">Script Needed</SelectItem>
                    <SelectItem value="Approve Needed">Approve Needed</SelectItem>
                    <SelectItem value="Posted">Posted</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Draft Requested">Draft Requested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full md:w-auto">
              Add Influencer
            </Button>
          </div>
        </div>
      </div>
    </form>
      )}
    </div>
  )
}
