import Link from 'next/link'
import { Lock } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Lock className="h-10 w-10 text-muted-foreground" />
      <div className="text-center">
        <h1 className="text-lg font-semibold">Access denied</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This project does not exist or you do not have permission to view it.
        </p>
      </div>
      <Link href="/editor" className={buttonVariants({ variant: 'outline' })}>
        Back to editor
      </Link>
    </div>
  )
}
