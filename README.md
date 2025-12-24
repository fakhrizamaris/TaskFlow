# Flerro

<div align="center">

![Flerro Banner](https://img.shields.io/badge/Flerro-Task%20Management%20Made%20Simple-6366f1?style=for-the-badge&logo=trello&logoColor=white)

**Aplikasi Manajemen Tugas Modern dengan Kolaborasi Real-time**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-black?style=flat-square&logo=socket.io)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Demo](#demo) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Teknologi](#-teknologi) • [Arsitektur](#-arsitektur)

</div>

---

## 📋 Deskripsi

**Flerro** adalah aplikasi manajemen tugas (Task Management) berbasis web yang terinspirasi dari Trello/Kanban board. Dibangun dengan teknologi modern, Flerro memungkinkan pengguna untuk mengorganisir tugas dalam bentuk board, list, dan card dengan kemampuan drag-and-drop dan kolaborasi real-time.

### ✨ Mengapa Flerro?

- 🎯 **Simpel & Intuitif** - Interface yang bersih dan mudah digunakan
- ⚡ **Real-time Sync** - Perubahan langsung tersinkronisasi antar pengguna
- 📧 **Smart Reminder** - Notifikasi email otomatis untuk deadline
- 🎨 **Modern Design** - UI premium dengan glassmorphism dan animasi halus
- 📱 **Responsive** - Optimal di desktop maupun mobile

---

## 🎯 Fitur Utama

### 📋 Board Management

- ✅ Buat board **Pribadi** atau **Kolaborasi**
- ✅ Delete board dengan konfirmasi modal
- ✅ Auto-generate kode undangan unik (6 karakter)
- ✅ Badge visual untuk tipe board (Pribadi/Kolaborasi)

### 📝 List & Card

- ✅ Buat, edit, dan hapus list dalam board
- ✅ Tambahkan card/tugas di setiap list
- ✅ **Drag & Drop** untuk mengatur urutan list dan card
- ✅ Deskripsi tugas yang detail

### ⏰ Deadline & Reminder

- ✅ Set deadline untuk setiap card dengan date picker
- ✅ **Visual indicator** status deadline:
  - 🔴 Overdue (terlewat)
  - 🟡 Due Today (hari ini)
  - 🟢 Upcoming (mendatang)
- ✅ **Email reminder otomatis** saat deadline mendekat
- ✅ Integrasi **Google Calendar** - tambah event langsung dari email

### 📊 Status Tracking

- ✅ Tiga level status: `TODO`, `IN_PROGRESS`, `DONE`
- ✅ Visual badge dengan warna berbeda tiap status
- ✅ Toggle status dengan satu klik

### 👥 Kolaborasi Real-time

- ✅ Undang anggota via **kode unik**
- ✅ Lihat siapa saja yang **sedang online** di board
- ✅ **Real-time sync** - perubahan langsung terlihat
- ✅ Indikator aktivitas pengguna lain (hover, drag, typing)

### 🎮 Gamifikasi & UX

- ✅ **Onboarding tutorial** interaktif untuk user baru (Driver.js)
- ✅ **Keyboard shortcuts** untuk produktivitas:
  - `Ctrl+K` - Buka pencarian
  - `Ctrl+N` - Buat board baru
  - `Ctrl+J` - Gabung board
- ✅ **Quick Actions bar** dengan akses cepat
- ✅ **Stats Overview** dengan animasi counter

### 🔐 Autentikasi

- ✅ Login dengan **Google OAuth**
- ✅ Registrasi dengan **Email & Password**
- ✅ Welcome email otomatis untuk user baru
- ✅ Session management dengan Auth.js

---

## 🛠️ Teknologi

### Frontend (Web App)

| Teknologi         | Versi   | Fungsi                       |
| ----------------- | ------- | ---------------------------- |
| Next.js           | 16.1.0  | React Framework (App Router) |
| React             | 19.2.3  | UI Library                   |
| TypeScript        | 5.x     | Type Safety                  |
| TailwindCSS       | 4.x     | Styling                      |
| Zustand           | 5.0.9   | State Management             |
| React Hook Form   | 7.69.0  | Form Handling                |
| Zod               | 4.2.1   | Schema Validation            |
| @hello-pangea/dnd | 18.0.1  | Drag & Drop                  |
| Driver.js         | 1.4.0   | Onboarding Tutorial          |
| Lucide React      | 0.562.0 | Icons                        |
| Socket.IO Client  | 4.8.1   | Real-time Communication      |

### Backend

| Teknologi          | Versi         | Fungsi                    |
| ------------------ | ------------- | ------------------------- |
| Next.js API Routes | -             | REST API & Server Actions |
| Prisma             | 7.2.0         | ORM & Database Management |
| PostgreSQL         | -             | Database                  |
| Auth.js            | 5.0.0-beta.30 | Authentication            |
| Nodemailer         | 7.0.12        | Email Service             |

### Real-time Server

| Teknologi  | Versi | Fungsi           |
| ---------- | ----- | ---------------- |
| Socket.IO  | 4.x   | WebSocket Server |
| Express    | 4.x   | HTTP Server      |
| TypeScript | 5.x   | Type Safety      |

### Development & Testing

| Teknologi       | Fungsi            |
| --------------- | ----------------- |
| Vitest          | Unit Testing      |
| Testing Library | Component Testing |
| ESLint          | Linting           |

---

## 🏗️ Arsitektur

```mermaid
flowchart TB
    subgraph CLIENT["🌐 CLIENT (Browser)"]
        direction LR
        NEXTJS["⚛️ Next.js\n(React 19)"]
        ZUSTAND["📦 Zustand\n(State)"]
        SOCKETCLIENT["🔌 Socket.IO Client\n(Real-time Events)"]
    end

    subgraph SERVER["🖥️ SERVER LAYER"]
        direction TB
        subgraph NEXTBACKEND["Next.js Backend"]
            ACTIONS["⚡ Server Actions"]
            APIROUTES["🛣️ API Routes"]
            AUTHJS["🔐 Auth.js"]
            PRISMA["💎 Prisma ORM"]
        end

        subgraph SOCKETSERVER["Socket.IO Server"]
            ROOMMANAGE["🏠 Board Room Management"]
            REALTIMESYNC["🔄 Real-time Sync"]
            PRESENCE["👥 User Presence"]
        end
    end

    subgraph DATABASE["🗄️ DATABASE LAYER"]
        subgraph POSTGRESQL["PostgreSQL"]
            USER[(User)]
            BOARD[(Board)]
            LIST[(List)]
            CARD[(Card)]
            MEMBER[(BoardMember)]
        end
    end

    CLIENT --> SERVER
    NEXTJS --> ACTIONS
    NEXTJS --> APIROUTES
    ZUSTAND --> NEXTJS
    SOCKETCLIENT --> SOCKETSERVER
    PRISMA --> POSTGRESQL
    AUTHJS --> USER
```

### Alur Data (Data Flow)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant C as 🌐 Client (Browser)
    participant N as ⚡ Next.js Backend
    participant S as 🔌 Socket.IO Server
    participant D as 🗄️ PostgreSQL

    U->>C: Aksi (Create/Update/Delete)
    C->>N: Server Action / API Call
    N->>D: Query Database (Prisma)
    D-->>N: Response Data
    N-->>C: Return Result
    C->>S: Emit Event (update-board)
    S->>C: Broadcast ke User Lain
    C-->>U: Update UI Real-time
```

---

## 📦 Struktur Folder

```
Flerro/
├── 📁 web/                          # Next.js Web Application
│   ├── 📁 app/                      # App Router
│   │   ├── 📁 (auth)/               # Auth pages (login, register)
│   │   ├── 📁 (dashboard)/          # Dashboard & Board pages
│   │   │   └── 📁 dashboard/
│   │   │       ├── 📁 board/[boardId]/  # Board detail page
│   │   │       └── page.tsx         # Dashboard home
│   │   ├── 📁 api/                  # API Routes
│   │   ├── 📁 join/                 # Join board via invite
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing page
│   │
│   ├── 📁 actions/                  # Server Actions
│   │   ├── create-board.ts
│   │   ├── create-list.ts
│   │   ├── create-card.ts
│   │   ├── update-card-deadline.ts
│   │   ├── update-card-status.ts
│   │   ├── delete-board.ts
│   │   ├── invite-member.ts
│   │   └── ...
│   │
│   ├── 📁 components/               # React Components
│   │   ├── 📁 dashboard/            # Dashboard components
│   │   │   ├── board-card.tsx
│   │   │   ├── create-board-button.tsx
│   │   │   ├── join-board-button.tsx
│   │   │   ├── quick-actions.tsx
│   │   │   └── stats-overview.tsx
│   │   ├── 📁 tutorial/             # Onboarding components
│   │   │   └── onboarding-tour.tsx
│   │   └── 📁 ui/                   # Reusable UI components
│   │
│   ├── 📁 lib/                      # Utilities & Config
│   │   ├── auth.ts                  # Auth.js configuration
│   │   ├── db.ts                    # Prisma client
│   │   ├── email.ts                 # Nodemailer setup
│   │   └── email-templates.ts       # HTML email templates
│   │
│   ├── 📁 hooks/                    # Custom React Hooks
│   ├── 📁 store/                    # Zustand Stores
│   ├── 📁 prisma/                   # Database Schema
│   │   └── schema.prisma
│   └── 📁 public/                   # Static Assets
│
├── 📁 socket-server/                # Socket.IO Server
│   ├── 📁 src/
│   │   └── index.ts                 # Server entry point
│   ├── Dockerfile                   # Container config
│   ├── cloudbuild.yaml              # GCP Cloud Build
│   └── package.json
│
└── .gitignore
```

---

## 🗃️ Database Schema (ERD)

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : has
    USER ||--o{ SESSION : has
    USER ||--o{ BOARD : owns
    USER ||--o{ BOARD_MEMBER : joins
    USER ||--o{ CARD : authors

    BOARD ||--o{ LIST : contains
    BOARD ||--o{ BOARD_MEMBER : has

    LIST ||--o{ CARD : contains

    USER {
        string id PK
        string name
        string email UK
        string password
        string image
        boolean tutorialCompleted
        datetime createdAt
        datetime updatedAt
    }

    ACCOUNT {
        string id PK
        string userId FK
        string type
        string provider
        string providerAccountId
        string access_token
        string refresh_token
        int expires_at
    }

    SESSION {
        string id PK
        string sessionToken UK
        string userId FK
        datetime expires
    }

    BOARD {
        string id PK
        string title
        string userId FK
        string inviteCode UK
        datetime createdAt
        datetime updatedAt
    }

    LIST {
        string id PK
        string title
        int order
        string boardId FK
    }

    CARD {
        string id PK
        string title
        string description
        int order
        enum status "TODO|IN_PROGRESS|DONE"
        datetime dueDate
        string listId FK
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }

    BOARD_MEMBER {
        string id PK
        string boardId FK
        string userId FK
        string role "admin|member"
        datetime joinedAt
    }
```

### Penjelasan Relasi

| Relasi               | Deskripsi                                           |
| -------------------- | --------------------------------------------------- |
| `User → Board`       | Satu user dapat memiliki banyak board (One-to-Many) |
| `User → BoardMember` | User dapat bergabung ke banyak board sebagai member |
| `Board → List`       | Satu board memiliki banyak list (One-to-Many)       |
| `List → Card`        | Satu list memiliki banyak card (One-to-Many)        |
| `User → Card`        | User sebagai author card (One-to-Many)              |
| `User → Account`     | Untuk OAuth provider (Google, dll)                  |
| `User → Session`     | Manajemen session login                             |

---

## 🚀 Instalasi

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm / yarn / pnpm

### 1. Clone Repository

```bash
git clone https://github.com/username/Flerro.git
cd Flerro
```

### 2. Setup Web Application

```bash
cd web

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env dengan konfigurasi Anda:
# - DATABASE_URL (PostgreSQL connection string)
# - AUTH_SECRET (random string untuk Auth.js)
# - AUTH_GOOGLE_ID & AUTH_GOOGLE_SECRET (OAuth credentials)
# - SMTP credentials untuk email
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push
```

### 4. Setup Socket Server (Opsional - untuk real-time)

```bash
cd ../socket-server

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run server
npm start
```

### 5. Jalankan Development Server

```bash
cd ../web

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📝 Environment Variables

### Web App (`.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/Flerro"

# Auth.js
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# SMTP Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Socket Server
NEXT_PUBLIC_SOCKET_URL="http://localhost:8080"
```

### Socket Server

```env
PORT=8080
```

---

## 🧪 Testing

```bash
cd web

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🚢 Deployment

### Web App (Vercel)

1. Connect repository ke Vercel
2. Set environment variables
3. Deploy otomatis saat push ke `main`

### Socket Server (Google Cloud Run)

```bash
cd socket-server

# Build dan deploy menggunakan Cloud Build
gcloud builds submit --config=cloudbuild.yaml
```

---

## 📄 Scripts

### Web App

| Script          | Deskripsi                   |
| --------------- | --------------------------- |
| `npm run dev`   | Jalankan development server |
| `npm run build` | Build production            |
| `npm run start` | Jalankan production server  |
| `npm run lint`  | Cek ESLint errors           |
| `npm run test`  | Jalankan unit tests         |

### Socket Server

| Script          | Deskripsi                     |
| --------------- | ----------------------------- |
| `npm run build` | Compile TypeScript            |
| `npm run start` | Jalankan server               |
| `npm run dev`   | Mode development dengan watch |

---

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau open issue untuk:

- 🐛 Bug fixes
- ✨ Fitur baru
- 📝 Dokumentasi
- 🎨 Improvements

---

## 📜 Lisensi

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ using Next.js & TypeScript**

[⬆ Kembali ke atas](#-Flerro)

</div>
