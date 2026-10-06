import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, INITIAL_POSTS, Post } from '@/lib/supabase';

// In-memory fallback if database is not yet bound
let memoryPosts: Post[] = [...INITIAL_POSTS];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data, source: 'supabase-seoul' });
      }
    }
    return NextResponse.json({ success: true, data: memoryPosts, source: 'memory-fallback' });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: memoryPosts, error: String(err) });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPost: Post = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `post-${Date.now()}`,
      title: body.title || '제목 없음',
      content: body.content || '',
      author: body.author || '익명 탐구자',
      created_at: new Date().toISOString(),
      likes: 0
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select();

      if (!error && data) {
        return NextResponse.json({ success: true, data: data[0] });
      }
    }

    memoryPosts = [newPost, ...memoryPosts];
    return NextResponse.json({ success: true, data: newPost });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
