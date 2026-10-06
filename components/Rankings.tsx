'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Medal } from 'lucide-react';
import { Ranking } from '@/lib/supabase';

export default function Rankings() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [source, setSource] = useState<string>('');

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rankings');
      const json = await res.json();
      if (json.success && json.data) {
        setRankings(json.data);
        setSource(json.source || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            대기 안정도 판정 명예의 전당
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            실시간 챌린지 퀴즈 최고 득점자 랭킹 (Supabase 서울 리전 동기화)
          </p>
        </div>
        <button
          onClick={fetchRankings}
          disabled={loading}
          className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-all text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-[6px_6px_16px_rgba(0,0,0,0.03)]">
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rankings.map((rank, idx) => {
            const isTop3 = idx < 3;
            const rankBadgeColor =
              idx === 0
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300'
                : idx === 1
                ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300'
                : idx === 2
                ? 'bg-amber-700/10 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-700/20'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200';

            return (
              <div
                key={rank.id || idx}
                className={`p-4 flex items-center justify-between transition-colors ${
                  idx === 0 ? 'bg-amber-50/30 dark:bg-amber-950/10' : 'hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border ${rankBadgeColor}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      {rank.nickname}
                      {isTop3 && <Medal className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {rank.played_at ? new Date(rank.played_at).toLocaleDateString('ko-KR') : '방금 전'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                    {rank.score}점
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {rankings.length === 0 && !loading && (
          <div className="p-8 text-center text-xs text-neutral-400">
            아직 등록된 랭킹 기록이 없습니다. 먼저 퀴즈에 도전해 보세요!
          </div>
        )}
      </div>

      {source && (
        <div className="text-center text-[10px] text-neutral-400 font-mono">
          데이터베이스 상태: {source === 'supabase-seoul' ? '⚡ Supabase 서울(ap-northeast-2) 실시간 연동' : '📦 인메모리 / 로컬 캐시 활성화'}
        </div>
      )}
    </div>
  );
}
