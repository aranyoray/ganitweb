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
    question: "What's the difference between Real mode and Virtual mode?",
    answer:
      "Real mode is the guided practice path — pick from four progressively harder games and the app gives you problems to solve with AR shapes. Virtual mode is the open-ended path — bring your own problem by scanning printed worksheets, saying the problem out loud, or generating a fresh practice sheet to print.",
  },
  {
    question: "How does addition work — do I drag the shapes together?",
    answer:
      "Tap. Two piles appear in your space; tap one pile and it flies into the other, then the caption reads \"a + b = sum\". Tap-to-combine is faster on small devices than dragging in 3D and works the same on iPhone and iPad.",
  },
  {
    question: "What do the colors mean in subtraction?",
    answer:
      "Blue cubes are the ones that stay; red cubes are the ones leaving the scene. Watching the red cubes fade away makes \"take away\" something you can see instead of just read.",
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
      "No. There are no accounts, no analytics, no advertising, and no network calls. The camera, microphone, and speech recognition are all used only on-device — nothing leaves the phone. See the Privacy Policy for details.",
  },
  {
    question: "Can I scan a printed math problem with the camera?",
    answer:
      "Yes. Open Virtual mode and choose Scan. Aim the camera at a printed problem like \"4 + 3\" and GanitAR will read it using Apple's on-device DataScanner and render the shapes in AR. Requires iPhone XS or newer.",
  },
  {
    question: "Can I just say the problem out loud?",
    answer:
      "Yes. Open Virtual mode and choose Speak. Say something like \"five plus three\" or \"twenty plus seven\" — number words from zero to ninety-nine are handled, plus synonyms like \"add\", \"take away\", and \"minus\". Audio runs through Apple's on-device Speech framework and never leaves the phone. A live transcript appears while you speak; Stop and Cancel are always one tap away.",
  },
  {
    question: "What kinds of problems does Virtual mode accept?",
    answer:
      "One addition or subtraction expression with whole numbers (X + Y or X − Y, each 0 to 99), or a single integer 0 to 999. Negative results are rejected with a friendly hint, as are multi-term expressions like \"2 + 3 + 4\". After three misreads in a row, the app suggests printing a worksheet so the scan reads cleanly next time.",
  },
  {
    question: "What about subtraction or larger numbers like 142 + 36?",
    answer:
      "Subtraction is supported — the shapes representing the difference leave the scene. For numbers above 20, GanitAR automatically switches to place-value mode and renders Dienes base-10 blocks (flats for hundreds, rods for tens, units for ones).",
  },
  {
    question: "Can I print a practice worksheet?",
    answer:
      "Yes. Virtual mode includes a Worksheet option that generates a US-Letter PDF with twelve problems in a 3-by-4 grid, large bold digits sized for clean OCR pickup, and a header and footer. The system share sheet opens so you can AirPrint, AirDrop, save to Files, or hand it off.",
  },
  {
    question: "Does the app give feedback when I get an answer wrong?",
    answer:
      "Yes. Type a wrong digit and a red \"Try again\" hint appears next to the input. Correct answers show \"Correct!\" and an Advance button. The number pad keyboard pops up automatically so kids never have to hunt for the digits.",
  },
  {
    question: "How does the home screen icon look on iOS 18?",
    answer:
      "The app ships three icon variants — Light, Dark, and Tinted — so iOS picks the one that matches the current appearance. Tap-to-customize on the home screen will recolor the icon using the Tinted variant instead of falling back to the generic dimmed look.",
  },
  {
    question: "The shapes won't appear when I point at the table — what do I do?",
    answer:
      "AR needs a flat, well-lit surface with some visual texture. Make sure the room is bright, the surface is not pure-white or glossy, and slowly move the device side-to-side so ARKit can detect the plane. A short pause usually fixes it.",
  },
  {
    question: "Scan mode says it isn't supported on my device.",
    answer:
      "The printed-problem scanner uses Apple's DataScanner, which requires an iPhone XS or newer (A12 Bionic with the Neural Engine). The rest of GanitAR — AR shapes, voice input, worksheet, all games — runs on every ARKit-capable device.",
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
