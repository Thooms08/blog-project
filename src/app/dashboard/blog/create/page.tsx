"use client";
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Ini cara panggilnya agar tidak error "Cannot find module"
const CustomEditor = dynamic(() => import('@/components/Editor'), { 
  ssr: false,
  loading: () => <div className="h-40 bg-slate-900 animate-pulse rounded-xl border-2 border-slate-800 flex items-center justify-center text-slate-500 font-mono">LOADING_EDITOR...</div>
});

export default function CreateBlogPage() {
  const [content, setContent] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-white font-black uppercase tracking-tighter">Create_New_Post</h1>
      
      {/* Panggil komponen editor di sini */}
      <CustomEditor onChange={(data) => setContent(data)} />
      
      {/* Hidden input buat simpan data content ke Form Action nantinya */}
      <input type="hidden" name="content" value={content} />
    </div>
  );
}