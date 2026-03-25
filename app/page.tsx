import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black px-4 sm:px-8">
      <div className="mx-auto max-w-6xl border-x-2 border-white/20 min-h-screen">
        <Navbar />
        <Hero />
        <div id="features" className="scroll-mt-24">
          <div className="border-y-2 border-white/20 h-16 sm:h-28" />
          <Features />
        </div>
        <div id="how-it-works" className="scroll-mt-24">
          <div className="border-y-2 border-white/20 h-16 sm:h-28" />
          <HowItWorks />
        </div>
        <div className="border-y-2 border-white/20 h-16 sm:h-28" />
        <Comparison />
        <div className="border-y-2 border-white/20 h-16 sm:h-28" />
        <FAQ />
        <div className="border-y-2 border-white/20 h-16 sm:h-28" />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
