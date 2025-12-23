// web/actions/register.ts
'use server';

import { db } from '@/lib/db';
import { z } from 'zod';
import * as nodeCrypto from 'crypto';
import { sendEmail } from '@/lib/email';
import { getWelcomeEmailTemplate, getWelcomeEmailText } from '@/lib/email-templates';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// Simple hash function using Node.js crypto module

function hashPassword(password: string): string {
  const hash = nodeCrypto.createHash('sha256');
  hash.update(password + process.env.AUTH_SECRET);
  return hash.digest('hex');
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate input
  const validationResult = registerSchema.safeParse({ name, email, password });
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((issue) => issue.message);
    return { error: errors[0] };
  }

  // Check if password contains name
  const nameParts = name.toLowerCase().split(/\s+/);
  const passwordLower = password.toLowerCase();
  const containsName = nameParts.some((part) => part.length >= 2 && passwordLower.includes(part));
  if (containsName) {
    return { error: 'Password tidak boleh mengandung nama Anda' };
  }

  // Check password strength (at least 2 out of: uppercase, lowercase, number, symbol)
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthCount = [hasUppercase, hasLowercase, hasNumber, hasSymbol].filter(Boolean).length;
  if (strengthCount < 2) {
    return { error: 'Password terlalu lemah. Gunakan kombinasi huruf besar, kecil, angka, atau simbol.' };
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // If user exists with a password, they should login instead
      if (existingUser.password) {
        return { error: 'Email sudah terdaftar. Silakan login.' };
      }
      // If user exists via OAuth, add password to their account
      const hashedPassword = await hashPassword(password);
      await db.user.update({
        where: { email: email.toLowerCase() },
        data: {
          password: hashedPassword,
          name: existingUser.name || name, // Keep existing name if available
        },
      });
      return { success: 'Password berhasil ditambahkan ke akun Anda. Silakan login.' };
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // Send welcome email (async, don't wait for it)
    sendEmail({
      to: email.toLowerCase(),
      subject: '🚀 Selamat Datang di Frello!',
      html: getWelcomeEmailTemplate(name),
      text: getWelcomeEmailText(name),
    }).catch((err) => {
      console.error('Failed to send welcome email:', err);
    });

    return { success: 'Registrasi berhasil! Silakan login.' };
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      return { error: `Terjadi kesalahan: ${error.message}` };
    }
    return { error: 'Terjadi kesalahan. Silakan coba lagi.' };
  }
}
