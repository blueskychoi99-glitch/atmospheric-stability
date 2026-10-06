'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Layers,
  Award,
  Trophy,
  MessageSquare,
  Moon,
  Sun,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import Simulation from '@/components/Simulation';
import Theory from '@/components/Theory';
import Quiz from '@/components/Quiz';
import Rankings from '@/components/Rankings';
import Community from '@/components/Community';

type TabType = 'simulation' | 'theory' | 'quiz' | 'rankings' | 'community';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check system preference or default to light
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0d0f12] text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-white">
                  대기 안정도 판정 탐구활동
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800">
                  고등학교 지구과학 II
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono hidden md:block">
                Atmospheric Stability & Thermodynamic Diagram Inquiry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Seoul Region Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Seoul Region (icn1 + ap-northeast-2)
            </div>

            {/* Dark Mode Toggle (Neumorphic) */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all shadow-[2px_2px_6px_rgba(0,0,0,0.06),-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-none"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar (Swiss Pill Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-neutral-200/50 dark:bg-neutral-900 border border-neutral-300/40 dark:border-neutral-800 select-none no-scrollbar">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'simulation'
                ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-none'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            단열선도 시뮬레이션
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'theory'
                ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-none'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            안정도 판정 원리
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-none'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Award className="w-4 h-4" />
            실전 판정 챌린지
          </button>

          <button
            onClick={() => setActiveTab('rankings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'rankings'
                ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-none'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            명예의 전당 (랭킹)
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'community'
                ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-none'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            탐구 토론 커뮤니티
          </button>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulation' && <Simulation onQuizSuggest={() => setActiveTab('quiz')} />}
        {activeTab === 'theory' && <Theory />}
        {activeTab === 'quiz' && <Quiz onScoreSubmitted={() => setActiveTab('rankings')} />}
        {activeTab === 'rankings' && <Rankings />}
        {activeTab === 'community' && <Community />}
      </main>

      {/* Swiss Clean Minimalist Footer */}
      <footer className="mt-20 border-t border-neutral-200/80 dark:border-neutral-800 py-8 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">대기 안정도 판정 탐구활동</span>
            <span>•</span>
            <span>고등학교 2학년 지구과학 교육용 인터랙티브 웹앱</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-3 h-3" /> Vercel Serverless (icn1)
            </span>
            <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
              <ShieldCheck className="w-3 h-3" /> Supabase PostgreSQL (Seoul)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
