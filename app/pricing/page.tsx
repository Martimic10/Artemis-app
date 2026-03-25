import Navbar from "@/components/Navbar";
import PricingContent from "@/components/PricingContent";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing — Artemis",
  description: "Simple pricing that scales with your robot fleet.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black px-4 sm:px-8">
      <div className="mx-auto max-w-6xl border-x-2 border-white/20 min-h-screen">
        <Navbar />
        <PricingContent />
        <div className="border-y-2 border-white/20 h-16 sm:h-28" />
        <Footer />
      </div>
    </div>
  );
}
