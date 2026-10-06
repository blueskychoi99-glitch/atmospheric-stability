'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Cloud, Sun, Wind, AlertCircle, Compass, Thermometer } from 'lucide-react';

interface SimulationProps {
  onQuizSuggest?: () => void;
}

export default function Simulation({ onQuizSuggest }: SimulationProps) {
  // Parameters
  const [t0, setT0] = useState<number>(24); // Surface Temp (°C)
  const [td0, setTd0] = useState<number>(16); // Surface Dewpoint (°C)
  const [elr, setElr] = useState<number>(0.75); // Environmental Lapse Rate (°C / 100m)

  // Ascent animation state
  const [isAscending, setIsAscending] = useState<boolean>(false);
  const [parcelHeight, setParcelHeight] = useState<number>(0); // 0 to 3000m
  const animRef = useRef<number | null>(null);

  // Constants
  const dalr = 1.0; // Dry Adiabatic Lapse Rate (°C / 100m)
  const malr = 0.5; // Moist Adiabatic Lapse Rate (°C / 100m)
  const dewLapse = 0.2; // Dewpoint Lapse Rate (°C / 100m)

  // Calculations
  // LCL = 125 * (T0 - Td0)
  const lcl = Math.max(0, Math.round(125 * Math.max(0, t0 - td0)));
  const tAtLcl = t0 - (dalr * (lcl / 100));

  // Stability determination
  let stabilityType: '절대안정' | '절대불안정' | '조건부불안정' = '조건부불안정';
  let stabilityDesc = '';
  let stabilityColor = 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400';

  if (elr < malr) {
    stabilityType = '절대안정';
    stabilityDesc = '환경 기온 감률(ELR)이 습윤 단열 감률(0.5℃/100m)보다 작습니다. 공기 덩어리가 불포화든 포화든 주변보다 차가워 항상 하강하여 원래 위치로 복귀합니다.';
    stabilityColor = 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400';
  } else if (elr > dalr) {
    stabilityType = '절대불안정';
    stabilityDesc = '환경 기온 감률(ELR)이 건조 단열 감률(1.0℃/100m)보다 큽니다. 공기 덩어리가 불포화든 포화든 주변보다 따뜻하여 강한 부력을 받아 스스로 폭발적으로 급상승합니다.';
    stabilityColor = 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400';
  } else {
    stabilityType = '조건부불안정';
    stabilityDesc = '환경 기온 감률이 습윤 단열 감률과 건조 단열 감률 사이(0.5 ~ 1.0℃/100m)에 있습니다. 불포화 상태에서는 안정하나, 포화(응결)된 후에는 주변보다 따뜻해져 자발적으로 불안정해집니다.';
    stabilityColor = 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400';
  }

  // Parcel temperature at altitude z
  const getParcelTemp = (z: number) => {
    if (z <= lcl) {
      return t0 - dalr * (z / 100);
    }
    return tAtLcl - malr * ((z - lcl) / 100);
  };

  // Environmental temperature at altitude z
  const getEnvTemp = (z: number) => {
    return t0 - elr * (z / 100);
  };

  // Dewpoint at altitude z
  const getDewpoint = (z: number) => {
    if (z <= lcl) {
      return td0 - dewLapse * (z / 100);
    }
    return getParcelTemp(z);
  };

  const currentParcelTemp = getParcelTemp(parcelHeight);
  const currentEnvTemp = getEnvTemp(parcelHeight);
  const tempDiff = currentParcelTemp - currentEnvTemp;
  const isSaturated = parcelHeight >= lcl && lcl > 0;

  // Animation loop
  useEffect(() => {
    if (isAscending) {
      const step = () => {
        setParcelHeight((prev) => {
          if (prev >= 3000) {
            setIsAscending(false);
            return 3000;
          }
          return Math.min(3000, prev + 15);
        });
        animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    } else if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isAscending]);

  const handleReset = () => {
    setIsAscending(false);
    setParcelHeight(0);
  };

  const applyPreset = (presetT0: number, presetTd0: number, presetElr: number) => {
    setT0(presetT0);
    setTd0(presetTd0);
    setElr(presetElr);
    handleReset();
  };

  // SVG Chart Coordinate Mapping
  // X: Temp (-15 to 40 °C) -> SVG width (40 to 560)
  // Y: Altitude (0 to 3000 m) -> SVG height (360 down to 40)
  const svgWidth = 600;
  const svgHeight = 400;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  const mapX = (temp: number) => {
    const minT = -15;
    const maxT = 40;
    const plotW = svgWidth - padding.left - padding.right;
    return padding.left + ((temp - minT) / (maxT - minT)) * plotW;
  };

  const mapY = (alt: number) => {
    const minA = 0;
    const maxA = 3000;
    const plotH = svgHeight - padding.top - padding.bottom;
    return svgHeight - padding.bottom - (alt / (maxA - minA)) * plotH;
  };

  // Generate path data for SVG
  const envPath = `M ${mapX(getEnvTemp(0))} ${mapY(0)} L ${mapX(getEnvTemp(3000))} ${mapY(3000)}`;

  let parcelPath = `M ${mapX(getParcelTemp(0))} ${mapY(0)}`;
  if (lcl < 3000) {
    parcelPath += ` L ${mapX(getParcelTemp(lcl))} ${mapY(lcl)} L ${mapX(getParcelTemp(3000))} ${mapY(3000)}`;
  } else {
    parcelPath += ` L ${mapX(getParcelTemp(3000))} ${mapY(3000)}`;
  }

  const dryRefPath = `M ${mapX(t0)} ${mapY(0)} L ${mapX(t0 - dalr * 30)} ${mapY(3000)}`;
  const moistRefPath = `M ${mapX(t0)} ${mapY(0)} L ${mapX(t0 - malr * 30)} ${mapY(3000)}`;

  return (
    <div className="space-y-8">
      {/* Overview Status Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[6px_6px_16px_rgba(0,0,0,0.04),-6px_-6px_16px_rgba(255,255,255,0.8)] dark:shadow-none transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${stabilityColor}`}>
              {stabilityType}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              대기 안정도 판정 진단 결과
            </h2>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
              ELR: {elr.toFixed(2)}℃/100m
            </span>
            <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
              LCL(응결고도): {lcl}m
            </span>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {stabilityDesc}
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          대표 기상 시나리오 프리셋 선택
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => applyPreset(20, 10, 0.35)}
            className="p-3 rounded-xl text-left bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 transition-all text-xs"
          >
            <div className="font-bold text-blue-600 dark:text-blue-400">1. 맑고 안정된 늦가을</div>
            <div className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">ELR 0.35℃ (절대안정)</div>
          </button>
          <button
            onClick={() => applyPreset(25, 17, 0.75)}
            className="p-3 rounded-xl text-left bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 transition-all text-xs"
          >
            <div className="font-bold text-emerald-600 dark:text-emerald-400">2. 적란운 발달 직전</div>
            <div className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">ELR 0.75℃ (조건부불안정)</div>
          </button>
          <button
            onClick={() => applyPreset(32, 22, 1.25)}
            className="p-3 rounded-xl text-left bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 transition-all text-xs"
          >
            <div className="font-bold text-rose-600 dark:text-rose-400">3. 폭염 후 소나기 발달</div>
            <div className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">ELR 1.25℃ (절대불안정)</div>
          </button>
          <button
            onClick={() => applyPreset(15, 12, -0.2)}
            className="p-3 rounded-xl text-left bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 transition-all text-xs"
          >
            <div className="font-bold text-purple-600 dark:text-purple-400">4. 새벽 침강 역전층</div>
            <div className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">ELR -0.2℃ (극도의 절대안정)</div>
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport: Controls + Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-5 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[6px_6px_16px_rgba(0,0,0,0.03)]">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-indigo-500" />
            대기 파라미터 미세 조정
          </h3>

          {/* T0 Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300">
              <span>지표 기온 (T₀)</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{t0} ℃</span>
            </div>
            <input
              type="range"
              min="10"
              max="38"
              step="1"
              value={t0}
              onChange={(e) => {
                const val = Number(e.target.value);
                setT0(val);
                if (td0 > val) setTd0(val);
                handleReset();
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Td0 Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300">
              <span>지표 이슬점 (Td₀)</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{td0} ℃</span>
            </div>
            <input
              type="range"
              min="0"
              max={t0}
              step="1"
              value={td0}
              onChange={(e) => {
                setTd0(Number(e.target.value));
                handleReset();
              }}
              className="w-full accent-cyan-600 cursor-pointer"
            />
          </div>

          {/* ELR Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300">
              <span>환경 기온 감률 (ELR, Γe)</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{elr.toFixed(2)} ℃/100m</span>
            </div>
            <input
              type="range"
              min="-0.4"
              max="1.5"
              step="0.05"
              value={elr}
              onChange={(e) => {
                setElr(Number(e.target.value));
                handleReset();
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>-0.4 (역전)</span>
              <span>0.5 (습윤)</span>
              <span>1.0 (건조)</span>
              <span>1.5 (초과)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
            <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
              <span>공기 덩어리 연직 상승 실험</span>
              <span className="text-[11px] font-mono text-neutral-500">{parcelHeight} m</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAscending(!isAscending)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  isAscending
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isAscending ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAscending ? '일시정지' : '상승 실험 시작'}
              </button>
              <button
                onClick={handleReset}
                className="py-2.5 px-3 rounded-xl font-medium text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all"
                title="초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Realtime readout card */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">공기 덩어리 기온:</span>
              <span className="font-mono font-bold text-rose-500">{currentParcelTemp.toFixed(1)} ℃</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">주변 대기 기온:</span>
              <span className="font-mono font-bold text-purple-500">{currentEnvTemp.toFixed(1)} ℃</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">기온차 (ΔT):</span>
              <span className={`font-mono font-bold ${tempDiff > 0 ? 'text-rose-500' : tempDiff < 0 ? 'text-blue-500' : 'text-neutral-500'}`}>
                {tempDiff > 0 ? `+${tempDiff.toFixed(1)}` : tempDiff.toFixed(1)} ℃
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-400">부력 상태:</span>
              <span className="font-bold">
                {tempDiff > 0.05
                  ? '🔺 양의 부력 (가속 상승)'
                  : tempDiff < -0.05
                  ? '🔻 음의 부력 (복원 하강)'
                  : '⚪ 중립 (정지)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">상태:</span>
              <span className="font-bold">
                {isSaturated ? '☁️ 포화 (응결 구름 형성)' : '☀️ 불포화 (건조 상태)'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Adiabatic Graph SVG Column */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[6px_6px_16px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                대기 단열선도 (Temperature-Height Diagram)
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                고도에 따른 기온 변화 곡선과 공기 덩어리 상승 궤적
              </p>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                <span className="w-2.5 h-0.5 bg-purple-600 inline-block"></span> 환경기온(ELR)
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                <span className="w-2.5 h-0.5 bg-rose-600 inline-block"></span> 공기덩어리
              </span>
              <span className="flex items-center gap-1 text-blue-500 font-semibold">
                <span className="w-2.5 h-0.5 border-t border-dashed border-blue-500 inline-block"></span> 건조단열선(DALR)
              </span>
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <span className="w-2.5 h-0.5 border-t border-dotted border-emerald-500 inline-block"></span> 습윤단열선(MALR)
              </span>
            </div>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none font-sans"
            >
              {/* Grid Lines */}
              {[-10, 0, 10, 20, 30].map((t) => (
                <g key={`x-grid-${t}`}>
                  <line
                    x1={mapX(t)}
                    y1={mapY(0)}
                    x2={mapX(t)}
                    y2={mapY(3000)}
                    stroke="currentColor"
                    className="text-neutral-200 dark:text-neutral-800"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={mapX(t)}
                    y={svgHeight - 15}
                    textAnchor="middle"
                    className="text-[10px] fill-neutral-400 font-mono"
                  >
                    {t}℃
                  </text>
                </g>
              ))}

              {[500, 1000, 1500, 2000, 2500, 3000].map((a) => (
                <g key={`y-grid-${a}`}>
                  <line
                    x1={mapX(-15)}
                    y1={mapY(a)}
                    x2={mapX(40)}
                    y2={mapY(a)}
                    stroke="currentColor"
                    className="text-neutral-200 dark:text-neutral-800"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padding.left - 8}
                    y={mapY(a) + 3}
                    textAnchor="end"
                    className="text-[10px] fill-neutral-400 font-mono"
                  >
                    {a}m
                  </text>
                </g>
              ))}

              {/* LCL Cloud Level Indicator */}
              {lcl > 0 && lcl <= 3000 && (
                <g>
                  <line
                    x1={padding.left}
                    y1={mapY(lcl)}
                    x2={svgWidth - padding.right}
                    y2={mapY(lcl)}
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <rect
                    x={padding.left + 5}
                    y={mapY(lcl) - 16}
                    width={110}
                    height={15}
                    rx={3}
                    fill="#0284c7"
                    fillOpacity="0.15"
                  />
                  <text
                    x={padding.left + 8}
                    y={mapY(lcl) - 5}
                    className="text-[10px] font-bold fill-sky-700 dark:fill-sky-400 font-mono"
                  >
                    ☁️ LCL: {lcl}m (구름 밑)
                  </text>
                </g>
              )}

              {/* Reference DALR and MALR lines */}
              <path
                d={dryRefPath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
              <path
                d={moistRefPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="2,3"
                opacity="0.6"
              />

              {/* Environmental Curve */}
              <path
                d={envPath}
                fill="none"
                stroke="#9333ea"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Parcel Path */}
              <path
                d={parcelPath}
                fill="none"
                stroke="#e11d48"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Current Animated Parcel Position Marker */}
              {parcelHeight > 0 && (
                <g>
                  {/* Pulse circle */}
                  <circle
                    cx={mapX(currentParcelTemp)}
                    cy={mapY(parcelHeight)}
                    r="8"
                    fill={tempDiff > 0 ? '#f43f5e' : '#3b82f6'}
                    fillOpacity="0.3"
                    className="animate-ping"
                  />
                  {/* Core bubble */}
                  <circle
                    cx={mapX(currentParcelTemp)}
                    cy={mapY(parcelHeight)}
                    r="6"
                    fill={tempDiff > 0 ? '#e11d48' : '#2563eb'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Current info badge */}
                  <g transform={`translate(${mapX(currentParcelTemp) + 10}, ${mapY(parcelHeight) - 8})`}>
                    <rect
                      x="0"
                      y="-12"
                      width="95"
                      height="20"
                      rx="4"
                      className="fill-neutral-900/90 dark:fill-neutral-100/90"
                    />
                    <text
                      x="6"
                      y="2"
                      className="text-[9px] font-bold fill-white dark:fill-neutral-900 font-mono"
                    >
                      {currentParcelTemp.toFixed(1)}℃ ({parcelHeight}m)
                    </text>
                  </g>
                </g>
              )}

              {/* Axis Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 2}
                textAnchor="middle"
                className="text-[11px] font-semibold fill-neutral-600 dark:fill-neutral-400"
              >
                기온 (Temperature, ℃)
              </text>
              <text
                x={12}
                y={svgHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, 12, ${svgHeight / 2})`}
                className="text-[11px] font-semibold fill-neutral-600 dark:fill-neutral-400"
              >
                고도 (Altitude, m)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block mb-0.5">건조 단열 감률 (DALR)</span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                포화되지 않은 공기가 상승할 때 팽창하며 100m당 1.0℃씩 기온이 감소합니다.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block mb-0.5">습윤 단열 감률 (MALR)</span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                응결 고도 이상에서는 수증기 응결 시 잠열(숨은열)이 방출되어 100m당 약 0.5℃만 감소합니다.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block mb-0.5">상승 응결 고도 (LCL)</span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                공기가 상승하며 냉각되어 이슬점과 일치하는 고도로, 구름 바닥 높이를 결정합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
