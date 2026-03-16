'use client';
import { useRouter } from 'next/navigation';

interface NavHeaderProps {
  title?: string;
}

export default function NavHeader({ title }: NavHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 flex items-center gap-3 bg-[#0a1628]/80 backdrop-blur-lg px-4 py-3 border-b border-white/5">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-blue-400 active:opacity-60 transition-opacity"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span className="text-[17px]">Back</span>
      </button>
      {title && (
        <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold text-white">{title}</span>
      )}
    </div>
  );
}
