"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What kind of robots does Artemis support?",
    a: "Artemis works with any robot running ROS 2, including mobile platforms, robotic arms, drones, and custom builds. If it runs ROS 2, Artemis can deploy to it.",
  },
  {
    q: "Do I need ML or robotics experience to use Artemis?",
    a: "Not at all. Artemis is built for people without ML or robotics backgrounds. The entire workflow — from uploading data to deploying a trained model — is handled through a simple no-code interface.",
  },
  {
    q: "What data formats does Artemis accept?",
    a: "Artemis accepts ROS 2 bag files, CSV, images, video, and JSON telemetry. You can upload raw sensor data directly with no preprocessing or labeling pipelines required.",
  },
  {
    q: "How does deployment to ROS 2 robots work?",
    a: "Once your model is trained, Artemis packages it into a ROS 2-compatible node and delivers it to your robot fleet over the air. The whole process takes one click — no SSH, no manual configuration.",
  },
  {
    q: "Can I retrain my model after deployment?",
    a: "Yes. You can upload new data at any time, trigger a retraining run, and push the updated model back to your robots. Artemis versions every model so you can roll back if needed.",
  },
  {
    q: "Is my data secure on Artemis?",
    a: "All data is encrypted in transit and at rest. Your datasets and trained models are private to your workspace and never used to train other customers' models.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="border-t-2 border-white/20">
      <div className="flex flex-col md:flex-row">
        {/* Left — label + headline */}
        <div className="w-full md:w-[38%] border-b-2 md:border-b-0 md:border-r-2 border-white/20 px-5 py-10 sm:px-10 sm:py-14 flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-0.5 h-4 bg-cyan-400" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              FAQs
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1]">
            Got questions?
            <br />
            We've got
            <br />
            answers.
          </h2>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-zinc-500">Still have questions?</p>
            <p className="text-sm text-zinc-500">Contact us and we'll help you out.</p>
          </div>

          <a
            href="#"
            className="mt-1 w-fit border border-white/20 px-5 py-2.5 text-sm text-white transition-colors hover:border-white/40 hover:bg-white/5"
          >
            Contact us
          </a>
        </div>

        {/* Right — accordion */}
        <div className="flex-1 flex flex-col">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border-b border-white/10 last:border-b-0`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-5 px-5 py-6 sm:px-10 sm:py-7 text-left group"
              >
                <span className="text-xs font-mono text-zinc-600 w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`flex-1 text-base transition-colors ${open === i ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 text-zinc-500 text-xl leading-none transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>

              {open === i && (
                <div className="px-5 pb-5 sm:px-10 sm:pb-7 flex gap-5">
                  <div className="w-6 shrink-0" />
                  <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
