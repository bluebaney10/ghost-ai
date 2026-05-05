import { clerkClient } from '@clerk/nextjs/server'

import { getIdentity, getProjectWithAccess } from '@/lib/project-access'
import { prisma } from '@/lib/prisma'

export interface CollaboratorDto {
  email: string
  displayName: string | null
  avatarUrl: string | null
}

async function enrichEmails(emails: string[]): Promise<CollaboratorDto[]> {
  if (emails.length === 0) return []
  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({ emailAddress: emails, limit: 100 })
  const byEmail = new Map<string, { displayName: string | null; avatarUrl: string }>()
  for (const user of users) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || null
    for (const ea of user.emailAddresses) {
      byEmail.set(ea.emailAddress, { displayName: name, avatarUrl: user.imageUrl })
    }
  }
  return emails.map((email) => ({
    email,
    displayName: byEmail.get(email)?.displayName ?? null,
    avatarUrl: byEmail.get(email)?.avatarUrl ?? null,
  }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getIdentity()
  if (!identity) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params
  const project = await getProjectWithAccess(projectId, identity)
  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const records = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
    select: { email: true },
  })

  const collaborators = await enrichEmails(records.map((r) => r.email))
  return Response.json({ collaborators })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getIdentity()
  if (!identity) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  if (project.ownerId !== identity.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email: string = (body?.email ?? '').trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (identity.email && email === identity.email.toLowerCase()) {
    return Response.json({ error: 'Cannot invite yourself' }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  })
  if (existing) {
    return Response.json({ error: 'Already a collaborator' }, { status: 409 })
  }

  await prisma.projectCollaborator.create({ data: { projectId, email } })

  const [collaborator] = await enrichEmails([email])
  return Response.json({ collaborator }, { status: 201 })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getIdentity()
  if (!identity) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  if (project.ownerId !== identity.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email: string = (body?.email ?? '').trim().toLowerCase()
  if (!email) {
    return Response.json({ error: 'Email required' }, { status: 400 })
  }

  await prisma.projectCollaborator.deleteMany({ where: { projectId, email } })
  return new Response(null, { status: 204 })
}
