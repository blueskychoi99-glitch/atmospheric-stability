import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
}

export interface Ranking {
  id: string;
  nickname: string;
  score: number;
  played_at: string;
}

// Initial mock data to ensure rich presentation immediately
export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: '강제 상승 시와 자발적 상승 시의 안정도 차이 질문입니다!',
    content: '조건부 불안정 대기에서 지표 공기 덩어리가 산사면이나 전선을 만나 LCL과 LFC를 넘어설 때, 왜 갑자기 적란운이 폭발적으로 발달하나요? 자유대류고도(LFC) 이후부터는 양의 부력(CAPE)을 받기 때문인가요?',
    author: '지구과학2_마스터',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 14
  },
  {
    id: 'post-2',
    title: '[탐구보고서 요약] 푄(Foehn) 현상 발생 시 영서/영동의 대기 안정도 비교',
    content: '바람받이 사면에서는 공기가 상승하며 건조단열(1℃/100m) 후 응결하여 습윤단열(0.5℃/100m)로 냉각되지만, 산을 넘어 바람그늘 사면으로 하강할 때는 수증기가 이미 빠져나가 전 구간 건조단열(1℃/100m)로 승온됩니다. 이로 인해 하강 기류가 지표면에 안정한 고기압성 침강 역전층을 형성함을 시뮬레이션으로 입증했습니다.',
    author: '대기물리연구반',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    likes: 29
  },
  {
    id: 'post-3',
    title: '여름철 한낮 아스팔트 지표 가열 시 절대 불안정 층 형성 관측',
    content: '한여름 오후 2시 지표면 기온이 36℃까지 치솟았을 때 하층 500m 구간의 기온 감률이 1.4℃/100m로 건조 단열 감률(1.0℃/100m)을 크게 초과했습니다. 공기 덩어리가 주변보다 항상 따뜻해지면서 강한 열대류와 열성 상승기류가 발생했습니다!',
    author: '기상청꿈나무_고2',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    likes: 21
  }
];

export const INITIAL_RANKINGS: Ranking[] = [
  { id: 'rank-1', nickname: '수능지2만점자', score: 100, played_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 'rank-2', nickname: '한라산푄바람', score: 95, played_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'rank-3', nickname: '단열선도달인', score: 90, played_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'rank-4', nickname: '구름박사김지구', score: 85, played_at: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 'rank-5', nickname: '대기불안정주의보', score: 80, played_at: new Date(Date.now() - 3600000 * 12).toISOString() }
];
