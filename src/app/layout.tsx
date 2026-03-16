import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ganit — Learn. Play. Grow.',
  description: 'Math practice and brain training for all ages.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#080c14] text-white md:h-screen md:overflow-hidden`}
        suppressHydrationWarning
      >
        {/* Desktop: fixed viewport, phone scales to fit browser height */}
        <div className="hidden md:flex items-center justify-center h-screen">
          {/* aspect-[440/956] = iPhone 16 Pro Max ratio */}
          <div className="relative h-[calc(100vh-48px)] max-h-[956px] aspect-[440/956]">
            {/* Titanium bezel */}
            <div className="absolute inset-0 rounded-[58px] bg-gradient-to-b from-[#2a2a2e] to-[#1c1c1e] shadow-[0_0_60px_rgba(0,0,0,0.7),0_0_120px_rgba(0,0,0,0.4)] border border-[#3a3a3c]" />
            {/* Side buttons — volume */}
            <div className="absolute left-[-2px] top-[18%] w-[3px] h-[6%] rounded-l-sm bg-[#3a3a3c]" />
            <div className="absolute left-[-2px] top-[26%] w-[3px] h-[6%] rounded-l-sm bg-[#3a3a3c]" />
            {/* Side button — power */}
            <div className="absolute right-[-2px] top-[22%] w-[3px] h-[8%] rounded-r-sm bg-[#3a3a3c]" />
            {/* Screen area */}
            <div className="absolute inset-[3px] rounded-[55px] overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0f2040] to-[#162d50]">
              {/* Dynamic Island */}
              <div className="absolute top-[1.2%] left-1/2 -translate-x-1/2 w-[27%] h-[3.2%] bg-black rounded-full z-50" />
              {/* Home indicator */}
              <div className="absolute bottom-[0.6%] left-1/2 -translate-x-1/2 w-[32%] h-[0.45%] bg-white/30 rounded-full z-50" />
              {/* Content scrolls INSIDE the phone only */}
              <div className="h-full overflow-y-auto overflow-x-hidden pt-[5%] pb-[3%]">
                <AuthProvider>
                  <ProgressProvider>
                    {children}
                  </ProgressProvider>
                </AuthProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/tablet: full screen, no frame */}
        <div className="md:hidden min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f2040] to-[#162d50]">
          <AuthProvider>
            <ProgressProvider>
              {children}
            </ProgressProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
