"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
}

export function EditorNavbar({ isSidebarOpen, onSidebarToggle }: EditorNavbarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center border-b border-border bg-background px-3">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex flex-1" />
      <div className="flex items-center" />
    </header>
  )
}
