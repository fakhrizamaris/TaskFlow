// web/lib/email-templates.ts

// Base styles for email templates
const baseStyles = `
  body { 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    margin: 0; 
    padding: 0; 
    background-color: #0a0a0a; 
    color: #ffffff;
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    padding: 40px 20px; 
  }
  .card {
    background: linear-gradient(135deg, #18181b 0%, #1f1f23 100%);
    border-radius: 24px;
    padding: 40px;
    border: 1px solid #27272a;
  }
  .header {
    text-align: center;
    margin-bottom: 32px;
  }
  .logo {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .content {
    color: #d4d4d8;
    line-height: 1.7;
    font-size: 16px;
  }
  .highlight-box {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    padding: 24px;
    margin: 24px 0;
    text-align: center;
  }
  .button {
    display: inline-block;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #ffffff !important;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    margin-top: 24px;
  }
  .footer {
    text-align: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #27272a;
    color: #71717a;
    font-size: 14px;
  }
  .urgent-badge {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 16px;
  }
  .deadline-card {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
  }
  .deadline-time {
    font-size: 24px;
    font-weight: 700;
    color: #f87171;
  }
`;

export function getWelcomeEmailTemplate(name: string): string {
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Selamat Datang di Frello!</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="logo">🚀 Frello</div>
            <p style="color: #71717a; margin-top: 8px;">Task Management Made Simple</p>
          </div>
          
          <div class="content">
            <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 16px;">
              Halo ${name}! 👋
            </h1>
            
            <p>
              Selamat datang di <strong style="color: #a78bfa;">Frello</strong>! 
              Kami sangat senang Anda bergabung dengan kami.
            </p>
            
            <div class="highlight-box">
              <p style="margin: 0; color: #a78bfa; font-size: 18px; font-weight: 600;">
                ✨ Akun Anda Berhasil Dibuat!
              </p>
              <p style="margin: 8px 0 0 0; color: #d4d4d8;">
                Mulai kelola tugas dan proyek Anda dengan lebih efisien.
              </p>
            </div>
            
            <p>Dengan Frello, Anda bisa:</p>
            <ul style="color: #d4d4d8; padding-left: 20px;">
              <li>📋 Membuat board untuk mengatur proyek</li>
              <li>✅ Menambahkan task dengan status tracking</li>
              <li>⏰ Mengatur deadline dan reminder</li>
              <li>👥 Kolaborasi dengan tim</li>
              <li>🎯 Drag & drop untuk mengelola task</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${appUrl}/dashboard" class="button">
                🎯 Mulai Sekarang
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Butuh bantuan? Balas email ini kapan saja.</p>
            <p style="margin-top: 16px;">
              Made with 💜 by Frello Team
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getWelcomeEmailText(name: string): string {
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `
Halo ${name}! 👋

Selamat datang di Frello!
Akun Anda berhasil dibuat. Mulai kelola tugas dan proyek Anda dengan lebih efisien.

Dengan Frello, Anda bisa:
- Membuat board untuk mengatur proyek
- Menambahkan task dengan status tracking
- Mengatur deadline dan reminder
- Kolaborasi dengan tim
- Drag & drop untuk mengelola task

Mulai sekarang: ${appUrl}/dashboard

Butuh bantuan? Balas email ini kapan saja.

Made with 💜 by Frello Team
  `;
}

interface DeadlineTask {
  cardTitle: string;
  boardTitle: string;
  dueDate: Date;
  timeRemaining: string;
  isOverdue: boolean;
}

export function getDeadlineReminderTemplate(name: string, tasks: DeadlineTask[]): string {
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const taskCards = tasks
    .map(
      (task) => `
    <div class="deadline-card" style="
      background: ${task.isOverdue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 191, 36, 0.1)'};
      border: 1px solid ${task.isOverdue ? 'rgba(239, 68, 68, 0.4)' : 'rgba(251, 191, 36, 0.3)'};
    ">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <p style="margin: 0; font-weight: 600; color: #ffffff; font-size: 16px;">
            ${task.cardTitle}
          </p>
          <p style="margin: 4px 0 0 0; color: #71717a; font-size: 14px;">
            📁 ${task.boardTitle}
          </p>
        </div>
        <div style="text-align: right;">
          <span class="deadline-time" style="color: ${task.isOverdue ? '#f87171' : '#fbbf24'};">
            ${task.timeRemaining}
          </span>
          <p style="margin: 4px 0 0 0; color: #71717a; font-size: 12px;">
            ${task.dueDate.toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  const hasOverdue = tasks.some((t) => t.isOverdue);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deadline Reminder - Frello</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="logo">⏰ Frello</div>
            ${hasOverdue ? '<span class="urgent-badge">⚠️ ADA TASK TERLAMBAT</span>' : '<span style="color: #fbbf24;">Deadline Reminder</span>'}
          </div>
          
          <div class="content">
            <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">
              Halo ${name}! 
            </h1>
            
            <p>
              ${hasOverdue ? 'Ada beberapa task yang memerlukan perhatian segera:' : 'Berikut task dengan deadline yang mendekat:'}
            </p>
            
            <div style="margin: 24px 0;">
              ${taskCards}
            </div>
            
            <div style="text-align: center;">
              <a href="${appUrl}/dashboard" class="button">
                📋 Lihat Board Saya
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Anda menerima email ini karena memiliki task dengan deadline mendekati.</p>
            <p style="margin-top: 16px;">
              Made with 💜 by Frello Team
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getDeadlineReminderText(name: string, tasks: DeadlineTask[]): string {
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const taskList = tasks
    .map(
      (task) =>
        `- ${task.cardTitle} (${task.boardTitle}) - ${task.timeRemaining} - ${task.dueDate.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}`
    )
    .join('\n');

  return `
Halo ${name}!

Berikut task dengan deadline yang mendekat:

${taskList}

Lihat detail: ${appUrl}/dashboard

---
Frello - Task Management Made Simple
  `;
}
