"use client"

import { Pencil, Plus, Share2, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/hooks/use-project-actions"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProjectId?: string
  onNewProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
  onShareProject?: (project: Project) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onNewProject,
  onRenameProject,
  onDeleteProject,
  onShareProject,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-12 left-0 z-30 flex h-[calc(100vh-3rem)] w-64 flex-col overflow-hidden border-r border-border bg-card shadow-xl transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Projects</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-2 flex flex-col gap-0.5">
              {ownedProjects.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No projects yet.
                </p>
              ) : (
                ownedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted",
                      project.id === activeProjectId && "bg-muted"
                    )}
                  >
                    <span className="truncate text-sm">{project.name}</span>
                    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      {onShareProject && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onShareProject(project)}
                        >
                          <Share2 />
                          <span className="sr-only">Share</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onRenameProject(project)}
                      >
                        <Pencil />
                        <span className="sr-only">Rename</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDeleteProject(project)}
                      >
                        <Trash2 />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-2 flex flex-col gap-0.5">
              {sharedProjects.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No shared projects.
                </p>
              ) : (
                sharedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center rounded-md px-2 py-1.5 hover:bg-muted"
                  >
                    <span className="truncate text-sm">{project.name}</span>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-border p-3">
          <Button className="w-full" size="sm" onClick={onNewProject}>
            <Plus />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
