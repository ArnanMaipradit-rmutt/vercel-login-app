'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client Validation
    if (!username.trim() || !email.trim() || !password) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (username.length < 3) {
      setError('Username ต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
      return;
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านยืนยันไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }

      setSuccess('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="card-header">
        <h1 className="card-title">สร้างบัญชีใหม่</h1>
        <p className="card-subtitle">กรอกข้อมูลด้านล่างเพื่อเริ่มต้นใช้งานระบบ</p>
      </div>

      {error && (
        <div className="alert alert-danger" id="register-error-alert">
          <AlertCircle size={18} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success" id="register-success-alert">
          <CheckCircle2 size={18} className="alert-icon" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleRegister} id="register-form">
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            ชื่อผู้ใช้ (Username)
          </label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="เช่น john_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            อีเมล (Email)
          </label>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="เช่น user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
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
              placeholder="อย่างน้อย 6 ตัวอักษร"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
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

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            ยืนยันรหัสผ่าน (Confirm Password)
          </label>
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          id="register-submit-btn"
          disabled={loading}
          style={{ marginTop: '1.5rem' }}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>กำลังบันทึกข้อมูล...</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>สมัครสมาชิก</span>
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        มีบัญชีอยู่แล้ว?
        <Link href="/login" className="auth-link" id="goto-login-link">
          เข้าสู่ระบบที่นี่
        </Link>
      </div>
    </div>
  );
}
