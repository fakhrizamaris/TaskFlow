// web/components/tutorial/onboarding-tour.tsx
'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { completeTutorial } from '@/actions/user-progress';

interface OnboardingTourProps {
  showTutorial: boolean;
}

export const OnboardingTour = ({ showTutorial }: OnboardingTourProps) => {
  useEffect(() => {
    if (!showTutorial) return;

    // Define all possible steps focused on Dashboard elements
    const stepsConf = [
      {
        element: '#welcome-header',
        popover: {
          title: 'Selamat Datang di TaskFlow! 👋',
          description: 'Halo! Ini adalah dashboard pribadimu. Di sini kamu bisa melihat ringkasan aktivitas dan mengelola semua proyekmu.',
          side: 'bottom' as const,
          align: 'start' as const,
        },
      },
      {
        element: '#stats-overview',
        popover: {
          title: 'Pantau Progresmu 📊',
          description: 'Lihat statistik produktivitasmu secara real-time. Pantau board, tugas selesai, tugas pending, dan rekan kolaborasi di satu tempat.',
          side: 'bottom' as const,
          align: 'center' as const,
        },
      },
      {
        element: '#quick-actions',
        popover: {
          title: 'Akses Cepat ⚡',
          description: 'Gunakan panel ini untuk pencarian cepat (Ctrl+K) atau membuka kembali board yang baru saja kamu akses.',
          side: 'top' as const,
          align: 'center' as const,
        },
      },
      {
        element: '#create-board-btn',
        popover: {
          title: 'Buat Board Baru 📋',
          description: 'Mulai proyek baru dengan membuat Board. Di dalamnya kamu bisa membuat List dan Card untuk mengatur tugas.',
          side: 'bottom' as const,
          align: 'center' as const,
        },
      },
      {
        element: '#join-board-btn',
        popover: {
          title: 'Kolaborasi Tim 🤝',
          description: 'Punya kode undangan? Klik di sini untuk bergabung ke board teman atau tim-mu dan mulai berkolaborasi.',
          side: 'bottom' as const,
          align: 'center' as const,
        },
      },
      {
        element: '#logout-btn',
        popover: {
          title: 'Akun & Keluar 🚪',
          description: 'Klik tombol ini jika kamu ingin keluar dari sesi akunmu dengan aman.',
          side: 'left' as const,
          align: 'center' as const,
        },
      },
    ];

    // Filter steps ensuring the target element exists in the DOM
    const validSteps = stepsConf.filter((step) => {
      return !!document.querySelector(step.element);
    });

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: false,
      doneBtnText: 'Siap Mulai! 🚀',
      nextBtnText: 'Lanjut →',
      prevBtnText: '← Kembali',
      progressText: '{{current}} dari {{total}}',
      steps: validSteps,
      onDestroyStarted: () => {
        completeTutorial();
        driverObj.destroy();
      },
    });

    // Validasi double check untuk memastikan element sudah render
    // Terkadang useEffect jalan sebelum paint selesai sempurna
    const timer = setTimeout(() => {
      driverObj.drive();
    }, 500);

    return () => clearTimeout(timer);
  }, [showTutorial]);

  return null;
};
