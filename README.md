# QuickBite_QR : Smart QR-Based Food Ordering System

A Next.js + Supabase powered digital ordering system designed for small eateries, campus food stalls, cafés, and tapris.  
Customers scan a QR → view the menu → place orders → staff track them in real-time.

---

## 📖 Overview

QuickBite QR is a full digital ordering system that replaces manual order-taking at food stalls.  
Designed especially for college campus tapris and night-time eateries, it simplifies:

- Ordering  
- Menu browsing  
- Live order tracking  
- Vendor-side kitchen management  

With **Next.js 14 App Router** + **Supabase Realtime**, the platform supports fast, serverless, and scalable functionality.

---

## ⭐ Features

### 🍽️ Customer Side
- Scan QR to access menu  
- Browse items & add to cart  
- Place orders instantly  
- Track order status (Placed → Cooking → Ready)

### 👨‍🍳 Vendor / Staff Dashboard
- Live order feed (auto-updates)  
- Update order status  
- Order history log  
- Manage operational workflow  

### 🛠️ Admin / Management
- Menu management (add/edit/remove items)  
- Price & availability toggles  

---

## 🧰 Tech Stack

### **Frontend**
- Next.js 14 (App Router)  
- React 18  
- TypeScript  
- Tailwind CSS  
- shadcn/ui (Radix-based UI components)

### **Backend**
- Supabase (Backend-as-a-Service)  
- PostgreSQL Database  
- Supabase Auth  
- Supabase Realtime  
- Supabase Edge Functions (Deno runtime)

### **Dev Tools**
- ESLint  
- PostCSS  
- Vercel Deployment  
- Git & GitHub  

---

## 🏗️ Architecture



      ┌──────────────┐        ┌────────────────────┐
      │   Customer    │        │      Vendor         │
      │ (QR Scanning) │        │   Dashboard UI      │
      └──────┬───────┘        └────────┬────────────┘
             │                         │
             ▼                         ▼
        ┌──────────────────────────────────────┐
        │        Next.js App Router            │
        │    (UI, Routing, Middleware)         │
        └───────────────────┬──────────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │       Supabase        │
                 │  Postgres DB          │
                 │  Auth & Storage       │
                 │  Realtime Channels    │
                 │  Edge Functions       │
                 └───────────────────────┘
                            │
                            ▼
                     Staff Order Updates
---

## 🗂️ Folder Structure
---

QUICK_BITE_QR_MAIN/
│
├── public/                   # Static assets
│
├── src/
│   ├── app/                  # Next.js App Router pages, routes, API handlers
│   ├── components/           # Reusable UI components (shadcn/ui)
│   ├── lib/                  # Helper utilities, Supabase client
│   ├── styles/               # Global CSS
│   ├── types/                # TypeScript type definitions
│   └── middleware.ts         # Next.js middleware (auth/route guards)
│
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind setup
├── postcss.config.mjs        # PostCSS setup
├── components.json           # shadcn/ui component registry
├── deno.lock                 # Supabase edge functions compatibility
├── import_map.json           # Module mapping for Deno
│
├── DESIGN_PLAN_LIVE_ORDERS.md
├── MONTHLY_COST_CALCULATION.md
├── SAAS_COST_BREAKDOWN.md
├── SUPABASE_PLAN_COMPARISON.md
├── SUPABASE_LIMITS_AND_CONSTRAINTS.md
│
└── README.md
---

## ⚙️ Setup & Installation
1. Clone the repository
```bash
   git clone https://github.com/manisha999404/QuickBite_QR.git
   cd QuickBite_QR
```
3. Install dependencies
```bash
   npm install
```
---

## 🔐 Environment Variables

Create a **.env.local** file in the project root and add the following keys:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role
DATABASE_URL=your_postgres_connection_url
```


## ▶️ Running the Project

### **Development Mode**
```bash
npm run dev 
```
Project runs at ➝ **http://localhost:3000/**
---

## 🏗️ Build for Production

### **Create an optimized production build:**
```bash
npm run build
npm start
```
---

## 🚀 Deploy

### **Recommended Setup**
- Frontend → Vercel
- Backend (DB/Auth/Realtime/Functions) → Supabase

This provides:
- Serverless scaling
- Instant deployments
- Realtime updates

---

## 🚧 Future Enhancements

- 💳 Payment integration (Razorpay / Stripe)
- 📊 Analytics dashboard (popular items, peak hours)
- 📱 Vendor mobile app
- 📦 PWA support (offline mode)
- 🏪 Multi-vendor support
- 🪪 Table QR mapping
- 🔔 Push notifications

---

## 📄 License

This project is open-source under the MIT License.
---

## 🎉 Thank You for Using QuickBite QR!

---






