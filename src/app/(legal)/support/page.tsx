import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — Ganit',
  description: 'Get help with Ganit. Contact us and find answers to frequently asked questions.',
};

export default function SupportPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>Support</h1>

      <h2>Contact Us</h2>
      <p>
        For any questions, issues, or feedback, reach us at{' '}
        <a href="mailto:support@ganit.app" className="text-blue-600 hover:underline">
          support@ganit.app
        </a>
        . We aim to respond within 48 hours.
      </p>

      <h2>Frequently Asked Questions</h2>

      <h3>How do I reset my password?</h3>
      <p>
        On the login screen, use the password reset option. If you&apos;re a child user, ask your
        parent or guardian to reset the password from the Parent Dashboard.
      </p>

      <h3>How do I delete my data?</h3>
      <p>
        You can delete all data from the Parent Dashboard. Go to Account Management and tap
        &quot;Delete Account &amp; Data.&quot; See our{' '}
        <a href="/account-deletion" className="text-blue-600 hover:underline">
          Account Deletion page
        </a>{' '}
        for detailed instructions.
      </p>

      <h3>What data does Ganit collect?</h3>
      <p>
        Ganit collects account information, learning data (quiz answers, scores, progress), and
        on-device biometric signals (eye tracking, facial analysis, voice patterns, touch
        patterns). Biometric data is processed entirely on your device and never sent to any
        server. See our{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>{' '}
        for full details.
      </p>

      <h3>Is Ganit a medical device?</h3>
      <p>
        No. Ganit is an educational app. The learning pattern observations it provides are
        educational in nature and are not medical diagnoses, screenings, or clinical assessments.
        If you have concerns about your child&apos;s learning or development, please consult a
        qualified professional.
      </p>

      <h3>What are the age requirements?</h3>
      <p>
        Ganit is designed for users of all ages. Users under 13 require verifiable parental
        consent before the app can collect learning data or biometric signals. The app is rated
        4+ in the Education category.
      </p>

      <h3>How does parental consent work?</h3>
      <p>
        When a child under 13 creates an account, a parent or guardian must verify their identity
        via email verification. Once consent is granted, the app can collect learning data and
        biometric signals. Parents can revoke consent at any time from the Parent Dashboard,
        which stops all data collection. The child can still use the quiz without data collection.
      </p>

      <h3>What happens if I deny camera or microphone access?</h3>
      <p>
        The app works without camera or microphone permissions. If camera access is denied, AR
        features and face-based engagement tracking will be unavailable, but all quiz and
        learning features work normally. If microphone access is denied, voice pattern analysis
        will be disabled, but all other features continue to work.
      </p>
    </article>
  );
}
