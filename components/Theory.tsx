'use client';

import React from 'react';
import { BookOpen, Layers, ShieldAlert, Sparkles, Wind, ArrowUpRight } from 'lucide-react';

export default function Theory() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Intro Swiss Typography Hero */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Earth Science II • Core Concepts
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
          대기 안정도의 판정 원리와 공기의 연직 운동
        </h2>
        <p className="mt-3 text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
          대기 안정도(Atmospheric Stability)란 연직으로 변위된 공기 덩어리가 원래의 위치로 되돌아가려 하는지(안정),
          아니면 변위된 방향으로 더욱 가속하여 상승하려 하는지(불안정)를 나타내는 대기의 역학적 성질입니다.
        </p>
      </div>

      {/* 3대 핵심 기온 감률 비교 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          1. 대기 안정도를 결정하는 3가지 기온 감률
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[4px_4px_12px_rgba(0,0,0,0.03)] space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Γd = 1.0℃ / 100m</span>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100">건조 단열 감률 (DALR)</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              상대습도 100% 미만인 <strong>불포화 공기 덩어리</strong>가 외부와 열교환 없이 단열 팽창하며 냉각되는 비율입니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[4px_4px_12px_rgba(0,0,0,0.03)] space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Γm ≈ 0.5℃ / 100m</span>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100">습윤 단열 감률 (MALR)</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              포화된 공기가 상승할 때 수증기가 물방울로 응결하면서 <strong>응결 잠열(숨은열)</strong>을 방출하므로 냉각률이 완화됩니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[4px_4px_12px_rgba(0,0,0,0.03)] space-y-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">Γe (관측값)</span>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100">환경 기온 감률 (ELR)</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              실제 주변 정지 대기의 고도에 따른 기온 하강 비율입니다. 라디오존데 관측으로 측정되며 시간에 따라 수시로 변합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 3대 안정도 판정 매트릭스 표 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-500" />
          2. 대기 안정도 3대 판정 조건 종합 비교
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-bold text-neutral-600 dark:text-neutral-400">
                <th className="p-4">구분</th>
                <th className="p-4">감률 조건</th>
                <th className="p-4">불포화 공기 거동</th>
                <th className="p-4">포화 공기 거동</th>
                <th className="p-4">발생 기상 및 구름 형태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                <td className="p-4 font-bold text-blue-600 dark:text-blue-400">절대 안정</td>
                <td className="p-4 font-mono font-bold">Γe &lt; Γm</td>
                <td className="p-4">안정 (원위치 복귀)</td>
                <td className="p-4">안정 (원위치 복귀)</td>
                <td className="p-4 text-neutral-600 dark:text-neutral-300">연직 운동 억제, 층운형 구름, 안개, 역전층 스모그 축적</td>
              </tr>
              <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">조건부 불안정</td>
                <td className="p-4 font-mono font-bold">Γm ≤ Γe ≤ Γd</td>
                <td className="p-4">안정 (강제 상승 필요)</td>
                <td className="p-4 font-semibold text-rose-600 dark:text-rose-400">불안정 (자발적 가속 상승)</td>
                <td className="p-4 text-neutral-600 dark:text-neutral-300">지표 가열이나 지형에 의해 LFC 이상 상승 시 적란운 폭발적 발달</td>
              </tr>
              <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                <td className="p-4 font-bold text-rose-600 dark:text-rose-400">절대 불안정</td>
                <td className="p-4 font-mono font-bold">Γd &lt; Γe</td>
                <td className="p-4 font-semibold text-rose-600 dark:text-rose-400">불안정 (가속 상승)</td>
                <td className="p-4 font-semibold text-rose-600 dark:text-rose-400">불안정 (강한 가속 상승)</td>
                <td className="p-4 text-neutral-600 dark:text-neutral-300">극심한 대류, 강한 적운 및 적란운, 뇌우, 돌풍, 우박</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 상승 응결 고도 공식 및 역전층 특강 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[4px_4px_12px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              상승 응결 고도 (LCL) 계산 공식
            </h4>
          </div>
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-mono text-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
            h = 125 × (T₀ - T_d₀) [m]
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            건조 단열 감률(1.0℃/100m)과 이슬점 감률(0.2℃/100m)의 차이는 100m당 0.8℃입니다.
            따라서 1℃의 기온-이슬점 격차를 좁히기 위해서는 100 / 0.8 = <strong>125m</strong>의 고도 상승이 필요합니다.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[4px_4px_12px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              기온 역전층(Inversion)과 대기 오염
            </h4>
          </div>
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-mono text-center text-sm font-bold text-purple-600 dark:text-purple-400">
            Γe &lt; 0 (고도가 높을수록 기온 상승)
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            맑고 바람 없는 밤의 복사 냉각이나 온난 전선 통과, 고기압 중심의 공기 침강 시 발생합니다.
            극단적인 절대 안정 상태를 이루어 연직 혼합이 완전히 차단되므로 지표 부근에 스모그와 미세먼지가 극도로 고이게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
