'use client';

import { useState, useMemo } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/actions/register';

// Password strength calculator
function calculatePasswordStrength(password: string, name: string): { score: number; label: string; color: string; checks: { label: string; passed: boolean }[] } {
  const checks = [
    { label: 'Minimal 6 karakter', passed: password.length >= 6 },
    { label: 'Mengandung huruf besar', passed: /[A-Z]/.test(password) },
    { label: 'Mengandung huruf kecil', passed: /[a-z]/.test(password) },
    { label: 'Mengandung angka', passed: /[0-9]/.test(password) },
    { label: 'Mengandung simbol (!@#$%^&*)', passed: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    {
      label: 'Tidak mengandung nama',
      passed:
        name.length < 2 ||
        !name
          .toLowerCase()
          .split(/\s+/)
          .some((part) => part.length >= 2 && password.toLowerCase().includes(part)),
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  let score = 0;
  let label = '';
  let color = '';

  if (password.length === 0) {
    score = 0;
    label = '';
    color = 'bg-zinc-700';
  } else if (passedCount <= 2) {
    score = 1;
    label = 'Lemah';
    color = 'bg-rose-500';
  } else if (passedCount <= 4) {
    score = 2;
    label = 'Sedang';
    color = 'bg-amber-500';
  } else {
    score = 3;
    label = 'Kuat';
    color = 'bg-emerald-500';
  }

  return { score, label, color, checks };
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate password strength
  const passwordStrength = useMemo(() => calculatePasswordStrength(password, name), [password, name]);

  // Check if password contains name
  const passwordContainsName = useMemo(() => {
    if (name.length < 2 || password.length === 0) return false;
    return name
      .toLowerCase()
      .split(/\s+/)
      .some((part) => part.length >= 2 && password.toLowerCase().includes(part));
  }, [password, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    // Validate password doesn't contain name
    if (passwordContainsName) {
      setError('Password tidak boleh mengandung nama Anda');
      return;
    }

    // Validate minimum password strength
    if (passwordStrength.score < 2) {
      setError('Password terlalu lemah. Silakan gunakan kombinasi huruf besar, kecil, angka, dan simbol.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      const result = await register(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(result.success);
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg grid-pattern min-h-screen flex items-center justify-center p-4">
      {/* Floating Orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      <div className="relative w-full max-w-md">
        {/* Register Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10 shine">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50" />
                <img src="/favicon.png" alt="Flerro Logo" className="relative h-8 w-8" />
              </div>
              <span className="text-3xl font-bold gradient-text-glow">Flerro</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Buat Akun Baru</h1>
            <p className="text-zinc-400 text-sm">Daftar untuk mulai mengelola project Anda</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className={`w-full pl-12 pr-12 py-3.5 bg-zinc-800/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    passwordContainsName ? 'border-rose-500/50 focus:border-rose-500/50' : 'border-zinc-700/50 focus:border-indigo-500/50'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {isPasswordFocused && (
                <div className="space-y-3">
                  {/* Strength Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-zinc-700'}`} style={{ width: '33%' }} />
                      <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-zinc-700'}`} style={{ width: '33%' }} />
                      <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-zinc-700'}`} style={{ width: '34%' }} />
                    </div>
                    {passwordStrength.label && <span className={`text-xs font-medium ${passwordStrength.score === 1 ? 'text-rose-400' : passwordStrength.score === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{passwordStrength.label}</span>}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-zinc-800/30 rounded-lg p-3 space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-300">
                    <p className="text-xs font-medium text-zinc-400 mb-2">Persyaratan password:</p>
                    {passwordStrength.checks.map((check, index) => (
                      <div key={index} className={`flex items-center gap-2 text-xs ${check.passed ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {check.passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        <span>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Password"
                required
                minLength={6}
                className={`w-full pl-12 pr-12 py-3.5 bg-zinc-800/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  confirmPassword.length > 0 && password !== confirmPassword ? 'border-rose-500/50 focus:border-rose-500/50' : 'border-zinc-700/50 focus:border-indigo-500/50'
                }`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors">
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword.length > 0 && (
              <div className={`flex items-center gap-2 text-xs ${password === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                {password === confirmPassword ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                <span>{password === confirmPassword ? 'Password cocok' : 'Password tidak cocok'}</span>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading || passwordStrength.score < 2 || passwordContainsName}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Daftar Sekarang</>}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-zinc-400">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
