// web/components/dashboard/stats-overview.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle2, Clock, Users, ArrowUp, BarChart3 } from 'lucide-react';

type StatsOverviewProps = {
  totalBoards: number;
  completedTasks?: number;
  pendingTasks?: number;
  collaborators?: number;
};

export const StatsOverview = ({ totalBoards, completedTasks = 0, pendingTasks = 0, collaborators = 0 }: StatsOverviewProps) => {
  const [animatedValues, setAnimatedValues] = useState({
    boards: 0,
    completed: 0,
    pending: 0,
    collaborators: 0,
  });

  // Animate numbers on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        boards: Math.round(totalBoards * easeOut),
        completed: Math.round(completedTasks * easeOut),
        pending: Math.round(pendingTasks * easeOut),
        collaborators: Math.round(collaborators * easeOut),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalBoards, completedTasks, pendingTasks, collaborators]);

  const stats = [
    {
      label: 'Total Board',
      value: animatedValues.boards,
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      change: '+2 minggu ini',
      changePositive: true,
    },
    {
      label: 'Tugas Selesai',
      value: animatedValues.completed,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      change: '+5 hari ini',
      changePositive: true,
    },
    {
      label: 'Tugas Pending',
      value: animatedValues.pending,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      change: '-3 dari kemarin',
      changePositive: true,
    },
    {
      label: 'Kolaborator',
      value: animatedValues.collaborators,
      icon: Users,
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      change: '+1 baru',
      changePositive: true,
    },
  ];

  return (
    <div id="stats-overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={stat.label} className={`glass-card rounded-xl p-4 border ${stat.borderColor} hover:scale-105 transition-all duration-300 group cursor-default`} style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <ArrowUp className="h-3 w-3" />
              <TrendingUp className="h-3 w-3" />
            </div>
          </div>

          <div className="space-y-1">
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
            <p className="text-sm text-zinc-400">{stat.label}</p>
            <p className="text-xs text-zinc-500">{stat.change}</p>
          </div>

          {/* Progress bar decoration */}
          <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min((stat.value / (stat.value + 10)) * 100, 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};
