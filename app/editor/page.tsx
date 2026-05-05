import { currentUser } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { EditorHomeClient } from '@/components/editor/editor-home-client'

export default async function EditorPage() {
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress

  const [ownedProjects, collaboratorEntries] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true },
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { email },
          include: { project: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        })
      : Promise.resolve([]),
  ])

  const sharedProjects = collaboratorEntries.map((e) => e.project)

  return (
    <EditorHomeClient
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
