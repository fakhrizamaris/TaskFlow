// web/app/(dashboard)/board/[boardId]/_components/card-item.tsx
'use client';

import { Card } from '@prisma/client';
import { Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Circle, Clock, CheckCircle2, Loader2, X, AlertTriangle, Calendar, CalendarDays, AlertCircle } from 'lucide-react';
import { updateCardStatus } from '@/actions/update-card-status';
import { updateCardDeadline } from '@/actions/update-card-deadline';
import { deleteCard } from '@/actions/delete-card';
import { useRouter } from 'next/navigation';

// Define CardStatus type locally until Prisma regenerates
type CardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Extend Card type to include status and dueDate
type CardWithStatus = Card & {
  status?: CardStatus;
  dueDate?: Date | string | null;
};

interface CardItemProps {
  data: CardWithStatus;
  index: number;
}

const statusConfig: Record<
  CardStatus,
  {
    label: string;
    icon: typeof Circle;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  TODO: {
    label: 'To Do',
    icon: Circle,
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-500/20',
    borderColor: 'border-zinc-500/30',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: Clock,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
  },
  DONE: {
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
  },
};

// Helper function to check deadline status
const getDeadlineStatus = (dueDate: Date | string | null | undefined) => {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();

  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return { status: 'overdue', label: 'Terlambat', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
  } else if (diffHours < 3) {
    return { status: 'urgent', label: 'Segera!', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
  } else if (diffDays === 0) {
    return { status: 'today', label: `Hari ini ${formatTime(due)}`, color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/30' };
  } else if (diffDays === 1) {
    return { status: 'tomorrow', label: `Besok ${formatTime(due)}`, color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/30' };
  } else if (diffDays <= 3) {
    return { status: 'soon', label: `${diffDays} hari`, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
  } else {
    return { status: 'normal', label: formatDateTime(due), color: 'text-zinc-400', bgColor: 'bg-zinc-500/20', borderColor: 'border-zinc-500/30' };
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + formatTime(date);
};

const formatDateTimeForInput = (date: Date | string | null | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  // Format: YYYY-MM-DDTHH:MM
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getDefaultDateTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1, 0, 0, 0); // Round to next hour
  return formatDateTimeForInput(now);
};

// Helper to extract date part (YYYY-MM-DD)
const extractDatePart = (dateTime: string): string => {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to extract hour and minute
const extractTimeParts = (dateTime: string): { hour: string; minute: string } => {
  if (!dateTime) return { hour: '17', minute: '00' };
  const d = new Date(dateTime);
  if (isNaN(d.getTime())) return { hour: '17', minute: '00' };
  return {
    hour: String(d.getHours()).padStart(2, '0'),
    minute: String(d.getMinutes()).padStart(2, '0'),
  };
};

// Helper to combine date and time into ISO format
const combineDateTime = (date: string, hour: string, minute: string): string => {
  if (!date) return '';
  return `${date}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

// Generate hours array
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];

export const CardItem = ({ data, index }: CardItemProps) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isDeadlinePickerOpen, setIsDeadlinePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDeadline, setIsLoadingDeadline] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Separate date and time states
  const defaultDateTime = getDefaultDateTime();
  const [selectedDate, setSelectedDate] = useState<string>(data.dueDate ? extractDatePart(formatDateTimeForInput(data.dueDate)) : extractDatePart(defaultDateTime));
  const [selectedHour, setSelectedHour] = useState<string>(data.dueDate ? extractTimeParts(formatDateTimeForInput(data.dueDate)).hour : extractTimeParts(defaultDateTime).hour);
  const [selectedMinute, setSelectedMinute] = useState<string>(data.dueDate ? extractTimeParts(formatDateTimeForInput(data.dueDate)).minute : extractTimeParts(defaultDateTime).minute);

  const router = useRouter();

  const cardStatus: CardStatus = (data.status as CardStatus) || 'TODO';
  const currentStatus = statusConfig[cardStatus];
  const StatusIcon = currentStatus.icon;
  const deadlineStatus = getDeadlineStatus(data.dueDate);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data.dueDate) {
      const formatted = formatDateTimeForInput(data.dueDate);
      setSelectedDate(extractDatePart(formatted));
      const timeParts = extractTimeParts(formatted);
      setSelectedHour(timeParts.hour);
      setSelectedMinute(timeParts.minute);
    }
  }, [data.dueDate]);

  const handleStatusChange = async (newStatus: CardStatus) => {
    if (newStatus === cardStatus) {
      setIsStatusMenuOpen(false);
      return;
    }

    setIsLoading(true);
    setIsStatusMenuOpen(false);

    const result = await updateCardStatus(data.id, newStatus);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleDeadlineSave = async () => {
    if (!selectedDate) return;

    const combinedDateTime = combineDateTime(selectedDate, selectedHour, selectedMinute);
    if (!combinedDateTime) return;

    setIsLoadingDeadline(true);

    try {
      const result = await updateCardDeadline(data.id, combinedDateTime);

      if (result.error) {
        alert(result.error);
      } else {
        setIsDeadlinePickerOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating deadline:', error);
      alert('Gagal mengupdate deadline. Pastikan database sudah di-push.');
    }

    setIsLoadingDeadline(false);
  };

  const handleClearDeadline = async () => {
    setIsLoadingDeadline(true);

    try {
      const result = await updateCardDeadline(data.id, null);

      if (result.error) {
        alert(result.error);
      } else {
        const defaultDT = getDefaultDateTime();
        setSelectedDate(extractDatePart(defaultDT));
        const timeParts = extractTimeParts(defaultDT);
        setSelectedHour(timeParts.hour);
        setSelectedMinute(timeParts.minute);
        setIsDeadlinePickerOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Error clearing deadline:', error);
      alert('Gagal menghapus deadline. Pastikan database sudah di-push.');
    }

    setIsLoadingDeadline(false);
  };

  const setQuickDateTime = (daysFromNow: number, hour: number = 17, minute: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);
    const formatted = formatDateTimeForInput(date);
    setSelectedDate(extractDatePart(formatted));
    setSelectedHour(String(hour).padStart(2, '0'));
    setSelectedMinute(String(minute).padStart(2, '0'));
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteCard(data.id);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(false);
      router.refresh();
    }
  };

  // Deadline Picker Modal using Portal
  const DeadlinePickerModal =
    mounted && isDeadlinePickerOpen
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setIsDeadlinePickerOpen(false)}>
            {/* Glassmorphism backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-zinc-900/95 to-indigo-950/95 backdrop-blur-sm" />

            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              {/* Decorative gradient orb */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button onClick={() => setIsDeadlinePickerOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-xl transition-all">
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                  <CalendarDays className="h-7 w-7 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-zinc-100">Set Deadline</h3>
                  <p className="text-sm text-zinc-500">Pilih tanggal dan waktu</p>
                </div>
              </div>

              {/* Preview of selected date/time */}
              {selectedDate && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <p className="text-xs text-zinc-500 mb-1">Preview</p>
                  <p className="text-lg font-semibold text-zinc-100">
                    {new Date(`${selectedDate}T${selectedHour}:${selectedMinute}`).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    <span className="text-indigo-400">
                      {' '}
                      • {selectedHour}:{selectedMinute}
                    </span>
                  </p>
                </div>
              )}

              {/* Date & Time Inputs */}
              <div className="space-y-5">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Calendar className="h-4 w-4 inline-block mr-2 text-indigo-400" />
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 
                      focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all
                      [color-scheme:dark] hover:border-zinc-600"
                  />
                </div>

                {/* Time Input - Separate Hour/Minute */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Clock className="h-4 w-4 inline-block mr-2 text-indigo-400" />
                    Waktu
                  </label>
                  <div className="flex gap-3">
                    {/* Hour Selector */}
                    <div className="flex-1">
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 
                          focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all
                          appearance-none cursor-pointer hover:border-zinc-600"
                      >
                        {hours.map((h) => (
                          <option key={h} value={h} className="bg-zinc-800">
                            {h}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-zinc-500 mt-1 text-center">Jam</p>
                    </div>
                    <div className="flex items-center justify-center text-2xl text-zinc-500 font-light pb-5">:</div>
                    {/* Minute Selector */}
                    <div className="flex-1">
                      <select
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 
                          focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all
                          appearance-none cursor-pointer hover:border-zinc-600"
                      >
                        {minutes.map((m) => (
                          <option key={m} value={m} className="bg-zinc-800">
                            {m}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-zinc-500 mt-1 text-center">Menit</p>
                    </div>
                  </div>
                </div>

                {/* Quick options */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">⚡ Pilihan Cepat</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setQuickDateTime(0, new Date().getHours() + 2)}
                      className="group px-4 py-3 text-sm bg-zinc-800/50 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 text-zinc-300 rounded-xl border border-zinc-700/50 hover:border-indigo-500/30 transition-all text-left"
                    >
                      <div className="font-medium group-hover:text-indigo-300 transition-colors">Hari ini</div>
                      <div className="text-xs text-zinc-500 group-hover:text-zinc-400">+2 jam lagi</div>
                    </button>
                    <button
                      onClick={() => setQuickDateTime(1, 9)}
                      className="group px-4 py-3 text-sm bg-zinc-800/50 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 text-zinc-300 rounded-xl border border-zinc-700/50 hover:border-indigo-500/30 transition-all text-left"
                    >
                      <div className="font-medium group-hover:text-indigo-300 transition-colors">Besok pagi</div>
                      <div className="text-xs text-zinc-500 group-hover:text-zinc-400">09:00</div>
                    </button>
                    <button
                      onClick={() => setQuickDateTime(1, 17)}
                      className="group px-4 py-3 text-sm bg-zinc-800/50 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 text-zinc-300 rounded-xl border border-zinc-700/50 hover:border-indigo-500/30 transition-all text-left"
                    >
                      <div className="font-medium group-hover:text-indigo-300 transition-colors">Besok sore</div>
                      <div className="text-xs text-zinc-500 group-hover:text-zinc-400">17:00</div>
                    </button>
                    <button
                      onClick={() => setQuickDateTime(7, 17)}
                      className="group px-4 py-3 text-sm bg-zinc-800/50 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 text-zinc-300 rounded-xl border border-zinc-700/50 hover:border-indigo-500/30 transition-all text-left"
                    >
                      <div className="font-medium group-hover:text-indigo-300 transition-colors">Minggu depan</div>
                      <div className="text-xs text-zinc-500 group-hover:text-zinc-400">17:00</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {data.dueDate && (
                  <button
                    onClick={handleClearDeadline}
                    disabled={isLoadingDeadline}
                    className="flex-1 px-4 py-3.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                )}
                <button
                  onClick={handleDeadlineSave}
                  disabled={isLoadingDeadline || !selectedDate}
                  className="flex-1 px-4 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                >
                  {isLoadingDeadline ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  // Delete Confirmation Modal using Portal
  const DeleteModal =
    mounted && showDeleteConfirm
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
            <div className="absolute inset-0 bg-black/90" />

            <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowDeleteConfirm(false)} className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all">
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>

                <h3 className="text-xl font-bold text-zinc-100 mb-2">Hapus Card?</h3>

                <p className="text-sm text-zinc-400 mb-6">
                  Card <span className="font-semibold text-zinc-200">"{data.title}"</span> akan dihapus secara permanen.
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-3 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all">
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <Draggable draggableId={data.id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`
              relative group border border-zinc-700/50 py-3 px-4 text-sm 
              bg-zinc-900/80 rounded-xl shadow-sm cursor-grab active:cursor-grabbing
              hover:border-indigo-500/50 hover:shadow-md transition-all duration-200
              ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-indigo-500/50 bg-zinc-800' : ''}
              ${cardStatus === 'DONE' ? 'opacity-70' : ''}
              ${deadlineStatus?.status === 'overdue' && cardStatus !== 'DONE' ? 'border-red-500/50' : ''}
              ${deadlineStatus?.status === 'urgent' && cardStatus !== 'DONE' ? 'border-red-500/50' : ''}
            `}
          >
            {/* Overdue/Urgent indicator */}
            {(deadlineStatus?.status === 'overdue' || deadlineStatus?.status === 'urgent') && cardStatus !== 'DONE' && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />}

            {/* Card Content */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <p className={`text-zinc-200 font-medium ${cardStatus === 'DONE' ? 'line-through text-zinc-500' : ''}`}>{data.title}</p>

                {/* Actions Row */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsStatusMenuOpen(!isStatusMenuOpen);
                    }}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all
                      ${currentStatus.bgColor} ${currentStatus.borderColor} border ${currentStatus.color}
                      hover:opacity-80 disabled:opacity-50
                    `}
                  >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <StatusIcon className="h-3 w-3" />}
                    {currentStatus.label}
                  </button>

                  {/* Deadline Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeadlinePickerOpen(true);
                    }}
                    disabled={isLoadingDeadline}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all border
                      ${deadlineStatus ? `${deadlineStatus.bgColor} ${deadlineStatus.borderColor} ${deadlineStatus.color}` : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'}
                      ${isLoadingDeadline ? 'opacity-50' : ''}
                    `}
                  >
                    {isLoadingDeadline ? <Loader2 className="h-3 w-3 animate-spin" /> : deadlineStatus?.status === 'overdue' || deadlineStatus?.status === 'urgent' ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {deadlineStatus ? deadlineStatus.label : 'Deadline'}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium 
                      bg-red-500/10 border border-red-500/20 text-red-400
                      hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                    title="Hapus card"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Status Menu Dropdown */}
            {isStatusMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsStatusMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-1 z-50 w-44 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                  <div className="p-1">
                    <p className="px-3 py-1.5 text-xs font-medium text-zinc-500">Ubah Status</p>
                    {(Object.keys(statusConfig) as CardStatus[]).map((status) => {
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      const isActive = cardStatus === status;

                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all
                            ${isActive ? 'bg-zinc-700' : 'hover:bg-zinc-700/50'}
                          `}
                        >
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <span className={isActive ? 'text-white font-medium' : 'text-zinc-300'}>{config.label}</span>
                          {isActive && <CheckCircle2 className="h-3 w-3 ml-auto text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Draggable>

      {DeadlinePickerModal}
      {DeleteModal}
    </>
  );
};
