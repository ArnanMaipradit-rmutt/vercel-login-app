'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Database, LogOut, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface UserData {
  id: string | number;
  username: string;
  email: string;
  created_at?: string;
}

interface DatabaseInfo {
  type: string;
  isConfigured: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace('/login');
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setDbInfo(data.database);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto', width: '2rem', height: '2rem' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>กำลังโหลดข้อมูลผู้ใช้...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-grid">
      <div className="auth-card" style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
              <User size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>ยินดีต้อนรับ, {user.username}!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>เข้าสู่ระบบเรียบร้อยแล้ว (Authenticated)</p>
            </div>
          </div>

          <span className="badge badge-success">
            <CheckCircle2 size={14} /> Active Session
          </span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="info-row">
            <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--primary)" /> รหัสผู้ใช้ (User ID)
            </span>
            <span className="info-value">{user.id}</span>
          </div>

          <div className="info-row">
            <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="var(--primary)" /> Username
            </span>
            <span className="info-value">{user.username}</span>
          </div>

          <div className="info-row">
            <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="var(--primary)" /> Email
            </span>
            <span className="info-value">{user.email}</span>
          </div>

          <div className="info-row">
            <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="var(--primary)" /> วันที่ลงทะเบียน
            </span>
            <span className="info-value">
              {user.created_at ? new Date(user.created_at).toLocaleString('th-TH') : 'วันนี้'}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={16} color="var(--accent)" /> สถานะฐานข้อมูล (Database)
            </span>
            <span className="badge badge-info">
              {dbInfo?.type || 'PostgreSQL / Local Storage'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            id="dashboard-logout-btn"
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <LogOut size={18} />
                <span>ออกจากระบบ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
