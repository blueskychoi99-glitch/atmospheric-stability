'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Plus, Send, X, User } from 'lucide-react';
import { Post } from '@/lib/supabase';

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>({});

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const json = await res.json();
      if (json.success && json.data) {
        setPosts(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          author: newAuthor.trim() || '익명 탐구자'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPosts([json.data, ...posts]);
        setIsModalOpen(false);
        setNewTitle('');
        setNewContent('');
        setNewAuthor('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts({ ...likedPosts, [postId]: !isLiked });
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            대기 안정도 탐구 토론 커뮤니티
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            고등학교 지구과학 탐구활동 보고서 공유 및 질의응답 포럼
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          탐구글 작성
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[6px_6px_16px_rgba(0,0,0,0.03)] space-y-3 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
                {post.title}
              </h4>
              <button
                onClick={() => handleToggleLike(post.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                  likedPosts[post.id]
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-300'
                    : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${likedPosts[post.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{post.likes}</span>
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="font-medium text-neutral-600 dark:text-neutral-400">{post.author}</span>
              </span>
              <span>
                {post.created_at ? new Date(post.created_at).toLocaleDateString('ko-KR') : '방금 전'}
              </span>
            </div>
          </div>
        ))}

        {posts.length === 0 && !loading && (
          <div className="p-8 text-center text-xs text-neutral-400">
            등록된 게시물이 없습니다. 첫 번째 탐구 게시물을 작성해 보세요!
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                새 탐구 게시물 작성
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  작성자 (닉네임 / 학교명)
                </label>
                <input
                  type="text"
                  placeholder="예: 경기고 지구과학부"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  게시물 제목
                </label>
                <input
                  type="text"
                  placeholder="탐구 주제 또는 질문 요약"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  내용 (탐구 보고서 / 관측값 / 질문)
                </label>
                <textarea
                  rows={5}
                  placeholder="대기 안정도 판정 결과나 의문점을 자유롭게 기록해 보세요..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                  className="py-2.5 px-5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? '게시 중...' : '게시하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
