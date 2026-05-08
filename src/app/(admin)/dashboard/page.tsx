import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  const totalViews = posts.reduce((acc, post) => acc + post.views, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-orange-500/20 pb-6">
        <h1 className="text-3xl font-black uppercase italic">Analitik_<span className="text-orange-500">Data</span></h1>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-mono">TOTAL_REACH</p>
          <p className="text-2xl font-black text-orange-500">{totalViews.toLocaleString()} VIEWS</p>
        </div>
      </div>

      {/* GRAFIK SIMULASI (Cyberpunk Style) */}
      <div className="bg-slate-900 p-6 rounded-2xl border-b-4 border-orange-600 shadow-xl">
        <div className="flex items-end gap-2 h-40">
          {posts.slice(0, 7).reverse().map((p, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                className="w-full bg-orange-600/20 border-t-2 border-orange-500 group-hover:bg-orange-500 transition-all rounded-t-sm"
                style={{ height: `${(p.views / (totalViews || 1)) * 100 + 10}%` }}
              ></div>
              <span className="text-[8px] font-mono text-slate-500">DAY_{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DAFTAR BLOG */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group hover:border-orange-500 transition-all">
            <div className="relative h-48 w-full bg-slate-800">
              {post.image ? (
                <img src={post.image} alt="thumbnail" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-700 italic">NO_IMAGE</div>
              )}
              <div className="absolute top-4 right-4 bg-slate-950/80 px-3 py-1 rounded-full border border-orange-500/30 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-orange-500 flex items-center gap-2">
                  <i className="fas fa-eye"></i> {post.views}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{post.title}</h3>
              <p className="text-slate-500 text-xs line-clamp-2 font-mono">{post.excerpt}</p>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white">
                  <i className="fas fa-share-nodes mr-2"></i> Share
                </button>
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}