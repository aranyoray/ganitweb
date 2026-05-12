import Link from "next/link";
import type { ReactNode } from "react";

export default function DemoLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="page-bg">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/demo"
          className="text-sm text-coral hover:underline"
        >
          ← All demos
        </Link>
        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold font-[family-name:var(--font-display)] text-ink-800">
          {title}
        </h1>
        <p className="mt-3 text-base text-stone-600 max-w-2xl">{description}</p>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
