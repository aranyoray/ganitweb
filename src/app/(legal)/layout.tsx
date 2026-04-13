import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Ganit
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to App
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link href="/account-deletion" className="hover:text-gray-700">
              Account Deletion
            </Link>
            <Link href="/support" className="hover:text-gray-700">
              Support
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Ganit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
