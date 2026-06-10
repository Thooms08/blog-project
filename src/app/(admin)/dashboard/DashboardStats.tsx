interface DashboardStatsProps {
  totalViews: number;
  totalBlog: number;
}

export default function DashboardStats({ totalViews, totalBlog }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 p-8 rounded-2xl border-2 border-blue-500/50 shadow-lg hover:border-blue-400 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-mono text-blue-400 tracking-widest mb-2">TOTAL_REACH</p>
            <p className="text-5xl md:text-6xl font-black text-white tabular-nums">
              {totalViews.toLocaleString('id-ID')}
            </p>
            <p className="text-sm font-mono text-blue-400 mt-2">VIEWS</p>
          </div>
          <i className="fa-solid fa-eye text-5xl text-blue-400 opacity-20" aria-hidden="true"></i>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 p-8 rounded-2xl border-2 border-purple-500/50 shadow-lg hover:border-purple-400 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-mono text-purple-400 tracking-widest mb-2">TOTAL_CONTENT</p>
            <p className="text-5xl md:text-6xl font-black text-white tabular-nums">
              {totalBlog.toLocaleString('id-ID')}
            </p>
            <p className="text-sm font-mono text-purple-400 mt-2">POSTS</p>
          </div>
          <i className="fa-solid fa-file-pen text-5xl text-purple-400 opacity-20" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
}
