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
    title: "Count and add by sight",
    description:
      "Counting, addition, and grouping become physical. Move shapes, rearrange them, and feel the math instead of memorizing it.",
    color: "bg-sun/15 border-sun/30",
  },
  {
    icon: "🛡️",
    title: "On-device, no accounts",
    description:
      "Nothing is uploaded. No sign-up, no tracking, no ads. The camera is used only for AR rendering, never recorded.",
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
    description: "Aim the device at a flat surface, like a desk or floor",
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
  "No images, video, or sensor data ever leave your device",
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
        <div className="mt-10 flex items-center justify-center" id="download">
          <p className="text-sm text-sand-400">Free on iOS &amp; iPadOS</p>
        </div>
      </section>

      {/* Value Cards */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                "Addition with movable shapes",
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
