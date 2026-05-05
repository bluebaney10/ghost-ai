import { redirect } from 'next/navigation'

import { getIdentity, getProjectWithAccess } from '@/lib/project-access'
import { prisma } from '@/lib/prisma'
import { AccessDenied } from '@/components/editor/access-denied'
import { WorkspaceShell } from '@/components/editor/workspace-shell'

interface Props {
  params: Promise<{ roomId: string }>
}

export default async function WorkspacePage({ params }: Props) {
  const { roomId } = await params

  const identity = await getIdentity()
  if (!identity) {
    redirect('/sign-in')
  }

  const project = await getProjectWithAccess(roomId, identity)
  if (!project) {
    return <AccessDenied />
  }

  const [ownedProjects, collaboratorEntries] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: identity.userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true },
    }),
    identity.email
      ? prisma.projectCollaborator.findMany({
          where: { email: identity.email },
          include: { project: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        })
      : Promise.resolve([]),
  ])

  const sharedProjects = collaboratorEntries.map((e) => e.project)

  return (
    <WorkspaceShell
      project={{ id: project.id, name: project.name }}
      isOwner={project.ownerId === identity.userId}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
