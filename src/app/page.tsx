const features = [
  {
    icon: "📐",
    title: "Drop math into your space",
    description:
      "Place 3D shapes, prisms, and spheres on any flat surface. Walk around them, kneel beside them, see them from every angle.",
    color: "bg-sky/15 border-sky/30",
  },
  {
    icon: "🧮",
    title: "Count, add, subtract, regroup",
    description:
      "Addition and subtraction with movable shapes. Place-value blocks for hundreds, tens, and units. Feel the math instead of memorizing it.",
    color: "bg-sun/15 border-sun/30",
  },
  {
    icon: "📸",
    title: "Scan or speak a problem",
    description:
      "Point the camera at a printed math problem, or say it out loud — both the OCR and the speech recognition stay on device.",
    color: "bg-coral/15 border-coral/30",
  },
  {
    icon: "🛡️",
    title: "On-device, no accounts",
    description:
      "Nothing is uploaded. No sign-up, no tracking, no ads. Camera and microphone are used only on-device, never recorded.",
    color: "bg-leaf/15 border-leaf/30",
  },
];

const steps = [
  {
    number: "1",
    title: "Open",
    description: "Launch GanitAR and grant camera access",
    color: "bg-sky",
  },
  {
    number: "2",
    title: "Point",
    description: "Aim at a flat surface for AR shapes — or at a printed problem to scan it",
    color: "bg-sun",
  },
  {
    number: "3",
    title: "Place",
    description: "Tap to drop 3D shapes into your space",
    color: "bg-coral",
  },
  {
    number: "4",
    title: "Solve",
    description: "Answer the prompt and advance to the next round",
    color: "bg-leaf",
  },
];

const trustItems = [
  "Camera feed is processed only on-device by Apple's ARKit framework",
  "Printed-problem scanning and voice input run fully on-device — no audio or images leave the phone",
  "No images, video, audio, or sensor data ever leave your device",
  "No accounts, no sign-in, no email required",
  "No third-party analytics, no advertising SDKs, no tracking pixels",
  "Works offline once installed — no network calls during use",
  "No in-app purchases, no ads, no upsells",
  "Free on the App Store, full feature set with no paywall",
];

export default function HomePage() {
  return (
    <div className="page-bg">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-display)] text-ink-800 leading-tight">
          Math you can walk around.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          GanitAR drops 3D math objects onto your desk. Count them, add them,
          rearrange them, and explore geometry from every angle — right through
          your iPhone or iPad.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 scroll-mt-24" id="download">
          <a
            href="https://apps.apple.com/in/app/ganitar/id676397412"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-[var(--radius-pill)] bg-ink-800 px-6 py-3 text-white hover:brightness-110 transition-all"
            aria-label="Download GanitAR on the App Store"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.05 12.04c-.03-2.6 2.13-3.86 2.22-3.92-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.82 0-2.07-.92-3.41-.89-1.75.03-3.37 1.02-4.27 2.59-1.83 3.17-.47 7.87 1.31 10.45.87 1.26 1.91 2.68 3.26 2.63 1.31-.05 1.8-.85 3.39-.85 1.58 0 2.03.85 3.41.82 1.41-.03 2.3-1.29 3.17-2.55 1-1.47 1.41-2.89 1.43-2.96-.03-.01-2.75-1.06-2.78-4.22zM14.5 4.42c.72-.87 1.21-2.08 1.08-3.29-1.04.04-2.3.69-3.04 1.56-.66.77-1.25 2-1.09 3.18 1.16.09 2.34-.59 3.05-1.45z" />
            </svg>
            <span className="text-sm font-semibold">Download on the App Store</span>
          </a>
          <p className="text-sm text-sand-400">Free on iOS &amp; iPadOS</p>
        </div>
      </section>

      {/* Value Cards */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-[var(--radius-lg)] border p-8 ${feature.color}`}
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-bold font-[family-name:var(--font-display)] text-ink-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800 text-center">
          How it works
        </h2>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${step.color} text-white text-xl font-bold`}
              >
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-bold font-[family-name:var(--font-display)] text-ink-800">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800">
            Built for trust
          </h2>
          <p className="mt-3 text-base text-stone-600">
            GanitAR is private by design. There is nothing to log in to and
            nothing to upload.
          </p>
          <ul className="mt-8 space-y-4">
            {trustItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf/20 text-leaf text-xs">
                  ✓
                </span>
                <span className="text-sm text-ink-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* For Students / For Teachers */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8">
            <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              For Students
            </h3>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              Stop staring at numbers on a page. GanitAR turns your room into a
              math lab. Watch shapes appear on your desk, walk around a sphere,
              count cubes from every side. Spatial intuition is the shortcut.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "Counting and grouping in 3D",
                "Addition and subtraction with movable shapes",
                "Place-value blocks for hundreds, tens, and units",
                "Scan a printed problem or say it out loud",
                "Print a practice worksheet from your phone",
                "Geometry you can orbit",
                "No login, no streaks, no pressure",
                "Self-paced — never timed",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                  <span className="text-coral">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8">
            <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              For Teachers
            </h3>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              An AR demo loop that runs on the iPad you already have. Use
              GanitAR as a five-minute classroom warm-up, a station activity,
              or a demonstration on the projector. No accounts to manage, no
              data to protect.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "No student accounts to provision",
                "No data collected — FERPA-friendly by default",
                "Works on any ARKit-capable iPad",
                "Free, no licensing paperwork",
                "Air Play to share to a classroom screen",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                  <span className="text-sky">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AR Highlight */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[var(--radius-lg)] bg-sun/10 border border-sun/30 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800">
            Geometry that lives in your room
          </h2>
          <p className="mt-4 text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            GanitAR is built on Apple&apos;s ARKit and RealityKit. Shapes anchor
            to real surfaces, hold their place as you move, and respond to your
            taps. When you can move around an idea, you understand it.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800">
          Free. Private. Hands-on.
        </h2>
        <p className="mt-4 text-base text-stone-600">
          No ads, no account, no tracking — just math, in 3D.
        </p>
      </section>
    </div>
  );
}
