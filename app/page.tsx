import { getServerSession } from "next-auth"
import { MainApp } from "@/components/main-app"
import { HeroSection } from "@/components/landing/hero-section"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user?.id) {
    return <MainApp />
  }

  return (
    <HeroSection
      primaryHref="/register"
      primaryLabel="Create Account"
      secondaryHref="/login"
      secondaryLabel="Log In"
    />
  )
}
