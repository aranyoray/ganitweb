import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Deletion — Ganit',
  description: 'How to delete your Ganit account and all associated data.',
};

export default function AccountDeletionPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>Account Deletion</h1>
      <p className="text-sm text-gray-500">Last updated: April 11, 2026</p>

      <p>
        You can delete your Ganit account and all associated data at any time. Deletion is
        immediate and permanent — there is no recovery period.
      </p>

      <h2>iOS App</h2>
      <ol>
        <li>Open Ganit and navigate to the <strong>Parent Dashboard</strong></li>
        <li>Enter your parent PIN to access dashboard settings</li>
        <li>Scroll down to <strong>Account Management</strong></li>
        <li>Tap <strong>&quot;Delete Account &amp; Data&quot;</strong></li>
        <li>Confirm deletion in the dialog</li>
      </ol>

      <h2>Web App</h2>
      <ol>
        <li>Go to <strong>Settings</strong></li>
        <li>Enter your parent PIN</li>
        <li>Click <strong>&quot;Delete All Data&quot;</strong></li>
        <li>Confirm deletion</li>
      </ol>

      <h2>What Gets Deleted</h2>
      <ul>
        <li>Account information (display name, parent email)</li>
        <li>All learning history and quiz results</li>
        <li>Progress data (points, coins, skill levels)</li>
        <li>Learning pattern observations and insights</li>
        <li>Session records</li>
        <li>Stored credentials</li>
      </ul>

      <h2>What Was Never on Our Servers (iOS)</h2>
      <p>
        On iOS, the following data is processed entirely on-device and is never transmitted to
        any server:
      </p>
      <ul>
        <li>Eye tracking data</li>
        <li>Facial analysis data</li>
        <li>Voice pattern data</li>
        <li>Touch pattern data</li>
        <li>Raw biometric signals of any kind</li>
      </ul>
      <p>
        These signals are deleted from the device when you delete your account. Since they were
        never sent to a server, there is nothing to delete remotely.
      </p>

      <h2>Timeline</h2>
      <p>
        Account deletion is <strong>immediate</strong>. All data is removed as soon as you
        confirm the deletion. There is no waiting period or grace period.
      </p>

      <h2>Need Help?</h2>
      <p>
        If you have trouble deleting your account, contact us at{' '}
        <a href="mailto:support@ganit.app" className="text-blue-600 hover:underline">
          support@ganit.app
        </a>{' '}
        and we will process the deletion for you.
      </p>
    </article>
  );
}
