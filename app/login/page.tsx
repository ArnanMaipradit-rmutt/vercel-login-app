'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim() || !password) {
      setError('กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }

      setSuccess('เข้าสู่ระบบสำเร็จ กำลังพาไปยังหน้าหลัก...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="card-header">
        <h1 className="card-title">เข้าสู่ระบบ</h1>
        <p className="card-subtitle">ยินดีต้อนรับกลับมา! กรุณากรอกข้อมูลของคุณ</p>
      </div>

      {error && (
        <div className="alert alert-danger" id="login-error-alert">
          <AlertCircle size={18} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success" id="login-success-alert">
          <CheckCircle2 size={18} className="alert-icon" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleLogin} id="login-form">
        <div className="form-group">
          <label className="form-label" htmlFor="identifier">
            Username หรือ Email
          </label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              id="identifier"
              type="text"
              className="form-input"
              placeholder="กรอกชื่อผู้ใช้ หรืออีเมล"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            รหัสผ่าน (Password)
          </label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="input-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          id="login-submit-btn"
          disabled={loading}
          style={{ marginTop: '1.5rem' }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>กำลังตรวจสอบ...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>เข้าสู่ระบบ</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        ยังไม่มีบัญชีใช่หรือไม่?
        <Link href="/register" className="auth-link" id="goto-register-link">
          สมัครสมาชิกที่นี่
        </Link>
      </div>
    </div>
  );
}
