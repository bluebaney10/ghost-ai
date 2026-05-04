"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { EditorNavbar } from '@/components/editor/editor-navbar'
import { ProjectSidebar } from '@/components/editor/project-sidebar'
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from '@/components/editor/project-dialogs'
import { useProjectActions, type Project } from '@/hooks/use-project-actions'
import { Button } from '@/components/ui/button'

interface EditorHomeClientProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <div className="flex h-screen flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onNewProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />
      <main className="flex flex-1 items-center justify-center pt-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <h1 className="text-lg font-semibold">
              Create a project or open an existing one
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a new architecture workspace, or choose a project from the sidebar.
            </p>
          </div>
          <Button onClick={actions.openCreate}>
            <Plus />
            New Project
          </Button>
        </div>
      </main>
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
