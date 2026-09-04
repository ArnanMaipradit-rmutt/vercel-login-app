# 🚀 Next.js Vercel Login App + Supabase Database

เว็บแอพพลิเคชันระบบยืนยันตัวตน (Authentication) สร้างด้วย **Next.js 14 (App Router)**, **TypeScript**, **Bcrypt Password Hashing**, และ **Supabase (PostgreSQL Database)** พร้อม Deploy ขึ้น **Vercel** ผ่าน **GitHub**

---

## 👤 บัญชีสำหรับเชื่อมต่อ
- **GitHub**: `https://github.com/ArnanMaipradit-rmutt`
- **Vercel**: `https://vercel.com/arnanmaipradit-rmutt`

---

## ✨ ฟีเจอร์หลัก (Features)
- 🔐 **ระบบสมัครสมาชิก (Register)**: Hash รหัสผ่านด้วย `bcryptjs`, บันทึกลง Supabase PostgreSQL
- 🔑 **ระบบเข้าสู่ระบบ (Login)**: ล็อกอินด้วย Username หรือ Email, ออก Session Token ผ่าน HTTP-Only Cookies ป้องกัน XSS
- 👤 **หน้าแดชบอร์ด (Dashboard)**: แสดงข้อมูลโปรไฟล์, วันที่ลงทะเบียน, สถานะการเชื่อมต่อ Supabase Database และปุ่มออกจากระบบ (Logout)
- 🗄️ **Supabase Database & Local Fallback**: 
  - มีระบบ Auto-Migration สร้างตาราง `users` อัตโนมัติเมื่อเริ่มเชื่อมต่อ
  - มีไฟล์ [supabase_schema.sql](supabase_schema.sql) สำหรับรันใน Supabase SQL Editor
- 🎨 **Modern Dark Glassmorphism UI**: สไตล์เรียบหรู ใช้งานง่าย ตอบสนองทุกหน้าจอ

---

## 🛠️ ขั้นตอนที่ 1: ตั้งค่า Supabase Database (ทำเพียงครั้งเดียว)

1. เข้าสู่ระบบที่ **[Supabase.com](https://supabase.com/)** และสร้างโปรเจกต์ใหม่ (เช่น `vercel-login-app`)
2. กำหนด **Database Password** (จำรหัสนี้ไว้สำหรับใส่ใน Connection String)
3. ไปที่เมนู **Project Settings** (ไอคอนรูปฟันเฟืองด้านล่างซ้าย) -> เลือกแท็บ **Database**
4. เลื่อนลงมาที่หัวข้อ **Connection string** -> เลือกแท็บ **URI**
5. คัดลอก Connection String เช่น:
   ```
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
   *(อย่าลืมแทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านที่คุณตั้งไว้)*

---

## 🚀 ขั้นตอนที่ 2: นำโค้ดขึ้น GitHub (`ArnanMaipradit-rmutt`)

1. ไปที่ [GitHub -> Create a new repository](https://github.com/new)
2. ตั้งชื่อ Repository เช่น: `vercel-login-app`
3. เปิด Terminal ในโฟลเดอร์โปรเจกต์นี้ แล้วรันคำสั่ง:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Next.js Supabase Login App"
   git branch -M main
   git remote add origin https://github.com/ArnanMaipradit-rmutt/vercel-login-app.git
   git push -u origin main
   ```

---

## ⚡ ขั้นตอนที่ 3: Deploy ขึ้น Vercel (`arnanmaipradit-rmutt`)

1. เข้าไปที่ [Vercel Dashboard](https://vercel.com/arnanmaipradit-rmutt)
2. กดปุ่ม **"Add New..."** -> เลือก **"Project"**
3. เลือก Repository `vercel-login-app` จาก GitHub แล้วกด **Import**
4. ในส่วน **Environment Variables** ให้กดเพิ่ม 2 ค่าดังนี้:
   - **Name**: `DATABASE_URL`
     - **Value**: วาง Connection String ของ Supabase จากขั้นตอนที่ 1
   - **Name**: `JWT_SECRET`
     - **Value**: ใส่คีย์สุ่มยาวๆ เช่น `arnan_super_secure_jwt_key_2024_login`
5. กดปุ่ม **Deploy** 🚀
6. รอ Vercel ประมวลผลประมาณ 1 นาที จะได้ URL เว็บไซต์พร้อมใช้งานทันที!

---

## 💻 การทดสอบรันในเครื่อง (Local Run)

```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ `http://localhost:3000`
