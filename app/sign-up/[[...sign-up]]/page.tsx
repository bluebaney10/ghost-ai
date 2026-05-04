import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 border-r border-border">
        <div className="max-w-xs">
          <p className="text-lg font-semibold tracking-tight">ghost AI</p>
          <p className="mt-2 text-sm text-muted-foreground">Your AI-powered creative workspace.</p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>Write, edit, and collaborate with AI</li>
            <li>Organize projects in one place</li>
            <li>Fast, focused, distraction-free</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <SignUp />
      </div>
    </div>
  )
}
