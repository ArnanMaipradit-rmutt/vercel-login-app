# 🛡️ Full-stack Authentication System (Next.js 14 + Supabase + Vercel)

โปรเจกต์เว็บแอพพลิเคชัน **Full-stack Authentication System** ที่ครอบคลุมตั้งแต่การออกแบบสถาปัตยกรรม (Architecture), การพัฒนา Frontend UI สไตล์ Modern Glassmorphism, Backend API Routes, ระบบความปลอดภัย (Security Hashing & JWT), การเชื่อมต่อฐานข้อมูล **Supabase (PostgreSQL)**, และการทำ CI/CD Deploy ขึ้น **Vercel** ผ่าน **GitHub**

---

## 🏗️ สถาปัตยกรรมระบบ (System Architecture)

```mermaid
graph TD
    User([🌐 Client Browser]) -->|HTTPS Requests| Vercel([▲ Vercel Serverless Platform])
    
    subgraph NextJS [Next.js 14 App Router]
        UI[🎨 Frontend UI: Login / Register / Dashboard]
        API[⚡ Backend API Routes: /api/auth/*]
        AuthLib[🔐 Auth Service: Bcrypt & JOSE JWT]
        DBLib[🗄️ Database Service: PG Pool Connection]
    end
    
    Vercel --> NextJS
    UI -->|JSON Fetch| API
    API --> AuthLib
    API --> DBLib
    DBLib -->|PostgreSQL Protocol / SSL| Supabase[(🗄️ Supabase PostgreSQL Database)]
```

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| หมวดหมู่ | เทคโนโลยี | คำอธิบาย |
|---|---|---|
| **Framework** | **Next.js 14 (App Router)** | Full-stack React Framework รวม Frontend และ API ไว้ในที่เดียว |
| **Language** | **TypeScript** | Type-safe ป้องกันข้อผิดพลาดตั้งแต่ขั้นตอนเขียนโค้ด |
| **Frontend Styling** | **Modern CSS (Glassmorphism)** | ดีไซน์สไตล์มินิมอล พร้อม Dynamic Ambient Lighting และ Micro-interactions |
| **Database** | **Supabase (PostgreSQL)** | คลาวด์ฐานข้อมูล PostgreSQL พร้อมระบบ Connection Pooler สำหรับ Serverless |
| **Password Security** | **Bcrypt.js** | เข้ารหัสรหัสผ่านด้วย Salt Rounds 10 ป้องกันการโจมตีแบบ Rainbow Table |
| **Session Management**| **JOSE (JWT) + HttpOnly Cookies** | จัดการ Session แบบ Stateless ปลอดภัยจากการโจมตีประเภท XSS |
| **Deployment / CI/CD** | **GitHub + Vercel** | เชื่อมต่อ Git Repository เพื่อ Auto-build และ Deploy ทันทีที่มีการ Push โค้ด |

---

## 📖 เจาะลึกขั้นตอนการพัฒนา Full-stack (Step-by-Step Guide)

### ขั้นตอนที่ 1: การวางโครงสร้างโปรเจกต์ (Project Setup)
1. ติดตั้ง Next.js พร้อม TypeScript และไลบรารีที่จำเป็น:
   - `@neondatabase/serverless` & `pg`: ตัวเชื่อมต่อ PostgreSQL
   - `bcryptjs` & `@types/bcryptjs`: สำหรับ Hash รหัสผ่าน
   - `jose`: ไลบรารีสร้างและตรวจสอบ JWT ที่รองรับ Edge & Serverless Runtime
   - `lucide-react`: ชุดไอคอนมินิมอล

2. โครงสร้างโฟลเดอร์หลัก:
   ```text
   ├── app/
   │   ├── api/auth/
   │   │   ├── register/route.ts   # Backend API: สมัครสมาชิก
   │   │   ├── login/route.ts      # Backend API: เข้าสู่ระบบ
   │   │   ├── logout/route.ts     # Backend API: ออกจากระบบ
   │   │   └── me/route.ts         # Backend API: ตรวจสอบ Session ปัจจุบัน
   │   ├── dashboard/page.tsx      # หน้าแสดงผลข้อมูลผู้ใช้ (Protected Route)
   │   ├── login/page.tsx          # หน้าฟอร์มเข้าสู่ระบบ
   │   ├── register/page.tsx       # หน้าฟอร์มสมัครสมาชิก
   │   ├── layout.tsx              # โครงสร้าง Layout หลัก + Navbar
   │   └── globals.css             # Design Tokens & UI Styles
   ├── lib/
   │   ├── auth.ts                 # ฟังก์ชันจัดการ Hash รหัสผ่าน และ JWT Cookie
   │   └── db.ts                   # Connection Pool และคำสั่ง SQL Query
   ├── supabase_schema.sql         # สคริปต์สร้างตาราง Database
   └── .env.example                # ตัวอย่าง Environment Variables
   ```

---

### ขั้นตอนที่ 2: การออกแบบฐานข้อมูล (Database Layer)
1. **สร้าง Table `users`** สำหรับเก็บข้อมูลบัญชีผู้ใช้:
   ```sql
   CREATE TABLE IF NOT EXISTS public.users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(LOWER(username));
   CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(LOWER(email));
   ```
2. **จัดการการเชื่อมต่อ (`lib/db.ts`)**:
   - ใช้ `pg.Pool` พร้อมตั้งค่า `ssl: { rejectUnauthorized: false }` และ `connectionTimeoutMillis: 10000` เพื่อให้รองรับ Serverless Environment
   - มีระบบ **Auto-Migration**: ตรวจสอบและสร้างตารางให้อัตโนมัติเมื่อแอพพลิเคชันเริ่มต้นทำงาน
   - มีระบบ **Local Fallback**: สลับไปใช้ Local Storage ในเครื่องอัตโนมัติหากยังไม่ได้ใส่ `DATABASE_URL`

---

### ขั้นตอนที่ 3: ระบบความปลอดภัยและการจัดการ Session (`lib/auth.ts`)
1. **Password Hashing**:
   - รหัสผ่านของผู้ใช้จะไม่ถูกเก็บเป็น Plaintext เด็ดขาด แต่จะผ่านฟังก์ชัน `bcrypt.hash(password, 10)` ก่อนบันทึกลง Database
   - เมื่อผู้ใช้ล็อกอิน จะใช้ `bcrypt.compare(password, user.password)` เพื่อเปรียบเทียบความถูกต้อง
2. **Stateless JWT Session**:
   - เมื่อยืนยันตัวตนผ่าน ระบบจะสร้าง Token ด้วย `jose.SignJWT` บรรจุข้อมูล `{ id, username, email }` มีอายุ 7 วัน
   - เก็บ Token ไว้ใน **HTTP-Only Cookie (`auth_session_token`)** ทำให้ JavaScript ฝั่ง Client ไม่สามารถเข้าถึงได้ ป้องกันการถูกขโมยผ่านช่องโหว่ XSS

---

### ขั้นตอนที่ 4: การสร้าง Backend API Routes (`app/api/auth/`)
- **`POST /api/auth/register`**: รับข้อมูล ตรวจสอบความถูกต้อง (Validation), ตรวจสอบชื่อผู้ใช้/อีเมลซ้ำ, Hash รหัสผ่าน, บันทึกลง Supabase, และตั้งค่า Session Cookie
- **`POST /api/auth/login`**: ตรวจสอบ Username/Email และ Password จาก Database, สร้างและส่งคืน Session Cookie
- **`POST /api/auth/logout`**: ล้างค่า Session Cookie ทิ้งทันที
- **`GET /api/auth/me`**: อ่าน Session Cookie เพื่อดึงข้อมูลผู้ใช้ปัจจุบันและสถานะการเชื่อมต่อ Database

---

### ขั้นตอนที่ 5: การพัฒนา Frontend UI/UX
- ออกแบบฟอร์มสไตล์ **Glassmorphism** พร้อมเอฟเฟกต์ไฟ Ambient Glow
- มีฟังก์ชันสลับการมองเห็นรหัสผ่าน (Show/Hide Password)
- มีระบบแสดงผลสถานะที่ชัดเจน (Loading Spinner, Success Alert, Error Notification)
- หน้า **Dashboard** ป้องกันการเข้าถึง (Protected Route) หากผู้ใช้ยังไม่ได้เข้าสู่ระบบ จะ Redirect ไปยังหน้า Login ทันที

---

## 🚀 ขั้นตอนการ Deploy ขึ้น Vercel และเชื่อมต่อ Supabase

### 1. การตั้งค่า Supabase Database
1. สร้าง Project บน [Supabase.com](https://supabase.com/) และตั้งรหัสผ่าน Database Password
2. ไปที่ **Project Dashboard** -> กดปุ่ม **"Connect"** (มุมบนขวา)
3. เลือกแท็บ **"Transaction Pooler"** (โหมด **URI**)
   - *หมายเหตุ: ต้องใช้ Connection Pooler (`aws-0-*.pooler.supabase.com:6543`) สำหรับ Vercel Serverless*
4. คัดลอก Connection String เช่น:
   ```text
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
   *(หากรหัสผ่านมีอักขระพิเศษ เช่น `#` ให้แปลงเป็น `%23`)*

### 2. การนำโค้ดขึ้น GitHub
```bash
git init
git add .
git commit -m "feat: Full-stack Login App with Supabase"
git branch -M main
git remote add origin https://github.com/ArnanMaipradit-rmutt/vercel-login-app.git
git push -u origin main
```

### 3. การ Deploy บน Vercel
1. เข้าไปที่ [Vercel Dashboard](https://vercel.com/) -> กด **Add New Project** -> **Import** Repository จาก GitHub
2. เพิ่ม **Environment Variables**:
   - `DATABASE_URL`: Connection String จาก Supabase (Transaction Pooler)
   - `JWT_SECRET`: รหัสสุ่มสำหรับสร้าง Session Token
3. กด **Deploy** 🚀

---

## 🔍 วิธีการเข้าดูข้อมูลใน Supabase (Database Management)

1. **ดูผ่าน Table Editor (UI)**:
   - เข้า [Supabase Dashboard](https://supabase.com/dashboard) -> เลือกโปรเจกต์
   - เมนูด้านซ้ายเลือก **"Table Editor"** -> เลือกตาราง **`users`**
   - จะเห็นรายชื่อผู้ใช้ที่สมัครเข้ามา พร้อม Password ที่ถูก Hash อย่างปลอดภัย
2. **ดูผ่าน SQL Editor**:
   - เมนูด้านซ้ายเลือก **"SQL Editor"** -> รันคำสั่ง:
     ```sql
     SELECT id, username, email, created_at FROM public.users ORDER BY created_at DESC;
     ```

---

## 💡 สรุป Best Practices & ข้อควรจำสำคัญ

1. **IPv4 vs IPv6 บน Serverless**: Supabase Direct Connection (`db.xxx.supabase.co`) รองรับ IPv6 เป็นหลัก ซึ่ง Vercel Function อาจเชื่อมต่อไม่ติด ดังนั้นบน Vercel ควรใช้ **Connection Pooler (`*.pooler.supabase.com:6543`)** เสมอ
2. **URL Encoding ใน Connection String**: หากรหัสผ่าน Database มีอักขระพิเศษ เช่น `#` หรือ `@` ต้องแปลงเป็น URL Format เสมอ (เช่น `#` -> `%23`) เพื่อไม่ให้ Driver เข้าใจผิดว่าเป็น URL Fragment
3. **Redeploy ทุกครั้งหลังแก้ Env**: เมื่อแก้ไขค่าตัวแปรใน Vercel Environment Variables จำเป็นต้องกด **Redeploy** 1 ครั้งเพื่อให้เวอร์ชันออนไลน์ดึงค่าใหม่ไปใช้
