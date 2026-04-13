import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Ganit',
  description: 'Ganit terms of service.',
};

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-500">Last updated: April 11, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Ganit (&quot;the App&quot;), you agree to be bound by these Terms of
        Service. If you are a parent or guardian registering on behalf of a child under 13, you
        accept these terms on their behalf.
      </p>

      <h2>2. Service Description</h2>
      <p>
        Ganit is an educational math application that provides adaptive learning exercises,
        augmented reality math experiences, and learning pattern observations. Ganit is{' '}
        <strong>not a medical device</strong> and does not provide medical diagnoses, screenings,
        or clinical assessments of any kind.
      </p>

      <h2>3. Accounts &amp; Registration</h2>
      <ul>
        <li>You must provide accurate information when creating an account</li>
        <li>You are responsible for maintaining the security of your account credentials</li>
        <li>Parent/guardian accounts are required for users under 13</li>
        <li>You may not create accounts for others without their consent</li>
      </ul>

      <h2>4. Children &amp; COPPA</h2>
      <p>
        Ganit complies with the Children&apos;s Online Privacy Protection Act (COPPA). Users under 13
        require verifiable parental consent before the app collects learning data or biometric
        signals. Parents may review, delete, or restrict their child&apos;s data at any time through
        the Parent Dashboard.
      </p>

      <h2>5. Virtual Currency</h2>
      <p>
        Ganit features virtual coins earned through learning activities. These coins:
      </p>
      <ul>
        <li>Have no monetary value whatsoever</li>
        <li>Cannot be exchanged for real currency</li>
        <li>Are non-transferable between users</li>
        <li>Are non-refundable</li>
        <li>May only be used within the app for virtual items and customizations</li>
      </ul>

      <h2>6. Educational Disclaimer</h2>
      <p>
        Ganit provides educational observations about learning patterns. These are{' '}
        <strong>not medical advice, diagnoses, or screenings</strong>. They are not a substitute
        for professional evaluation by qualified education specialists, psychologists, or
        healthcare providers. Do not make medical or educational decisions based solely on
        information from this app.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        All content, features, and functionality of Ganit — including but not limited to text,
        graphics, logos, icons, images, audio, software, and the overall design — are owned by
        Ganit and protected by intellectual property laws. You may not copy, modify, distribute,
        or create derivative works without our written permission.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Ganit and its creators shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages arising from your
        use of the App. The App is provided &quot;as is&quot; without warranties of any kind, either
        express or implied. In particular, we make no warranty that learning insights or
        observations are accurate, complete, or suitable for any particular purpose.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may suspend or terminate your access to the App at any time for violations of these
        Terms. You may delete your account at any time. Upon termination, all data associated
        with your account will be permanently deleted.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the United
        States. Any disputes arising under these Terms shall be resolved in the courts of
        competent jurisdiction.
      </p>

      <h2>11. Contact</h2>
      <p>
        For questions about these Terms, contact us at{' '}
        <a href="mailto:legal@ganit.app" className="text-blue-600 hover:underline">
          legal@ganit.app
        </a>
        .
      </p>
    </article>
  );
}
