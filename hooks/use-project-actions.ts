"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface Project {
  id: string
  name: string
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function genSuffix(): string {
  return Math.random().toString(36).slice(2, 7)
}

type DialogKind = 'create' | 'rename' | 'delete' | null

export function useProjectActions(activeProjectId?: string) {
  const router = useRouter()
  const [open, setOpen] = useState<DialogKind>(null)
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [suffix, setSuffix] = useState('')

  function openCreate() {
    setNameInput('')
    setSuffix(genSuffix())
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

  async function handleCreate() {
    const name = nameInput.trim()
    if (!name) return
    const slug = toSlug(name)
    const roomId = slug ? `${slug}-${suffix}` : undefined
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ...(roomId ? { id: roomId } : {}) }),
    })
    if (!res.ok) return
    const project: Project = await res.json()
    close()
    router.push(`/editor/${project.id}`)
  }

  async function handleRename() {
    if (!target) return
    const name = nameInput.trim()
    if (!name) return
    const res = await fetch(`/api/projects/${target.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) return
    close()
    router.refresh()
  }

  async function handleDelete() {
    if (!target) return
    const res = await fetch(`/api/projects/${target.id}`, { method: 'DELETE' })
    if (!res.ok) return
    const deletedId = target.id
    close()
    if (activeProjectId === deletedId) {
      router.push('/editor')
    } else {
      router.refresh()
    }
  }

  const slug = toSlug(nameInput)
  const roomId = slug ? `${slug}-${suffix}` : ''

  return {
    openCreate,
    openRename,
    openDelete,
    close,
    handleCreate,
    handleRename,
    handleDelete,
    createDialog: {
      open: open === 'create',
      nameInput,
      roomId,
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
