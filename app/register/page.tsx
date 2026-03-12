import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"
import { authOptions } from "@/lib/auth"

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.id) {
    redirect("/")
  }

  return (
    <AuthShell
      eyebrow="Personal finance, without demo clutter"
      title="Create a clean account and start from zero"
      description="New users get an empty workspace. Add your own transactions, budgets, and goals, then let the AI assistant work from your real financial history."
      alternateHref="/login"
      alternateLabel="Sign in"
      alternateText="Already have an account?"
    >
      <RegisterForm />
    </AuthShell>
  )
}
