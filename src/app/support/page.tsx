import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with GanitAR. Setup tips, troubleshooting, and contact form for students, teachers, and parents.",
};

const faqs = [
  {
    question: "What is GanitAR?",
    answer:
      "GanitAR is an iPhone and iPad app that drops 3D math objects into your space using augmented reality. You count, add, and explore geometry by walking around real shapes anchored on your desk or floor.",
  },
  {
    question: "What devices does it run on?",
    answer:
      "Any iPhone or iPad with an A12 Bionic chip or newer, running iOS 17 or later. ARKit support is required, which covers most devices from 2018 onward.",
  },
  {
    question: "Do I need an internet connection?",
    answer:
      "No. GanitAR runs fully on-device and makes no network calls during normal use. Once installed, it works offline.",
  },
  {
    question: "Does GanitAR collect any data about me or my child?",
    answer:
      "No. There are no accounts, no analytics, no advertising, and no network calls. The camera is used only for AR rendering and the feed never leaves the device. See the Privacy Policy for details.",
  },
  {
    question: "The shapes won't appear when I point at the table — what do I do?",
    answer:
      "AR needs a flat, well-lit surface with some visual texture. Make sure the room is bright, the surface is not pure-white or glossy, and slowly move the device side-to-side so ARKit can detect the plane. A short pause usually fixes it.",
  },
  {
    question: "Can teachers use this in class?",
    answer:
      "Yes. There are no accounts to provision and no data collected, which makes GanitAR FERPA-friendly by default. AirPlay the iPad to a classroom screen for whole-class demos, or run it as a station activity.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes — full feature set, no in-app purchases, no ads, no subscriptions.",
  },
];

export default function SupportPage() {
  return (
    <div className="page-bg">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold font-[family-name:var(--font-display)] text-ink-800">
            GanitAR Support
          </h1>
          <p className="mt-4 text-lg text-stone-600 max-w-xl mx-auto">
            Help for students, teachers, and parents. Stuck on setup? AR not
            tracking? Question about privacy? Drop us a line.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-ink-800">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[var(--radius-md)] bg-cream-light border border-sand-200 p-6"
              >
                <h3 className="text-base font-semibold text-ink-800">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-ink-800">
            Contact Us
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            We aim to reply within 2 business days. For App Store review
            questions, mention &quot;App Review&quot; in the subject line.
          </p>
          <div className="mt-6 rounded-[var(--radius-md)] bg-cream-light border border-sand-200 p-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
