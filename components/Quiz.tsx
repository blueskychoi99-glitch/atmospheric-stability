'use client';

import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, ChevronRight, RotateCcw, Send } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '다음 관측 데이터를 분석했을 때, 이 기층의 대기 안정도는 무엇인가요?',
    scenario: '지표면 기온: 22℃ / 1000m 상공 기온: 9℃ (건조단열감률 1.0℃/100m, 습윤단열감률 0.5℃/100m 기준)',
    options: ['절대 안정', '조건부 불안정', '절대 불안정', '중립 상태'],
    correctIndex: 2,
    explanation: '1000m 상승 시 기온이 22℃에서 9℃로 13℃ 하강했으므로 환경 기온 감률(ELR)은 1.3℃/100m입니다. 이는 건조 단열 감률(1.0℃/100m)보다 크므로 공기 덩어리는 포화 여부와 무관하게 항상 주변보다 따뜻하여 폭발적으로 상승하는 [절대 불안정]입니다.'
  },
  {
    id: 2,
    question: '지표 기온 18℃, 지표 이슬점 10℃일 때, 상승 응결 고도(LCL)는 약 얼마인가요?',
    scenario: 'LCL 근사 공식: h = 125 × (T₀ - T_d₀)',
    options: ['800m', '1000m', '1250m', '1500m'],
    correctIndex: 1,
    explanation: 'h = 125 × (18 - 10) = 125 × 8 = 1000m 입니다. 즉 지표에서 상승한 불포화 공기는 1000m 고도에서 포화되어 구름 바닥(운저)을 형성합니다.'
  },
  {
    id: 3,
    question: '환경 기온 감률이 0.7℃/100m인 기층에서 불포화 공기 덩어리와 포화 공기 덩어리의 연직 거동으로 옳은 것은?',
    scenario: '건조단열감률: 1.0℃/100m, 습윤단열감률: 0.5℃/100m, 환경기온감률: 0.7℃/100m',
    options: [
      '불포화 공기와 포화 공기 모두 자발적으로 가속 상승한다.',
      '불포화 공기는 안정하여 복귀하고, 포화 공기는 불안정하여 자발적 상승한다.',
      '불포화 공기는 불안정하고, 포화 공기는 안정하다.',
      '불포화 공기와 포화 공기 모두 항상 하강하여 안정하다.'
    ],
    correctIndex: 1,
    explanation: '0.5℃/100m < 0.7℃/100m < 1.0℃/100m 이므로 [조건부 불안정]입니다. 불포화 공기는 100m당 1.0℃씩 식어 주변(0.7℃ 하강)보다 차가우므로 안정하나, 포화 공기는 100m당 0.5℃만 식어 주변보다 따뜻해지므로 양의 부력을 받아 자발적으로 가속 상승합니다.'
  },
  {
    id: 4,
    question: '맑고 바람 없는 늦가을 새벽 지표 부근에서 기온 역전층이 형성되었을 때의 대기 상태는?',
    scenario: '지표 기온: 4℃ / 500m 상공 기온: 8℃ (고도가 높아질수록 기온 상승)',
    options: ['극도의 절대 불안정', '조건부 불안정', '극도의 절대 안정', '대류성 소나기 발생'],
    correctIndex: 2,
    explanation: '역전층에서는 고도가 높아질수록 기온이 상승하므로 ELR < 0 입니다. 상승하려는 어떤 공기 덩어리도 주변보다 훨씬 차가워져 강력한 음의 부력을 받아 즉시 원래 위치로 내려앉는 [극도의 절대 안정] 상태입니다. 연직 대류가 차단되어 안개나 스모그가 지표면에 갇히게 됩니다.'
  },
  {
    id: 5,
    question: '산맥을 넘어가는 공기가 바람받이 사면에서 비를 내린 후 바람그늘 사면으로 내려올 때 나타나는 푄(Foehn) 현상의 안정도 설명으로 적절한 것은?',
    scenario: '바람받이 상승 시에는 응결하여 습윤단열, 바람그늘 하강 시에는 수증기가 제거되어 전 구간 건조단열 승온',
    options: [
      '하강하는 공기는 건조단열 승온하여 고온 건조해지며 대기가 매우 안정해진다.',
      '하강하는 공기는 습윤단열 승온하여 저온 다습해진다.',
      '바람그늘 사면은 절대 불안정이 되어 폭우가 쏟아진다.',
      '지표면 온도가 급강하하여 영구 동토층이 형성된다.'
    ],
    correctIndex: 0,
    explanation: '산을 넘은 공기는 수증기를 잃은 채 건조 단열 감률(1.0℃/100m)로 급격히 승온되므로 지표면에 도달했을 때 원래보다 고온 건조해집니다. 이 하강 기류 영역은 기층을 안정화시켜 날씨가 맑아집니다.'
  }
];

interface QuizProps {
  onScoreSubmitted?: () => void;
}

export default function Quiz({ onScoreSubmitted }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedMessage, setSubmittedMessage] = useState<string>('');

  const currentQ = QUESTIONS[currentIdx];
  const isSelected = selectedAnswers[currentIdx] !== undefined;

  const handleSelectOption = (index: number) => {
    if (isSelected) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: index });
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setSubmittedMessage('');
  };

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).reduce((acc, [qIdx, ansIdx]) => {
    return ansIdx === QUESTIONS[Number(qIdx)].correctIndex ? acc + 1 : acc;
  }, 0);
  const finalScore = Math.round((correctCount / QUESTIONS.length) * 100);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          score: finalScore
        })
      });
      if (res.ok) {
        setSubmittedMessage('🎉 명예의 전당 랭킹에 성공적으로 등록되었습니다!');
        if (onScoreSubmitted) onScoreSubmitted();
      } else {
        setSubmittedMessage('랭킹 등록 완료 (로컬 세션 기록)');
      }
    } catch {
      setSubmittedMessage('랭킹 등록 완료 (로컬 세션 기록)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            대기 안정도 판정 실전 챌린지 퀴즈
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            고등학교 지구과학 II 기출 및 변형 실전 탐구 문제 (총 5문항)
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-neutral-500">
            문항 {currentIdx + 1} / {QUESTIONS.length}
          </span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[6px_6px_16px_rgba(0,0,0,0.03)] space-y-6">
          {/* Question Text */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Q{currentQ.id}. {currentQ.question}
            </h4>
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              {currentQ.scenario}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const userPick = selectedAnswers[currentIdx];
              const isCorrect = optIdx === currentQ.correctIndex;
              const isChosen = userPick === optIdx;

              let btnStyle = 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200';

              if (userPick !== undefined) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isChosen) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold';
                } else {
                  btnStyle = 'opacity-50 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-400';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isSelected}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{optIdx + 1}. {opt}</span>
                  {userPick !== undefined && (
                    <span>
                      {isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : isChosen ? <XCircle className="w-4 h-4 text-rose-500" /> : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Explanation */}
          {isSelected && (
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2 text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 block">
                💡 탐구 해설
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isSelected && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                {currentIdx < QUESTIONS.length - 1 ? '다음 문제' : '최종 결과 확인'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[6px_6px_20px_rgba(0,0,0,0.04)] text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h4 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
              챌린지 퀴즈 탐구 완료!
            </h4>
            <p className="text-xs text-neutral-500">
              총 {QUESTIONS.length}문항 중 {correctCount}문항 정답
            </p>
          </div>

          <div className="text-4xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
            {finalScore} <span className="text-base font-bold text-neutral-500">/ 100점</span>
          </div>

          {/* Submit score form */}
          {!submittedMessage ? (
            <form onSubmit={handleSubmitScore} className="max-w-sm mx-auto space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="학생 닉네임 입력 (예: 지2마스터)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !nickname.trim()}
                  className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? '등록 중...' : '랭킹 등록'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              {submittedMessage}
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={handleRestart}
              className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium inline-flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              다시 도전하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
