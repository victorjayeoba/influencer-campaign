"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

interface StatusFilterProps {
  activeFilters: string[]
  onFilterChange: (filters: string[]) => void
}

const statusOptions = ["Script Needed", "Approve Needed", "Posted", "In Progress", "Draft Requested"]

export function StatusFilter({ activeFilters, onFilterChange }: StatusFilterProps) {
  
  const handleStatusToggle = (status: string) => {
    if (activeFilters.includes(status)) {
      // Remove status from filter
      onFilterChange(activeFilters.filter(s => s !== status))
    } else {
      // Add status to filter
      onFilterChange([...activeFilters, status])
    }
  }

  const activeCount = activeFilters.length
  const totalCount = statusOptions.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-orange-200 hover:bg-orange-50 hover:border-orange-300">
          <Filter className="w-4 h-4 text-orange-600" />
          <span>
            Filter {activeCount < totalCount ? `(${activeCount}/${totalCount})` : ''}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((status) => (
          <DropdownMenuCheckboxItem 
            key={status}
            checked={activeFilters.includes(status)} 
            onCheckedChange={() => handleStatusToggle(status)}
          >
            {status}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs hover:bg-teal-50 hover:text-teal-700"
            onClick={() => onFilterChange(statusOptions)}
          >
            Show All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs hover:bg-orange-50 hover:text-orange-700"
            onClick={() => onFilterChange([])}
          >
            Clear All
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
