# 📧 Setup Email Notifications - Frello

## Daftar Isi
1. [Variabel Environment](#variabel-environment)
2. [Setup Gmail SMTP](#setup-gmail-smtp)
3. [Setup Resend (Alternatif)](#setup-resend-alternatif)
4. [Testing Email](#testing-email)
5. [Cron Job untuk Deadline Reminder](#cron-job-untuk-deadline-reminder)

---

## Variabel Environment

Tambahkan variabel berikut ke file `.env.local` atau `.env`:

```env
# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_NAME=Frello

# Cron Security
CRON_SECRET=your-random-secret-string

# App URL (for email links)
NEXTAUTH_URL=https://your-domain.com
```

---

## Setup Gmail SMTP

### Langkah 1: Aktifkan 2-Step Verification
1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Aktifkan "2-Step Verification"

### Langkah 2: Generate App Password
1. Buka [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Pilih "Mail" dan "Other (Custom name)"
3. Masukkan nama: "Frello"
4. Copy password yang dihasilkan (16 karakter)

### Langkah 3: Update Environment
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # App password dari Google
```

---

## Setup Resend (Alternatif)

[Resend](https://resend.com) adalah layanan email modern yang mudah digunakan.

### Langkah 1: Daftar & Dapatkan API Key
1. Buka [resend.com](https://resend.com)
2. Daftar dan buat API key

### Langkah 2: Install Package (Opsional)
```bash
npm install resend
```

### Langkah 3: Update Environment
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxxxxxxxxx  # API key dari Resend
```

---

## Testing Email

### Test Manual via API
```bash
# Test deadline reminder endpoint
curl -X GET http://localhost:3000/api/cron/deadline-reminder \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Test di Development
1. Daftarkan user baru → Cek email welcome
2. Buat card dengan deadline 1-24 jam dari sekarang
3. Hit endpoint `/api/cron/deadline-reminder`

---

## Cron Job untuk Deadline Reminder

### Opsi 1: Vercel Cron (Recommended untuk Vercel deployment)
File `vercel.json` sudah dikonfigurasi untuk menjalankan reminder setiap 3 jam:
```json
{
  "crons": [
    {
      "path": "/api/cron/deadline-reminder",
      "schedule": "0 */3 * * *"
    }
  ]
}
```

### Opsi 2: GitHub Actions
Buat file `.github/workflows/deadline-reminder.yml`:
```yaml
name: Deadline Reminder
on:
  schedule:
    - cron: '0 */3 * * *'  # Setiap 3 jam
  workflow_dispatch:  # Manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Deadline Reminder
        run: |
          curl -X GET "${{ secrets.APP_URL }}/api/cron/deadline-reminder" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Opsi 3: External Cron Service
Gunakan layanan seperti:
- [cron-job.org](https://cron-job.org) (Gratis)
- [EasyCron](https://www.easycron.com)
- [Upstash QStash](https://upstash.com/qstash)

Setup:
1. URL: `https://your-domain.com/api/cron/deadline-reminder`
2. Method: GET
3. Header: `Authorization: Bearer YOUR_CRON_SECRET`
4. Schedule: Setiap 1-3 jam

---

## Troubleshooting

### Email Tidak Terkirim
1. Periksa log di console untuk error message
2. Pastikan App Password benar (bukan password biasa)
3. Cek apakah 2-Step Verification aktif di Gmail

### Gmail Blocking
Jika Gmail memblokir, coba:
1. Buka [Less Secure Apps](https://myaccount.google.com/lesssecureapps) (tidak disarankan)
2. Gunakan App Password (recommended)
3. Gunakan layanan lain seperti Resend

### Rate Limiting
Gmail memiliki limit 500 email/hari. Untuk produksi besar, gunakan:
- [Resend](https://resend.com)
- [SendGrid](https://sendgrid.com)
- [Amazon SES](https://aws.amazon.com/ses/)

---

## Email yang Dikirim

### 1. Welcome Email
Dikirim saat user berhasil mendaftar:
- Subject: "🚀 Selamat Datang di Frello!"
- Isi: Greeting, fitur-fitur, link ke dashboard

### 2. Deadline Reminder
Dikirim via cron job untuk:
- Task dengan deadline dalam 24 jam
- Task yang sudah terlambat (max 3 hari)
- Subject: "⏰ Deadline Reminder - Frello" atau "⚠️ Ada Task Terlambat!"

---

Happy coding! 🚀
