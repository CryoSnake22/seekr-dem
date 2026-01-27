import { HeroSection } from '@/components/landing/HeroSection'
import { ValuePropSection } from '@/components/landing/ValuePropSection'
import { DetailsSection } from '@/components/landing/DetailsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { ProofSection } from '@/components/landing/ProofSection'
import { CTASection } from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ValuePropSection />
      <DetailsSection />
      <PricingSection />
      <ProofSection />
      <CTASection />
    </>
  )
}
