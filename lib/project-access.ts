import { currentUser } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'

export interface ClerkIdentity {
  userId: string
  email: string | null
}

export async function getIdentity(): Promise<ClerkIdentity | null> {
  const user = await currentUser()
  if (!user) return null
  return {
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? null,
  }
}

export async function getProjectWithAccess(
  projectId: string,
  identity: ClerkIdentity
): Promise<{ id: string; name: string; ownerId: string } | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })
  if (!project) return null
  if (project.ownerId === identity.userId) return project
  if (identity.email) {
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId: project.id, email: identity.email } },
    })
    if (collaborator) return project
  }
  return null
}
