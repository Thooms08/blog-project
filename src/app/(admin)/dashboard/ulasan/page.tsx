import { getUlasans } from '@/lib/actions/ulasan.actions';

export default async function UlasanPage() {
    const result = await getUlasans();

    if (!result.success || !result.data) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{result.error}</p>
            </div>
        );
    }

    const ulasans = result.data;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-orange-500 uppercase">Kelola_Ulasan</h1>
                <div className="text-sm text-slate-400 bg-slate-900/50 rounded-lg px-4 py-2 border border-orange-500/20">
                    Total: <span className="font-bold text-orange-500">{ulasans.length}</span> ulasan
                </div>
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-slate-900 rounded-lg border border-orange-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Postingan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Komentar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {ulasans.map((ulasan) => (
                                <tr key={ulasan.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-200">{ulasan.post.title}</div>
                                        <div className="text-sm text-slate-400">/{ulasan.post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className={`fas fa-star text-sm ${i < ulasan.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                                                ></i>
                                            ))}
                                            <span className="ml-2 text-sm text-slate-300">{ulasan.rating}/5</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-200 max-w-xs truncate">
                                            {ulasan.comment || <span className="text-slate-500 italic">Tidak ada komentar</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                        {new Date(ulasan.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {ulasans.length === 0 && (
                    <div className="text-center py-12">
                        <i className="fas fa-comments text-4xl text-slate-600 mb-4"></i>
                        <p className="text-slate-400">Belum ada ulasan</p>
                    </div>
                )}
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden space-y-4">
                {ulasans.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900 rounded-lg border border-orange-500/20">
                        <i className="fas fa-comments text-4xl text-slate-600 mb-4"></i>
                        <p className="text-slate-400">Belum ada ulasan</p>
                    </div>
                ) : (
                    ulasans.map((ulasan) => (
                        <div key={ulasan.id} className="bg-slate-900 border border-orange-500/20 rounded-lg p-4 space-y-3 hover:border-orange-500/50 transition-colors">
                            <div>
                                <p className="font-bold text-slate-200 text-sm line-clamp-2">{ulasan.post.title}</p>
                                <p className="text-xs text-slate-500 font-mono">/{ulasan.post.slug}</p>
                            </div>

                            <div className="space-y-2 py-2 border-y border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400">Rating:</span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fas fa-star text-xs ${i < ulasan.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                                            ></i>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-300 ml-1">{ulasan.rating}/5</span>
                                </div>

                                {ulasan.comment && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 mb-1">Komentar:</p>
                                        <p className="text-sm text-slate-200 bg-slate-800/50 rounded p-2">{ulasan.comment}</p>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-slate-400">
                                {new Date(ulasan.created_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
