import HeroSection from '@/app/(landing)/components/HeroSection'
import FeaturesSection from '@/app/(landing)/components/FeaturesSection'
import HowItWorksSection from '@/app/(landing)/components/HowItWorksSection'
import CTASection from '@/app/(landing)/components/CTASection'

export default async function LandingPage() {
  // Middleware handles redirection to dashboard if logged in

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </>
  )
}
 