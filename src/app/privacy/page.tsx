import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "GanitAR Privacy Policy. How the GanitAR iOS app handles data — short answer: it doesn't.",
};

export default function PrivacyPage() {
  return (
    <div className="page-bg">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold font-[family-name:var(--font-display)] text-ink-800">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Last updated: April 27, 2026
        </p>

        <div className="mt-8 rounded-[var(--radius-md)] bg-cream-light border border-sand-200 p-6">
          <p className="text-base leading-relaxed text-ink-800">
            GanitAR is a fully on-device augmented reality math app. It does
            not collect personal information, does not require an account, and
            does not transmit data to any server. The camera is used only for
            on-device AR rendering. This page explains exactly what that means.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              1. What Information the App Uses
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                GanitAR uses only the following information, all of which stays
                on your device:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-ink-800">Camera frames</strong> —
                  processed in real time by Apple&apos;s ARKit framework for
                  plane detection and scene anchoring. Frames are not saved,
                  recorded, or transmitted.
                </li>
                <li>
                  <strong className="text-ink-800">Your typed answers</strong> —
                  numbers you enter into in-app prompts (such as &quot;how many
                  shapes do you see&quot;). These are evaluated in memory and
                  discarded when the view closes.
                </li>
                <li>
                  <strong className="text-ink-800">Game progression</strong> —
                  the current round, difficulty limit, and shape state. These
                  exist only while the app is open.
                </li>
              </ul>
              <p>
                The app does not collect your name, email, age, location,
                advertising identifier, device identifier, contacts, or any
                other identifier.
              </p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              2. What Stays on the Device
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>Everything. The app has no storage requirements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No accounts are created.</li>
                <li>No user files are written to disk.</li>
                <li>No Keychain entries are added.</li>
                <li>No background processes run when the app is closed.</li>
              </ul>
              <p>
                When you close the app, in-memory state is discarded. When you
                uninstall the app, no residual user data exists to remove.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              3. When Data Leaves the Device
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                <strong className="text-ink-800">Never.</strong> GanitAR makes
                no network calls during normal use. The app does not
                communicate with any backend, third-party API, analytics
                service, or advertising network.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              4. No Analytics, No Advertising
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                GanitAR does not include any third-party analytics SDK. We do
                not integrate Firebase Analytics, Google Analytics, Mixpanel,
                Amplitude, AppsFlyer, Adjust, Branch, Segment, or any
                equivalent product. The only diagnostic data we may receive is
                Apple&apos;s standard, opt-in MetricKit and crash reports
                surfaced through App Store Connect, which you control through
                iOS Settings → Privacy &amp; Security → Analytics &amp;
                Improvements.
              </p>
              <p>
                GanitAR contains no advertising of any kind. There are no ad
                SDKs, no advertising identifier collection, no App Tracking
                Transparency prompt, and no sponsored content.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              5. Camera Permission
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                On first launch, iOS will ask for permission to use the camera.
                The camera is required because GanitAR is an augmented reality
                app — without the camera feed, ARKit cannot place virtual
                objects on real surfaces.
              </p>
              <p>
                Camera frames are processed entirely on-device. They are not
                saved to your photo library, not written to disk, and not sent
                to any server. You can revoke camera permission at any time
                through iOS Settings → GanitAR.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              6. Children&apos;s Privacy
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                GanitAR is suitable for users of any age, including children
                under 13. Because the app collects no personal information,
                it does not implicate the Children&apos;s Online Privacy
                Protection Act (COPPA) or comparable laws in other
                jurisdictions. Parents do not need to provide consent because
                there is nothing to consent to.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              7. Data Retention and Deletion
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                We retain no user data because we collect none. To remove the
                app entirely, uninstall it from your device. iOS will delete
                any in-memory state immediately.
              </p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              8. Contact Us
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                If you have questions about this privacy policy or the app,
                contact us:
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:support@ganitar.app"
                  className="text-coral hover:underline"
                >
                  support@ganitar.app
                </a>
              </p>
              <p>
                For App Store review questions, mention &quot;App Review&quot;
                in the subject line.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
              9. Changes to This Policy
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-stone-600">
              <p>
                We may update this policy from time to time. When we make
                changes, we will update the &quot;Last updated&quot; date at
                the top of this page. If a future version of GanitAR ever
                begins collecting any user data, we will update this policy
                and seek any required consent before collection begins.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
