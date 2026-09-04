-- ========================================================
-- Supabase SQL Schema for Vercel Login App
-- (คัดลอกคำสั่งด้านล่างไปวางใน Supabase -> SQL Editor -> Run)
-- ========================================================

CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- สร้าง Index เพื่อความเร็วในการค้นหา
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(LOWER(email));
