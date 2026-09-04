import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vercel Login App - Fullstack Auth System',
  description: 'ระบบ Login และ Register ด้วย Next.js และ Database พร้อม Deploy ขึ้น Vercel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <div className="bg-ambient">
          <div className="glow-orb-1"></div>
          <div className="glow-orb-2"></div>
        </div>

        <div className="app-container">
          <header className="navbar">
            <Link href="/" className="brand-logo">
              <div className="brand-icon">
                <ShieldCheck size={22} />
              </div>
              <span>AuthVercel</span>
            </Link>

            <nav className="nav-links">
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                สมัครสมาชิก
              </Link>
            </nav>
          </header>

          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
