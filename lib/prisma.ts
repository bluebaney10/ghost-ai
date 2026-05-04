import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? ''
  const adapter = url.startsWith('prisma+postgres://')
    ? new PrismaPg(url) // Prisma Accelerate — routes through connection pooler
    : new PrismaPg(url) // direct pg
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
