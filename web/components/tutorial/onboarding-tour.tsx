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
      allowClose: false, // User wajib selesaikan (opsional)
      doneBtnText: 'Siap Mulai!',
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      // Langkah-langkah Tutorial
      steps: [
        {
          element: '#welcome-header', // ID elemen yang disorot
          popover: {
            title: 'Selamat Datang di TaskFlow! 👋',
            description: 'Aplikasi manajemen tugas simpel dan cepat untuk produktivitasmu.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#create-board-btn', // ID tombol create board
          popover: {
            title: 'Mulai Project Pertama',
            description: 'Klik tombol ini untuk membuat papan kerja (Board) baru.',
            side: 'top',
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
