"use client"

import { useState } from 'react'

import { WorkspaceNavbar } from '@/components/editor/workspace-navbar'
import { ProjectSidebar } from '@/components/editor/project-sidebar'
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from '@/components/editor/project-dialogs'
import { ShareDialog } from '@/components/editor/share-dialog'
import { CanvasWrapper } from '@/components/editor/canvas-wrapper'
import { useProjectActions, type Project } from '@/hooks/use-project-actions'

interface WorkspaceShellProps {
  project: { id: string; name: string }
  isOwner: boolean
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function WorkspaceShell({ project, isOwner, ownedProjects, sharedProjects }: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const actions = useProjectActions(project.id)

  return (
    <div className="flex h-screen flex-col">
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={isSidebarOpen}
        isAiPanelOpen={isAiPanelOpen}
        onSidebarToggle={() => setIsSidebarOpen((o) => !o)}
        onAiToggle={() => setIsAiPanelOpen((o) => !o)}
        onShareClick={() => setIsShareOpen(true)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
        onNewProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />
      <div className="flex flex-1 overflow-hidden pt-12">
        <main className="relative flex flex-1 overflow-hidden">
          <CanvasWrapper roomId={project.id} />
        </main>
        {isAiPanelOpen && (
          <aside className="w-80 shrink-0 border-l border-border bg-card">
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">AI chat coming soon</p>
            </div>
          </aside>
        )}
      </div>
      <ShareDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={project.id}
        isOwner={isOwner}
      />
      <CreateProjectDialog
        open={actions.createDialog.open}
        nameInput={actions.createDialog.nameInput}
        roomId={actions.createDialog.roomId}
        setName={actions.createDialog.setName}
        onClose={actions.close}
        onConfirm={actions.handleCreate}
      />
      <RenameProjectDialog
        open={actions.renameDialog.open}
        nameInput={actions.renameDialog.nameInput}
        projectName={actions.renameDialog.projectName}
        setName={actions.renameDialog.setName}
        onClose={actions.close}
        onConfirm={actions.handleRename}
      />
      <DeleteProjectDialog
        open={actions.deleteDialog.open}
        projectName={actions.deleteDialog.projectName}
        onClose={actions.close}
        onConfirm={actions.handleDelete}
      />
    </div>
  )
}
