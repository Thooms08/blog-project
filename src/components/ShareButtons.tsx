'use client';

import { useEffect, useState } from 'react';

interface ShareButtonsProps {
    title: string;
    excerpt: string;
    slug: string;
}

export default function ShareButtons({ title, excerpt, slug }: ShareButtonsProps) {
    const [currentUrl, setCurrentUrl] = useState(`https://blog.flavory.id/blog/${slug}`);
    const shareText = `${title}\n${excerpt}`;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            alert('Link artikel berhasil disalin ke clipboard.');
        } catch {
            alert('Gagal menyalin link. Silakan salin secara manual.');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title,
                text: excerpt,
                url: currentUrl,
            });
            return;
        }

        handleCopyLink();
    };

    return (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <button
                type="button"
                onClick={handleShare}
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
                Bagikan Artikel
            </button>
            <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
            >
                Salin Link
            </button>
            <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-500 hover:text-green-600"
            >
                WhatsApp
            </a>
            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} ${currentUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
            >
                Twitter
            </a>
        </div>
    );
}
