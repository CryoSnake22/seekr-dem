import { Navbar } from "@/components/ui/Navigation";
import { BackgroundEffects, GridPattern } from "@/components/ui/Effects";
import { Footer } from "@/components/landing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <GridPattern />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
