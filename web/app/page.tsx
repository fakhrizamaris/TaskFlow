import Link from 'next/link';
import { auth } from '@/lib/auth';
import { ArrowRight, Layout, Users, Zap, Clock, Bell, BarChart3, Sparkles, CheckCircle2, ChevronDown, Star, Shield, Layers, GitBranch, MessageSquare, Calendar, Target, TrendingUp, Globe, Lock } from 'lucide-react';

export default async function LandingPage() {
  const session = await auth();

  const features = [
    {
      icon: Layout,
      title: 'Kanban Board Interaktif',
      description: 'Visualisasikan workflow tim dengan drag-and-drop intuitif. Kelola status tugas dari To-Do hingga Done dengan antarmuka yang seamless.',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
    },
    {
      icon: Users,
      title: 'Kolaborasi Real-time',
      description: 'Bekerja bersama tim secara live. Lihat siapa yang sedang online, cursor mereka bergerak, dan perubahan yang terjadi secara instan.',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
    },
    {
      icon: Zap,
      title: 'Sync Instan dengan WebSocket',
      description: 'Teknologi WebSocket memastikan setiap perubahan tersinkronisasi dalam milidetik. Tidak perlu refresh, semua update otomatis.',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      icon: Clock,
      title: 'Time Tracking Terintegrasi',
      description: 'Lacak waktu yang dihabiskan untuk setiap tugas. Dapatkan insight produktivitas dan buat estimasi yang lebih akurat.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Sistem notifikasi cerdas yang memberi tahu tentang mention, deadline, dan update penting. Tidak akan melewatkan apapun.',
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Dashboard analitik komprehensif dengan burndown chart, velocity tracking, dan laporan produktivitas tim yang detail.',
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/30',
    },
  ];

  const additionalFeatures = [
    { icon: Layers, label: 'Multi-Board Management' },
    { icon: GitBranch, label: 'Workflow Automation' },
    { icon: MessageSquare, label: 'Comments & Threads' },
    { icon: Calendar, label: 'Calendar View' },
    { icon: Target, label: 'Goal Tracking' },
    { icon: TrendingUp, label: 'Sprint Planning' },
    { icon: Globe, label: 'Multi-Language' },
    { icon: Lock, label: 'Role-Based Access' },
  ];

  const stats = [
    { value: '10K+', label: 'Task Diselesaikan' },
    { value: '500+', label: 'Tim Aktif' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'Rating Pengguna' },
  ];

  const testimonials = [
    {
      name: 'Andi Pratama',
      role: 'Product Manager, TechStartup',
      content: 'Flerro mengubah cara tim kami bekerja. Kolaborasi real-time-nya luar biasa, seperti berada di ruangan yang sama meskipun remote.',
      avatar: 'AP',
    },
    {
      name: 'Sarah Wijaya',
      role: 'Scrum Master, Enterprise Corp',
      content: 'Fitur analytics-nya sangat membantu untuk sprint retrospective. Kami bisa melihat velocity dan bottleneck dengan jelas.',
      avatar: 'SW',
    },
    {
      name: 'Budi Santoso',
      role: 'CTO, Digital Agency',
      content: 'Migrasi dari Trello ke Flerro sangat smooth. Bahkan, fitur real-time collaboration-nya jauh lebih superior.',
      avatar: 'BS',
    },
  ];

  return (
    <div className="gradient-bg grid-pattern min-h-screen text-white">
      {/* Floating Orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      {/* Navbar */}
      <header className="navbar-blur fixed top-0 w-full z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50" />
              <img src="/favicon.png" alt="Flerro Logo" className="relative h-8 w-8" />
            </div>
            <span className="text-2xl font-bold gradient-text-glow">Flerro</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Fitur
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Cara Kerja
            </a>
            <a href="#testimonials" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Testimonial
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard" className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold text-white flex items-center gap-2">
                Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                  Masuk
                </Link>
                <Link href="/login" className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold text-white">
                  Mulai Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="min-h-screen flex flex-col justify-center pt-20 pb-10">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 feature-badge rounded-full px-4 py-2 my-4 mb-4">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-sm text-zinc-300">Platform Manajemen Project #1 di Indonesia</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                <span className="gradient-text">Kelola Project Tim</span>
                <br />
                <span className="gradient-text-primary">Dengan Cara yang Lebih Cerdas</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                Flerro adalah platform kolaborasi modern yang menggabungkan kekuatan
                <span className="text-white font-medium"> Kanban board</span>,<span className="text-white font-medium"> real-time sync</span>, dan
                <span className="text-white font-medium"> analytics</span> dalam satu tempat. Tingkatkan produktivitas tim hingga 40% dengan workflow yang terorganisir.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link href={session?.user ? '/dashboard' : '/login'} className="btn-primary rounded-full px-8 py-4 text-base font-semibold text-white flex items-center justify-center gap-2 group">
                  Mulai Sekarang — Gratis
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#features" className="btn-secondary rounded-full px-8 py-4 text-base font-semibold text-zinc-300 flex items-center justify-center gap-2">
                  Lihat Demo
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Setup dalam 30 detik</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Tidak perlu kartu kredit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Gratis selamanya untuk tim kecil</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-16">
              <a href="#features" className="scroll-indicator text-zinc-500 hover:text-white transition-colors">
                <ChevronDown className="h-8 w-8" />
              </a>
            </div>
          </div>
        </section>

        {/* Board Preview Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="board-preview max-w-5xl mx-auto">
              <div className="board-preview-inner glass-card rounded-2xl p-6 shine">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 text-center text-sm text-zinc-400">Flerro Board — Project Alpha</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* To Do Column */}
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-zinc-300">📋 To Do</span>
                      <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">3</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-zinc-900/80 rounded-lg p-3 border border-zinc-700/50">
                        <p className="text-sm text-zinc-300 mb-2">Desain UI Dashboard</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded">Design</span>
                          <div className="flex -space-x-1 ml-auto">
                            <div className="w-5 h-5 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center">A</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-900/80 rounded-lg p-3 border border-zinc-700/50">
                        <p className="text-sm text-zinc-300 mb-2">Setup Database Schema</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Backend</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* In Progress Column */}
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-zinc-300">🔄 In Progress</span>
                      <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">2</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-zinc-900/80 rounded-lg p-3 border border-indigo-500/30 ring-2 ring-indigo-500/20">
                        <p className="text-sm text-zinc-300 mb-2">API Integration</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Priority</span>
                          <div className="flex -space-x-1 ml-auto">
                            <div className="w-5 h-5 rounded-full bg-cyan-500 text-[10px] flex items-center justify-center">B</div>
                            <div className="w-5 h-5 rounded-full bg-rose-500 text-[10px] flex items-center justify-center">C</div>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-indigo-400 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />2 orang sedang mengedit...
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Done Column */}
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-zinc-300">✅ Done</span>
                      <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">5</span>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-zinc-900/80 rounded-lg p-3 border border-zinc-700/50 opacity-80">
                        <p className="text-sm text-zinc-400 line-through mb-2">Project Setup</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded">Completed</span>
                        </div>
                      </div>
                      <div className="bg-zinc-900/80 rounded-lg p-3 border border-zinc-700/50 opacity-80">
                        <p className="text-sm text-zinc-400 line-through mb-2">User Authentication</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold gradient-text-primary mb-2 stat-number">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Semua yang Tim Anda Butuhkan</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Fitur lengkap yang dirancang untuk meningkatkan produktivitas dan memudahkan kolaborasi tim dari mana saja.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="glass-card rounded-2xl p-8 transition-all duration-300 group">
                    <div className={`icon-wrapper inline-flex h-14 w-14 items-center justify-center rounded-xl mb-6`}>
                      <Icon className={`h-7 w-7 bg-gradient-to-r ${feature.color} bg-clip-text text-indigo-400`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text-primary transition-all">{feature.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Additional Features Tags */}
            <div className="mt-16 text-center">
              <p className="text-sm text-zinc-500 mb-6">Dan masih banyak lagi...</p>
              <div className="flex flex-wrap justify-center gap-3">
                {additionalFeatures.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-indigo-500/30 transition-all">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Mulai dalam 3 Langkah Mudah</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Setup cepat, tanpa kompleksitas. Tim Anda bisa langsung produktif dalam hitungan menit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: '01',
                  title: 'Buat Akun',
                  description: 'Daftar gratis dengan email atau akun Google. Tidak perlu kartu kredit.',
                },
                {
                  step: '02',
                  title: 'Buat Board',
                  description: 'Buat project board pertama Anda dan undang anggota tim untuk bergabung.',
                },
                {
                  step: '03',
                  title: 'Mulai Kolaborasi',
                  description: 'Tambahkan task, assign ke tim, dan pantau progress secara real-time.',
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="glass-card rounded-2xl p-8 text-center h-full">
                    <div className="text-6xl font-bold text-indigo-500/20 mb-4">{item.step}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-zinc-400">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-zinc-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Dipercaya oleh Tim Terbaik</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Ribuan tim sudah menggunakan Flerro untuk mengelola project mereka dengan lebih efisien.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card glass-card rounded-2xl p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-zinc-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="glass-card rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden shine">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  <span className="gradient-text">Siap Meningkatkan Produktivitas Tim?</span>
                </h2>
                <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10">Bergabung dengan ribuan tim yang sudah mengelola project mereka lebih efisien dengan Flerro.</p>
                <Link href={session?.user ? '/dashboard' : '/login'} className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white group">
                  Coba Flerro Gratis Sekarang
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="Flerro Logo" className="h-8 w-8" />
              <span className="text-lg font-bold gradient-text-glow">Flerro</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <a href="#features" className="hover:text-white transition-colors">
                Fitur
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                Cara Kerja
              </a>
              <a href="https://github.com/fdjmrs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Shield className="h-4 w-4" />
              <span>Secured with SSL</span>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-zinc-600">© 2025 Flerro. Crafted with ❤️ by fdjmrs. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
