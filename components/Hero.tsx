import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col items-center">
      {/* Hero text area */}
      <div className="flex flex-col items-center text-center px-5 pt-14 pb-10 sm:px-10 sm:pt-24 sm:pb-16 w-full">
        <div className="flex flex-col items-center gap-6 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Now with ROS 2 Support
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-[1.1]">
            Robotics AI,
            <br />
            built for everyone.
          </h1>

          {/* Subheadline */}
          <p className="max-w-lg text-base text-zinc-500 leading-relaxed">
            Artemis lets you upload data, train a model, and deploy it to robots
            running ROS 2 — no ML or robotics experience required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              href="/waitlist"
              className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Join Waitlist
            </Link>
            <Link
              href="/waitlist"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-zinc-400 transition-colors hover:text-white hover:border-white/40"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Mockup area */}
      <div className="relative w-full overflow-hidden">
        {/* Hero background image */}
        <Image
          src="/pixel-art-hero-background.png.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-30"
          aria-hidden="true"
        />
        {/* Edge fades to blend into page */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black to-transparent" />
          <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-black to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-black to-transparent" />
        </div>

        {/* Mockup image */}
        <div className="relative z-10 mx-6 sm:mx-16 md:mx-28">
          <Image
            src="/hero-mockup.png"
            alt="Artemis dashboard"
            width={1600}
            height={900}
            className="w-full rounded-t-xl border border-b-0 border-white/20 shadow-2xl object-cover object-top"
            priority
          />
        </div>
      </div>
    </section>
  );
}
