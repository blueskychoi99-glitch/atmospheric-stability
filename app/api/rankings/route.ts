import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, INITIAL_RANKINGS, Ranking } from '@/lib/supabase';

let memoryRankings: Ranking[] = [...INITIAL_RANKINGS];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data, source: 'supabase-seoul' });
      }
    }
    return NextResponse.json({
      success: true,
      data: memoryRankings.sort((a, b) => b.score - a.score),
      source: 'memory-fallback'
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: memoryRankings, error: String(err) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRanking: Ranking = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rank-${Date.now()}`,
      nickname: body.nickname || '익명 탐구자',
      score: Number(body.score) || 0,
      played_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rankings')
        .insert([newRanking])
        .select();

      if (!error && data) {
        return NextResponse.json({ success: true, data: data[0] });
      }
    }

    memoryRankings.push(newRanking);
    memoryRankings.sort((a, b) => b.score - a.score);
    return NextResponse.json({ success: true, data: newRanking });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
