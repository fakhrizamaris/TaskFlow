// web/components/tutorial/onboarding-tour.tsx
'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css'; // Import CSS wajib driver.js
import { completeTutorial } from '@/actions/user-progress';

interface OnboardingTourProps {
  showTutorial: boolean;
}

export const OnboardingTour = ({ showTutorial }: OnboardingTourProps) => {
  useEffect(() => {
    // Jika tutorial sudah selesai (false), jangan jalankan apa-apa
    if (!showTutorial) return;

    // Konfigurasi Driver.js
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: false, // User wajib selesaikan
      doneBtnText: 'Siap Mulai! 🚀',
      nextBtnText: 'Lanjut →',
      prevBtnText: '← Kembali',
      progressText: '{{current}} dari {{total}}',
      // Langkah-langkah Tutorial
      steps: [
        {
          element: '#welcome-header',
          popover: {
            title: 'Selamat Datang di TaskFlow! 👋',
            description: 'TaskFlow adalah aplikasi manajemen tugas modern yang membantu kamu mengatur pekerjaan dengan lebih efisien. Mari kita jelajahi fitur-fiturnya!',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#create-board-btn',
          popover: {
            title: '📋 Buat Board Baru',
            description: 'Mulai dengan membuat Board pertamamu! Board adalah wadah untuk mengorganisir semua tugas dalam satu proyek. Kamu bisa membuat board Pribadi atau Kolaborasi.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          popover: {
            title: '✨ Fitur List & Card',
            description: 'Di dalam Board, kamu bisa membuat List (kolom) untuk mengkategorikan tugas, lalu menambahkan Card (kartu tugas) di setiap list. Drag & drop untuk mengatur urutan!',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          popover: {
            title: '⏰ Deadline & Reminder',
            description: 'Setiap card bisa diberi deadline. TaskFlow akan mengirimkan email reminder otomatis saat deadline mendekat, lengkap dengan integrasi Google Calendar!',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          popover: {
            title: '👥 Kolaborasi Real-time',
            description: 'Undang teman ke board kolaborasimu dengan kode unik. Semua perubahan tersinkronisasi secara real-time, dan kamu bisa melihat siapa yang sedang online!',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          popover: {
            title: '📊 Status Tracking',
            description: 'Tandai progress tugasmu dengan status: TODO, IN PROGRESS, atau DONE. Visualisasi status membantu kamu memantau kemajuan proyek dengan mudah.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          popover: {
            title: '⌨️ Keyboard Shortcuts',
            description: 'Tingkatkan produktivitasmu dengan shortcut: Ctrl+K untuk pencarian, Ctrl+N untuk board baru, dan banyak lagi. Semua bisa diakses dari Quick Actions bar!',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#create-board-btn',
          popover: {
            title: '🎯 Mulai Sekarang!',
            description: 'Tutorial selesai! Klik tombol ini untuk membuat Board pertamamu dan mulai mengatur tugas. Selamat berproduktivitas! 💪',
            side: 'bottom',
            align: 'center',
          },
        },
      ],
      // Saat tutorial selesai/ditutup, panggil Server Action
      onDestroyStarted: () => {
        completeTutorial(); // Update DB jadi true
        driverObj.destroy();
      },
    });

    // Jalankan tutorial
    driverObj.drive();
  }, [showTutorial]);

  return null; // Komponen ini tidak me-render UI, cuma logika
};
