import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"
import { authOptions } from "@/lib/auth"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.id) {
    redirect("/")
  }

  return (
    <AuthShell
      eyebrow="Secure access to your personal workspace"
      title="Sign in to your private finance tracker"
      description="Your dashboard, reports, budgets, goals, and AI chat stay tied to your own account. No shared demo data, no fake starter transactions."
      alternateHref="/register"
      alternateLabel="Create account"
      alternateText="Need a fresh account?"
    >
      <LoginForm />
    </AuthShell>
  )
}
