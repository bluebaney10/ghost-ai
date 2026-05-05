"use client"

import { useEffect, useState } from 'react'
import { Check, Link2, X } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CollaboratorDto } from '@/app/api/projects/[projectId]/collaborators/route'

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  projectId: string
  isOwner: boolean
}

export function ShareDialog({ open, onClose, projectId, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorDto[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    fetch(`/api/projects/${projectId}/collaborators`)
      .then((r) => r.json())
      .then((data) => setCollaborators(data.collaborators ?? []))
  }, [open, projectId])

  function handleClose() {
    setEmailInput('')
    onClose()
  }

  async function handleInvite() {
    const email = emailInput.trim()
    if (!email) return
    const res = await fetch(`/api/projects/${projectId}/collaborators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) return
    const { collaborator } = await res.json()
    setCollaborators((prev) => [...prev, collaborator])
    setEmailInput('')
  }

  async function handleRemove(email: string) {
    const res = await fetch(`/api/projects/${projectId}/collaborators`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) return
    setCollaborators((prev) => prev.filter((c) => c.email !== email))
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
        </DialogHeader>

        {isOwner && (
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && emailInput.trim()) handleInvite() }}
            />
            <Button onClick={handleInvite} disabled={!emailInput.trim()}>
              Invite
            </Button>
          </div>
        )}

        <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
          {collaborators.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">No collaborators yet.</p>
          ) : (
            collaborators.map((c) => (
              <div key={c.email} className="flex items-center gap-2 rounded-md px-1 py-1">
                {c.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.avatarUrl}
                    alt={c.displayName ?? c.email}
                    className="size-7 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-7 shrink-0 rounded-full bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  {c.displayName ? (
                    <>
                      <p className="truncate text-sm font-medium">{c.displayName}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                    </>
                  ) : (
                    <p className="truncate text-sm">{c.email}</p>
                  )}
                </div>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemove(c.email)}
                  >
                    <X />
                    <span className="sr-only">Remove {c.email}</span>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCopyLink}>
            {copied ? <Check /> : <Link2 />}
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
