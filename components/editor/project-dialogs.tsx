"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ---- Create Project ----

interface CreateProjectDialogProps {
  open: boolean
  nameInput: string
  slug: string
  setName: (value: string) => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  nameInput,
  slug,
  setName,
  onClose,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Project name"
            value={nameInput}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="h-4">
            {slug && (
              <p className="text-xs text-muted-foreground">
                Slug: <span className="font-mono">{slug}</span>
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!nameInput.trim()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- Rename Project ----

interface RenameProjectDialogProps {
  open: boolean
  nameInput: string
  projectName: string
  setName: (value: string) => void
  onClose: () => void
}

export function RenameProjectDialog({
  open,
  nameInput,
  projectName,
  setName,
  onClose,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            Renaming{' '}
            <span className="font-medium text-foreground">{projectName}</span>
          </DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Project name"
          value={nameInput}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && nameInput.trim()) onClose()
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!nameInput.trim()}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---- Delete Project ----

interface DeleteProjectDialogProps {
  open: boolean
  projectName: string
  onClose: () => void
}

export function DeleteProjectDialog({
  open,
  projectName,
  onClose,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{projectName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
