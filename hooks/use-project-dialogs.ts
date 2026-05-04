"use client"

import { useState } from 'react'

export interface Project {
  id: string
  name: string
  slug: string
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type DialogKind = 'create' | 'rename' | 'delete' | null

export function useProjectDialogs() {
  const [open, setOpen] = useState<DialogKind>(null)
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null)
  const [nameInput, setNameInput] = useState('')

  function openCreate() {
    setNameInput('')
    setOpen('create')
  }

  function openRename(project: { id: string; name: string }) {
    setTarget(project)
    setNameInput(project.name)
    setOpen('rename')
  }

  function openDelete(project: { id: string; name: string }) {
    setTarget(project)
    setOpen('delete')
  }

  function close() {
    setOpen(null)
    setTarget(null)
    setNameInput('')
  }

  return {
    openCreate,
    openRename,
    openDelete,
    close,
    createDialog: {
      open: open === 'create',
      nameInput,
      slug: toSlug(nameInput),
      setName: setNameInput,
    },
    renameDialog: {
      open: open === 'rename',
      nameInput,
      projectName: target?.name ?? '',
      setName: setNameInput,
    },
    deleteDialog: {
      open: open === 'delete',
      projectName: target?.name ?? '',
    },
  }
}
