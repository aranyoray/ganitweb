import Image from "next/image";

const APP_STORE_URL = "https://apps.apple.com/in/app/ganitar/id6763974122";

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
  {
    icon: "🧠",
    title: "Built for neurodiverse learners",
    description:
      "Designed for children with dyscalculia, ADHD, autism, and math anxiety. Calm pacing, gentle feedback, no rushing, no judgment.",
    color: "bg-coral/15 border-coral/30",
  },
  {
    icon: "✨",
    title: "GenAI quiz generator",
    description:
      "From single-digit arithmetic to advanced topics — questions adapt to each learner's pace, with story-based mini-lessons.",
    color: "bg-sky/15 border-sky/30",
  },
  {
    icon: "🎨",
    title: "Colorblind-friendly",
    description:
      "Random shapes accompany random colors so every learner — including colorblind students — can play, count, and compare.",
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

const gallery = [
  {
    src: "/deck/ar-table.png",
    alt: "AR cubes, sphere, and cones placed on a table through GanitAR",
    caption: "Place shapes on any flat surface and count what you see.",
  },
  {
    src: "/deck/ar-shapes-floor.png",
    alt: "A row of colored AR shapes on a wooden floor",
    caption: "Random shapes, random colors — friendly for colorblind learners.",
  },
  {
    src: "/deck/ar-quest.png",
    alt: "GanitAR quest screen showing Correct! Advance after counting cones",
    caption: "Quest-based learning: missions instead of worksheets.",
  },
  {
    src: "/deck/ar-closeup.png",
    alt: "Close-up of a red cube, yellow cone, and orange sphere in AR",
    caption: "Walk around a sphere. See a cube from every side.",
  },
];

export default function HomePage() {
  return (
    <div className="page-bg">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-16 text-center">
        <div className="mx-auto mb-8 w-full max-w-md">
          <Image
            src="/deck/logo.png"
            alt="GANIT — Learning Math. Seeing Possibilities."
            width={700}
            height={560}
            priority
            className="h-auto w-full"
          />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-display)] text-ink-800 leading-tight">
          Math you can walk around.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          GanitAR drops 3D math objects onto your desk. Count them, add them,
          rearrange them, and explore geometry from every angle — right through
          your iPhone or iPad.
        </p>

        <div
          className="mt-10 flex flex-col items-center justify-center gap-3"
          id="download"
        >
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-ink-800 px-7 py-4 text-white shadow-md hover:bg-ink-800/90 transition-colors"
            aria-label="Download GanitAR on the App Store"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-7 w-7 fill-current"
            >
              <path d="M16.365 1.43c0 1.14-.46 2.23-1.21 3.04-.81.88-2.13 1.56-3.21 1.47-.13-1.1.43-2.27 1.18-3.06.83-.87 2.24-1.52 3.24-1.45zM20.5 17.18c-.55 1.27-.81 1.84-1.52 2.96-.99 1.56-2.39 3.51-4.12 3.52-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.74-.02-3.06-1.78-4.05-3.34C.06 16.27-.21 11.06 1.49 8.27c1.21-1.99 3.13-3.16 4.93-3.16 1.83 0 2.99 1.01 4.5 1.01 1.47 0 2.36-1.01 4.49-1.01 1.6 0 3.3.87 4.51 2.38-3.97 2.18-3.32 7.85.58 9.69z" />
            </svg>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[11px] font-medium opacity-80">
                Download on the
              </span>
              <span className="text-lg font-bold tracking-tight">
                App Store
              </span>
            </span>
          </a>
          <p className="text-sm text-sand-400">Free on iOS &amp; iPadOS</p>
        </div>
      </section>

      {/* Mission / Project Summary from deck */}
      <section className="mx-auto max-w-5xl px-6 pt-4 pb-16">
        <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8 md:p-12">
          <p className="text-sm font-semibold tracking-wide text-coral uppercase">
            Why GANIT
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800">
            1 in 5 children in the U.S. experience arithmetic differences.
          </h2>
          <p className="mt-4 text-base text-stone-600 leading-relaxed">
            GANIT — <em>GenAI Adaptive Numeracy Improvement and Training</em> —
            is an AI + AR mobile math experience built to help children with
            dyscalculia, ADHD, autism, and math anxiety learn through stories,
            visuals, and small calm steps. Using Socratic methods and immersive
            learning, GANIT goes beyond traditional practice to{" "}
            <strong>exploration</strong>.
          </p>
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

      {/* AR Gallery */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800 text-center">
          See it in your room
        </h2>
        <p className="mt-3 text-center text-stone-600 max-w-2xl mx-auto">
          Real screenshots from GanitAR running on iPhone and iPad.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gallery.map((item) => (
            <figure
              key={item.src}
              className="rounded-[var(--radius-lg)] overflow-hidden border border-sand-200 bg-cream-light"
            >
              <div className="relative aspect-[4/3] w-full bg-ink-800/5">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-5 py-3 text-sm text-stone-600">
                {item.caption}
              </figcaption>
            </figure>
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

      {/* App Store preview + screenshot row */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative mx-auto w-full max-w-xs">
            <Image
              src="/deck/app-store.png"
              alt="GanitAR listing on the iOS App Store"
              width={600}
              height={1300}
              className="h-auto w-full rounded-[var(--radius-lg)] border border-sand-200"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              Live on the App Store
            </h2>
            <p className="mt-3 text-base text-stone-600 leading-relaxed">
              Built with Swift, ARKit, and RealityKit. The full feature set is
              free — no paywall, no in-app purchases, no ads. Open the app,
              point your iPad at a desk, and start exploring.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-stone-600">
              <li className="flex items-center gap-2">
                <span className="text-coral">•</span>AR mode: place &amp; count 3D
                spheres, visualise exponents in AR space
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coral">•</span>GenAI quiz generator from
                single-digit through advanced arithmetic
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coral">•</span>Story-based lessons with
                step-by-step pacing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-coral">•</span>Placement exam for
                automatic skill-level detection
              </li>
            </ul>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-ink-800 px-6 py-3 text-white hover:bg-ink-800/90 transition-colors"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6 fill-current"
              >
                <path d="M16.365 1.43c0 1.14-.46 2.23-1.21 3.04-.81.88-2.13 1.56-3.21 1.47-.13-1.1.43-2.27 1.18-3.06.83-.87 2.24-1.52 3.24-1.45zM20.5 17.18c-.55 1.27-.81 1.84-1.52 2.96-.99 1.56-2.39 3.51-4.12 3.52-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.74-.02-3.06-1.78-4.05-3.34C.06 16.27-.21 11.06 1.49 8.27c1.21-1.99 3.13-3.16 4.93-3.16 1.83 0 2.99 1.01 4.5 1.01 1.47 0 2.36-1.01 4.49-1.01 1.6 0 3.3.87 4.51 2.38-3.97 2.18-3.32 7.85.58 9.69z" />
              </svg>
              <span className="font-semibold">Get GanitAR</span>
            </a>
          </div>
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
                "AirPlay to share to a classroom screen",
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
          <div className="mt-8 mx-auto max-w-3xl rounded-[var(--radius-lg)] overflow-hidden border border-sun/30">
            <Image
              src="/deck/ar-shapes-row.png"
              alt="A row of AR cubes, spheres, and pyramids placed in a hallway"
              width={1200}
              height={420}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Built by Aarav */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-center rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8 md:p-12">
          <div className="mx-auto w-full max-w-[240px]">
            <Image
              src="/deck/aarav.png"
              alt="Aarav Kapoor coding GanitAR on a laptop"
              width={600}
              height={600}
              className="h-auto w-full rounded-[var(--radius-lg)] object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-sky uppercase">
              Built by a 5th grader
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              Made with empathy, one prototype at a time.
            </h2>
            <p className="mt-4 text-base text-stone-600 leading-relaxed">
              I&apos;m Aarav Kapoor, a Grade 5 student at Bullis Charter School.
              I built GANIT after interviewing classmates who said things like
              &ldquo;addition is scary&rdquo; and &ldquo;multiplication confuses
              me.&rdquo; I wanted a math app that felt calm, visual, and
              hands-on — so I learned Swift, ARKit, RealityKit, and genAI, read
              papers on dyscalculia and math anxiety, and shipped GanitAR to
              the App Store.
            </p>
            <p className="mt-3 text-base text-stone-600 leading-relaxed">
              My north star: make math feel safe, calm, and possible for every
              child — especially those who have been told they are not a
              &ldquo;math person.&rdquo;
            </p>
          </div>
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
        <div className="mt-8 flex justify-center">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-ink-800 px-7 py-4 text-white shadow-md hover:bg-ink-800/90 transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-7 w-7 fill-current"
            >
              <path d="M16.365 1.43c0 1.14-.46 2.23-1.21 3.04-.81.88-2.13 1.56-3.21 1.47-.13-1.1.43-2.27 1.18-3.06.83-.87 2.24-1.52 3.24-1.45zM20.5 17.18c-.55 1.27-.81 1.84-1.52 2.96-.99 1.56-2.39 3.51-4.12 3.52-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.74-.02-3.06-1.78-4.05-3.34C.06 16.27-.21 11.06 1.49 8.27c1.21-1.99 3.13-3.16 4.93-3.16 1.83 0 2.99 1.01 4.5 1.01 1.47 0 2.36-1.01 4.49-1.01 1.6 0 3.3.87 4.51 2.38-3.97 2.18-3.32 7.85.58 9.69z" />
            </svg>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[11px] font-medium opacity-80">
                Download on the
              </span>
              <span className="text-lg font-bold tracking-tight">
                App Store
              </span>
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
