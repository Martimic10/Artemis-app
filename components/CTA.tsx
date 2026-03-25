import Link from "next/link";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="border-t-2 border-white/20 relative overflow-hidden">
      {/* Pixel background */}
      <Image
        src="/pixel-art-background.png.jpg"
        alt=""
        fill
        className="object-cover object-center opacity-35"
        aria-hidden="true"
      />

      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      {/* Text + buttons */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-16 pb-12 sm:px-10 sm:pt-24 sm:pb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-[1.1] max-w-2xl">
          Stop writing code.
          <br />
          Start deploying robots.
        </h2>
        <p className="mt-5 text-base text-zinc-400 max-w-md leading-relaxed">
          Join teams using Artemis to train and deploy AI models to robots —
          without a single line of code.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
          <Link
            href="/waitlist"
            className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Join Waitlist
          </Link>
          <Link
            href="/waitlist"
            className="rounded-full border border-white/30 bg-white/5 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-white/50"
          >
            Book a Demo
          </Link>
        </div>
      </div>

      {/* Bottom fade into footer */}
      <div className="relative z-10 h-16 sm:h-24 bg-linear-to-b from-transparent to-black" />
    </section>
  );
}
