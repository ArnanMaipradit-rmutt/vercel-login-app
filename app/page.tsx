import Link from 'next/link';
import { LogIn, UserPlus, Database, Shield, Zap, Cloud } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="auth-card hero-card">
      <h1 className="hero-title">
        ระบบยืนยันตัวตน พร้อมเชื่อมต่อ Database
      </h1>
      <p className="hero-description">
        เว็บแอพพลิเคชัน Full-stack Next.js สำหรับระบบเข้าสู่ระบบและสมัครสมาชิก 
        รองรับ Database บน Vercel เช่น <strong>PostgreSQL (Neon / Supabase)</strong> พร้อมใช้งานทันที
      </p>

      <div className="hero-buttons">
        <Link href="/login" className="btn btn-primary" id="home-login-btn">
          <LogIn size={18} />
          เข้าสู่ระบบ (Login)
        </Link>
        <Link href="/register" className="btn btn-secondary" id="home-register-btn">
          <UserPlus size={18} />
          สมัครสมาชิก (Register)
        </Link>
      </div>

      <div className="features-grid">
        <div className="feature-item">
          <Shield size={20} color="#3b82f6" style={{ marginBottom: '0.5rem' }} />
          <div className="feature-title">Bcrypt & JWT Auth</div>
          <div className="feature-desc">เข้ารหัสรหัสผ่านอย่างปลอดภัยด้วย Bcrypt และ Session Token ผ่าน HttpOnly Cookie</div>
        </div>

        <div className="feature-item">
          <Database size={20} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
          <div className="feature-title">PostgreSQL & Local DB</div>
          <div className="feature-desc">เชื่อมต่อ Cloud Database ได้ง่ายผ่าน DATABASE_URL พร้อม Local Fallback</div>
        </div>

        <div className="feature-item">
          <Cloud size={20} color="#10b981" style={{ marginBottom: '0.5rem' }} />
          <div className="feature-title">พร้อมขึ้น Vercel</div>
          <div className="feature-desc">ออกแบบให้เป็น Serverless-friendly Deploy ผ่าน GitHub เพียง 1 คลิก</div>
        </div>

        <div className="feature-item">
          <Zap size={20} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
          <div className="feature-title">Modern Design</div>
          <div className="feature-desc">UI สวยงามสไตล์ Glassmorphic มินิมอล ใช้งานง่าย ตอบสนองทุกหน้าจอ</div>
        </div>
      </div>
    </div>
  );
}
