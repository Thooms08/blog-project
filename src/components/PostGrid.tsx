"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface PostGridProps {
    posts: Array<{
        id: number;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        image: string | null;
        createdAt: string;
        views: number;
        kategoris: Array<{ id: number; nama: string }>;
    }>;
}

const DEFAULT_VISIBLE_COUNT = 20;

export default function PostGrid({ posts }: PostGridProps) {
    const [showAll, setShowAll] = useState(false);
    const visiblePosts = useMemo(
        () => (showAll ? posts : posts.slice(0, DEFAULT_VISIBLE_COUNT)),
        [posts, showAll]
    );

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visiblePosts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group"
                    >
                        <Link href={`/blog/${post.slug}`} className="block h-56 bg-orange-50 w-full overflow-hidden relative">
                            {post.image ? (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-orange-300">
                                    <span className="text-5xl">🍊</span>
                                </div>
                            )}

                            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                                {post.kategoris.map((kat) => (
                                    <span key={kat.id} className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                        {kat.nama}
                                    </span>
                                ))}
                            </div>
                        </Link>

                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                <span className="text-xs font-semibold text-slate-400">
                                    {new Date(post.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                    <i className="fa-solid fa-eye text-orange-400"></i>
                                    {post.views.toLocaleString()} ditonton
                                </span>
                            </div>

                            <Link href={`/blog/${post.slug}`}>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                                    {post.title}
                                </h3>
                            </Link>

                            <p className="text-slate-600 mb-6 line-clamp-3 text-sm flex-grow">
                                {post.excerpt || post.content.substring(0, 120) + '...'}
                            </p>

                            <Link
                                href={`/blog/${post.slug}`}
                                className="inline-block w-full text-center bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
                            >
                                Baca Selengkapnya
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {posts.length > DEFAULT_VISIBLE_COUNT && (
                <div className="mt-10 text-center">
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-500 bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600"
                    >
                        {showAll ? 'Tampilkan 20 Artikel Teratas' : `Tampilkan Semua ${posts.length} Artikel`}
                    </button>
                    {!showAll && (
                        <p className="mt-3 text-sm text-slate-500">
                            Menampilkan {visiblePosts.length} dari {posts.length} artikel terbaru.
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
