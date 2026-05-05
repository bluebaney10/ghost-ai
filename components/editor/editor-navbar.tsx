"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  onShareClick?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  onShareClick,
}: EditorNavbarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center border-b border-border px-3">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex flex-1" />
      <div
        className="flex items-center gap-2"
        style={{ backgroundColor: "blue" }}
      >
        {onShareClick && (
          <Button variant="outline" size="sm" onClick={onShareClick}>
            <Share2 />
            Share
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}
