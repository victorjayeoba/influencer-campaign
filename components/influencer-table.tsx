"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, CheckCircle, ExternalLink } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

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

interface InfluencerTableProps {
  influencers: Influencer[]
  onUpdateInfluencer: (id: number, updates: Partial<Influencer>) => void
  onDeleteInfluencer: (id: number) => void
  statusFilter: string[]
}

export function InfluencerTable({ 
  influencers, 
  onUpdateInfluencer, 
  onDeleteInfluencer, 
  statusFilter 
}: InfluencerTableProps) {

  // Helper function to ensure URLs have proper protocol
  const formatUrl = (url: string): string => {
    if (!url) return '#'
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `https://${url}`
  }

  // Helper function to display platform/@username format
  const getProfileDisplayText = (platform: string, username: string): string => {
    return username.startsWith('@') ? username : `@${username}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Posted":
        return "bg-green-100 text-green-800"
      case "Approve Needed":
        return "bg-yellow-100 text-yellow-800"
      case "Script Needed":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-purple-100 text-purple-800"
      case "Draft Requested":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const handleTogglePaid = (influencer: Influencer) => {
    const newPaidStatus = !influencer.paid
    onUpdateInfluencer(influencer.id, { paid: newPaidStatus })
    
    if (newPaidStatus) {
      toast.success(`✅ ${influencer.username} marked as paid!`, {
        description: "Payment status updated successfully",
      })
    } else {
      toast.info(`💰 ${influencer.username} marked as unpaid`, {
        description: "Payment status updated",
      })
    }
  }

  const handleDeleteInfluencer = (influencer: Influencer) => {
    onDeleteInfluencer(influencer.id)
    toast.success(`🗑️ ${influencer.username} deleted`, {
      description: "Influencer removed from campaign",
    })
  }

  // Filter influencers based on status filter
  const filteredInfluencers = influencers.filter(influencer => 
    statusFilter.length === 0 || statusFilter.includes(influencer.status)
  )

  // Calculate campaign totals - matching Excel logic
  const campaignStats = {
    totalInfluencers: filteredInfluencers.length,
    totalViewsSum: filteredInfluencers.reduce((sum, inf) => sum + inf.totalViews, 0),
    medianViewsSum: filteredInfluencers.reduce((sum, inf) => sum + inf.medianViews, 0),
    video1Views: filteredInfluencers.reduce((sum, inf) => sum + (inf.videos[0]?.views || 0), 0),
    video2Views: filteredInfluencers.reduce((sum, inf) => sum + (inf.videos[1]?.views || 0), 0),
    video3Views: filteredInfluencers.reduce((sum, inf) => sum + (inf.videos[2]?.views || 0), 0),
    video4Views: filteredInfluencers.reduce((sum, inf) => sum + (inf.videos[3]?.views || 0), 0),
  }

  // Real Reach calculation (sum of all individual video views) - this should be the same as Views Now
  const realReach = campaignStats.video1Views + campaignStats.video2Views + campaignStats.video3Views + campaignStats.video4Views
  
  // Views Now should be the same as Real Reach - calculated from actual video views
  const currentViewsSum = realReach

  if (influencers.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No influencers added yet. Use the form above to add your first influencer!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Campaign Totals Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-lg">
        <div className="text-center">
          <div className="text-xl font-black text-slate-800 font-mono">{campaignStats.totalInfluencers}</div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Influencers</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-slate-800 font-mono">{campaignStats.totalViewsSum.toLocaleString()}</div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-green-600 font-mono">{realReach.toLocaleString()}</div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Real Reach</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-slate-800 font-mono">
            {campaignStats.totalViewsSum > 0 ? 
              (() => {
                const percentage = (currentViewsSum / campaignStats.totalViewsSum) * 100;
                return percentage < 1 && percentage > 0 ? 
                  percentage.toFixed(1) + '%' : 
                  Math.round(percentage) + '%';
              })() : 
              '0%'
            }
          </div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Progress</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black text-slate-800 font-mono">
            {filteredInfluencers.filter(inf => inf.paid).length}
          </div>
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Paid</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border rounded-lg custom-scrollbar">
      <Table>
        <TableHeader>
            <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
              <TableHead className="font-bold w-40">Username</TableHead>
              <TableHead className="font-bold w-32">Platform</TableHead>
              <TableHead className="font-bold w-28 text-right">Views Median</TableHead>
              <TableHead className="font-bold w-28 text-right">Total Views</TableHead>
              <TableHead className="font-bold w-28 text-right">Views Now</TableHead>
              <TableHead className="font-bold w-24 text-center">Video #1</TableHead>
              <TableHead className="font-bold w-24 text-center">Video #2</TableHead>
              <TableHead className="font-bold w-24 text-center">Video #3</TableHead>
              <TableHead className="font-bold w-24 text-center">Video #4</TableHead>
              <TableHead className="font-bold w-32">Status</TableHead>
              <TableHead className="font-bold w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {filteredInfluencers.map((influencer) => (
              <TableRow key={influencer.id} className="hover:bg-orange-50/50">
                <TableCell className="font-medium w-40">
                  <div>
                    <div className="font-semibold">{influencer.username}</div>
                    <a 
                      href={formatUrl(influencer.profileLink)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                    >
                      {getProfileDisplayText(influencer.platform, influencer.username)} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </TableCell>
                
                <TableCell className="w-32">
                  <Badge variant="outline" className="text-xs">
                    {influencer.platform}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right font-mono w-28">
                  {influencer.medianViews.toLocaleString()}
                </TableCell>
                
                <TableCell className="text-right font-mono font-semibold w-28">
                  {influencer.totalViews.toLocaleString()}
                </TableCell>
                
                <TableCell className="text-right font-mono text-teal-600 font-semibold w-28">
                  {influencer.currentViews.toLocaleString()}
                </TableCell>

                {/* Video columns */}
                {[0, 1, 2, 3].map((videoIndex) => (
                  <TableCell key={videoIndex} className="text-center w-24">
                    <div className="space-y-1">
                      {influencer.videos[videoIndex]?.link ? (
                        <>
                          <a 
                            href={formatUrl(influencer.videos[videoIndex].link)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 hover:underline text-xs flex items-center justify-center gap-1"
                          >
                            Video <ExternalLink className="w-3 h-3" />
                          </a>
                          <div className="text-xs text-slate-500">
                            {influencer.videos[videoIndex].postedDate ? 
                              format(influencer.videos[videoIndex].postedDate, "MM/dd/yyyy") : 
                              "No date"
                            }
                          </div>
                          <div className="text-xs font-mono font-semibold text-teal-600">
                            {(influencer.videos[videoIndex].views || 0).toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400">-</div>
                      )}
                    </div>
                  </TableCell>
                ))}

                <TableCell className="w-32">
                <Badge variant="outline" className={getStatusColor(influencer.status)}>
                  {influencer.status}
                </Badge>
              </TableCell>
                
                <TableCell className="text-right w-32">
                  <div className="flex items-center justify-end gap-1">
                    {/* Mark as Paid Button with Confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                          className={`text-xs ${influencer.paid ? "bg-green-50 text-green-600" : ""}`}
                  >
                    {influencer.paid ? (
                      <>
                              <CheckCircle className="w-3 h-3 mr-1" /> Paid
                      </>
                    ) : (
                      "Mark as Paid"
                    )}
                  </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {influencer.paid ? "Mark as Unpaid?" : "Mark as Paid?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {influencer.paid 
                              ? `Are you sure you want to mark ${influencer.username} as unpaid? This will update their payment status.`
                              : `Are you sure you want to mark ${influencer.username} as paid? This will update their payment status.`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleTogglePaid(influencer)}>
                            {influencer.paid ? "Mark Unpaid" : "Mark Paid"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete Button with Confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 text-xs p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                  </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Influencer?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {influencer.username}? This action cannot be undone and will permanently remove this influencer from your campaign.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteInfluencer(influencer)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Totals Row */}
            <TableRow className="bg-gradient-to-r from-amber-100 to-orange-100 font-semibold border-t-2 border-orange-300">
              <TableCell className="font-bold w-40">TOTALS</TableCell>
              <TableCell className="w-32">-</TableCell>
              <TableCell className="text-right font-mono w-28">
                {campaignStats.medianViewsSum.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-mono font-bold w-28">
                {campaignStats.totalViewsSum.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-mono font-bold text-teal-600 w-28">
                {currentViewsSum.toLocaleString()}
              </TableCell>
              <TableCell className="text-center font-mono font-bold text-teal-600 w-24">
                {campaignStats.video1Views.toLocaleString()}
              </TableCell>
              <TableCell className="text-center font-mono font-bold text-teal-600 w-24">
                {campaignStats.video2Views.toLocaleString()}
              </TableCell>
              <TableCell className="text-center font-mono font-bold text-teal-600 w-24">
                {campaignStats.video3Views.toLocaleString()}
              </TableCell>
              <TableCell className="text-center font-mono font-bold text-teal-600 w-24">
                {campaignStats.video4Views.toLocaleString()}
              </TableCell>
              <TableCell className="w-32">
                <div className="text-xs font-bold text-teal-600">
                  Real Reach: {realReach.toLocaleString()}
                </div>
              </TableCell>
              <TableCell className="w-32">-</TableCell>
            </TableRow>
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
