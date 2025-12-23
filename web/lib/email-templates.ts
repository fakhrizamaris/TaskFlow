// web/lib/email-templates.ts

// Modern, theme-adaptive email templates
// Compact HTML to prevent Gmail clipping

export function getWelcomeEmailTemplate(name: string): string {
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Selamat Datang di Flerro!</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #27272a;
        background-color: #fff;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #18181b !important;
          color: #e4e4e7 !important;
        }
        .content-text {
          color: #a1a1aa !important;
        }
        .heading {
          color: #fafafa !important;
        }
        .subtext {
          color: #71717a !important;
        }
        .feature-item {
          background-color: #27272a !important;
          border-color: #3f3f46 !important;
        }
        .divider {
          border-color: #3f3f46 !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 40px 24px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto">
            <tr>
              <td style="padding-bottom: 24px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 20px 24px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="vertical-align: middle; width: 44px"><div style="font-size: 28px">🚀</div></td>
                          <td style="vertical-align: middle; padding-left: 14px">
                            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #fff">Selamat Datang di Flerro!</p>
                            <p style="margin: 2px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.9)">Perjalanan produktivitas Anda dimulai</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <h2 class="heading" style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #18181b">Halo ${name} 👋</h2>
                <p class="content-text" style="margin: 0 0 28px 0; font-size: 16px; line-height: 1.7; color: #52525b">
                  Kami sangat senang Anda bergabung dengan <strong style="color: #6366f1">Flerro</strong>. Siap untuk mengubah cara Anda mengelola tugas dan meningkatkan produktivitas tim?
                </p>
              </td>
            </tr>
            <tr>
              <td><div class="divider" style="border-top: 1px solid #e4e4e7; margin: 0 0 28px 0"></div></td>
            </tr>
            <tr>
              <td><h3 class="heading" style="margin: 0 0 20px 0; font-size: 13px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 1px">Yang Bisa Anda Lakukan</h3></td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50%" style="padding-right: 10px; padding-bottom: 14px; vertical-align: top">
                      <div class="feature-item" style="padding: 16px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px">
                        <div style="font-size: 20px; margin-bottom: 10px">📋</div>
                        <p class="heading" style="margin: 0; font-size: 14px; font-weight: 600; color: #18181b">Buat Board</p>
                        <p class="subtext" style="margin: 3px 0 0 0; font-size: 12px; color: #71717a">Organisasi proyek dengan mudah</p>
                      </div>
                    </td>
                    <td width="50%" style="padding-left: 10px; padding-bottom: 14px; vertical-align: top">
                      <div class="feature-item" style="padding: 16px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px">
                        <div style="font-size: 20px; margin-bottom: 10px">✅</div>
                        <p class="heading" style="margin: 0; font-size: 14px; font-weight: 600; color: #18181b">Track Status</p>
                        <p class="subtext" style="margin: 3px 0 0 0; font-size: 12px; color: #71717a">Monitor progress real-time</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%" style="padding-right: 10px; padding-bottom: 14px; vertical-align: top">
                      <div class="feature-item" style="padding: 16px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px">
                        <div style="font-size: 20px; margin-bottom: 10px">⏰</div>
                        <p class="heading" style="margin: 0; font-size: 14px; font-weight: 600; color: #18181b">Set Deadline</p>
                        <p class="subtext" style="margin: 3px 0 0 0; font-size: 12px; color: #71717a">Reminder otomatis via email</p>
                      </div>
                    </td>
                    <td width="50%" style="padding-left: 10px; padding-bottom: 14px; vertical-align: top">
                      <div class="feature-item" style="padding: 16px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 10px">
                        <div style="font-size: 20px; margin-bottom: 10px">👥</div>
                        <p class="heading" style="margin: 0; font-size: 14px; font-weight: 600; color: #18181b">Kolaborasi</p>
                        <p class="subtext" style="margin: 3px 0 0 0; font-size: 12px; color: #71717a">Undang tim ke board Anda</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 24px; text-align: center">
                <a
                  href="${appUrl}/dashboard"
                  style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #fff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px"
                  >Buka Dashboard →</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 32px 24px; text-align: center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto">
            <tr>
              <td>
                <div class="divider" style="border-top: 1px solid #e4e4e7; margin-bottom: 24px"></div>
                <p class="subtext" style="margin: 0 0 6px 0; font-size: 12px; color: #71717a">Ada pertanyaan? Langsung balas email ini.</p>
                <p style="margin: 0; font-size: 12px; color: #a1a1aa">© ${year} Flerro · Task Management Made Simple</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function getWelcomeEmailText(name: string): string {
  const appUrl = process.env.AUTH_URL || 'http://localhost:3000';
  const year = new Date().getFullYear();
  return `SELAMAT DATANG DI FRELLO!
========================

Halo ${name} 👋

Kami sangat senang Anda bergabung dengan Flerro.
Siap untuk mengubah cara Anda mengelola tugas?

YANG BISA ANDA LAKUKAN:
- 📋 Buat Board - Organisasi proyek dengan mudah
- ✅ Track Status - Monitor progress real-time
- ⏰ Set Deadline - Reminder otomatis via email
- 👥 Kolaborasi - Undang tim ke board Anda

Buka Dashboard: ${appUrl}/dashboard

---
Ada pertanyaan? Langsung balas email ini.
© ${year} Flerro · Task Management Made Simple`;
}

interface DeadlineTask {
  cardTitle: string;
  listTitle: string;
  boardTitle: string;
  dueDate: Date;
  timeRemaining: string;
  isOverdue: boolean;
}

export function getDeadlineReminderTemplate(name: string, tasks: DeadlineTask[]): string {
  const appUrl = process.env.AUTH_URL || 'http://localhost:3000';
  const year = new Date().getFullYear();
  const hasOverdue = tasks.some((t) => t.isOverdue);
  // Darker gradients for better readability in light mode
  const headerGradient = hasOverdue ? 'linear-gradient(135deg,#b91c1c 0%,#dc2626 100%)' : 'linear-gradient(135deg,#7c3aed 0%,#8b5cf6 100%)';

  const taskCount = hasOverdue ? `${tasks.filter((t) => t.isOverdue).length} task perlu tindakan segera` : `${tasks.length} task dengan deadline mendekat`;

  // Helper function to generate Google Calendar URL
  const getCalendarUrl = (task: DeadlineTask) => {
    const title = encodeURIComponent(`[Flerro] ${task.cardTitle}`);
    const details = encodeURIComponent(`Board: ${task.boardTitle}\\nList: ${task.listTitle}\\nKartu: ${task.cardTitle}`);
    const startDate = task.dueDate;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const formatDate = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
  };

  const taskRows = tasks
    .map((task) => {
      const dateStr = task.dueDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const badgeBg = task.isOverdue ? '#fef2f2' : '#f0fdf4';
      const badgeColor = task.isOverdue ? '#dc2626' : '#16a34a';
      const calendarUrl = getCalendarUrl(task);

      return `<tr><td style="padding:16px;background-color:#fafafa;border-radius:12px;margin-bottom:12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td colspan="2" style="padding-bottom:12px"><span style="display:inline-block;padding:5px 12px;background-color:${badgeBg};color:${badgeColor};font-size:12px;font-weight:700;border-radius:16px">${task.timeRemaining}</span></td></tr><tr><td style="vertical-align:top"><p style="margin:0 0 4px 0;font-size:11px;color:#71717a">📁 Board: <strong style="color:#52525b">${task.boardTitle}</strong></p><p style="margin:0 0 4px 0;font-size:11px;color:#71717a">📋 List: <strong style="color:#52525b">${task.listTitle}</strong></p><p style="margin:0 0 8px 0;font-size:11px;color:#71717a">🎯 Kartu:</p><p class="heading" style="margin:0;font-size:15px;font-weight:600;color:#18181b">${task.cardTitle}</p></td><td style="text-align:right;vertical-align:top;width:130px"><p style="margin:0 0 4px 0;font-size:11px;color:#71717a">⏰ Deadline</p><p class="subtext" style="margin:0 0 12px 0;font-size:12px;color:#52525b;line-height:1.4">${dateStr}</p><a href="${calendarUrl}" target="_blank" style="display:inline-block;padding:6px 10px;background-color:#4285f4;color:#fff;font-size:10px;font-weight:600;border-radius:6px;text-decoration:none">Tambah ke Calendar</a></td></tr></table></td></tr><tr><td style="height:10px"></td></tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Deadline Reminder - Flerro</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #18181b !important;
        }
        .heading {
          color: #fafafa !important;
        }
        .content-text {
          color: #a1a1aa !important;
        }
        .subtext {
          color: #71717a !important;
        }
        .divider {
          border-color: #3f3f46 !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 40px 24px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto">
            <tr>
              <td style="padding-bottom: 24px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:16px 20px;background:${headerGradient};">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="vertical-align: middle; width: 40px"><div style="font-size: 24px">${hasOverdue ? '⚠️' : '⏰'}</div></td>
                          <td style="vertical-align: middle; padding-left: 12px">
                            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #fff">${hasOverdue ? 'Deadline Terlewati' : 'Deadline Reminder'}</p>
                            <p style="margin: 2px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.9)">${taskCount}</p>
                          </td>
                          <td style="vertical-align: middle; text-align: right"><span style="font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.85)">Flerro</span></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <p class="content-text" style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #52525b">
                  Halo <strong class="heading" style="color: #18181b">${name}</strong>, berikut ringkasan task yang perlu Anda perhatikan:
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${taskRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 28px; text-align: center">
                <a
                  href="${appUrl}/dashboard"
                  style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #fff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px"
                  >Buka Dashboard →</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 32px 24px; text-align: center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto">
            <tr>
              <td>
                <div class="divider" style="border-top: 1px solid #e4e4e7; margin-bottom: 24px"></div>
                <p class="subtext" style="margin: 0 0 6px 0; font-size: 12px; color: #71717a">Email ini dikirim karena Anda memiliki task dengan deadline mendekati.</p>
                <p style="margin: 0; font-size: 12px; color: #a1a1aa">© ${year} Flerro · Task Management Made Simple</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function getDeadlineReminderText(name: string, tasks: DeadlineTask[]): string {
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const year = new Date().getFullYear();
  const hasOverdue = tasks.some((t) => t.isOverdue);

  const taskList = tasks
    .map((task) => {
      const dateStr = task.dueDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${task.isOverdue ? '⚠️' : '📌'} ${task.cardTitle}
   📁 Board: ${task.boardTitle}
   📋 List: ${task.listTitle}
   ⏰ Deadline: ${dateStr}
   🕐 Sisa Waktu: ${task.timeRemaining}`;
    })
    .join('\n\n');

  return `${hasOverdue ? '⚠️ PERHATIAN!' : '⏰ REMINDER'}
${'='.repeat(40)}

Halo ${name},

${hasOverdue ? `${tasks.filter((t) => t.isOverdue).length} task memerlukan tindakan segera:` : `${tasks.length} task dengan deadline mendekat:`}

${taskList}

---
Buka Dashboard: ${appUrl}/dashboard

© ${year} Flerro · Task Management Made Simple`;
}
