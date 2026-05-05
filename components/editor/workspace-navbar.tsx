"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  isAiPanelOpen: boolean
  onSidebarToggle: () => void
  onAiToggle: () => void
  onShareClick: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  isAiPanelOpen,
  onSidebarToggle,
  onAiToggle,
  onShareClick,
}: WorkspaceNavbarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center border-b border-border bg-background px-3">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm font-medium">{projectName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShareClick}
          className="text-foreground dark:border-white/25 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <Share2 />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAiToggle}
          data-active={isAiPanelOpen}
          className="text-foreground dark:border-white/25 dark:bg-white/5 dark:hover:bg-white/10 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
        >
          <Sparkles />
          AI
        </Button>
        <UserButton />
      </div>
    </header>
  )
}
