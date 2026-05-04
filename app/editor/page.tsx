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
import { useProjectDialogs } from '@/hooks/use-project-dialogs'
import { Button } from '@/components/ui/button'

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <div className="flex h-screen flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={dialogs.openCreate}
        onRenameProject={dialogs.openRename}
        onDeleteProject={dialogs.openDelete}
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
          <Button onClick={dialogs.openCreate}>
            <Plus />
            New Project
          </Button>
        </div>
      </main>
      <CreateProjectDialog
        open={dialogs.createDialog.open}
        nameInput={dialogs.createDialog.nameInput}
        slug={dialogs.createDialog.slug}
        setName={dialogs.createDialog.setName}
        onClose={dialogs.close}
      />
      <RenameProjectDialog
        open={dialogs.renameDialog.open}
        nameInput={dialogs.renameDialog.nameInput}
        projectName={dialogs.renameDialog.projectName}
        setName={dialogs.renameDialog.setName}
        onClose={dialogs.close}
      />
      <DeleteProjectDialog
        open={dialogs.deleteDialog.open}
        projectName={dialogs.deleteDialog.projectName}
        onClose={dialogs.close}
      />
    </div>
  )
}
