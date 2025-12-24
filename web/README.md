# TaskFlow Web App

Ini adalah aplikasi web utama TaskFlow yang dibangun dengan Next.js.

Untuk dokumentasi lengkap, silakan lihat [README utama](../README.md) di root project.

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Scripts

| Script          | Deskripsi                   |
| --------------- | --------------------------- |
| `npm run dev`   | Jalankan development server |
| `npm run build` | Build production            |
| `npm run start` | Jalankan production server  |
| `npm run lint`  | Cek ESLint errors           |
| `npm run test`  | Jalankan unit tests         |
