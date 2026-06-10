'use client';

import { useEffect, useState, type ReactNode } from 'react';

const motivations = [
    { icon: 'fa-solid fa-star', text: 'Setiap klik adalah awal dari cerita baru!' },
    { icon: 'fa-solid fa-dumbbell', text: 'Terus buat konten berkualitas, dunia menunggu!' },
    { icon: 'fa-solid fa-rocket', text: 'Perjalanan seribu mil dimulai dengan satu postingan!' },
    { icon: 'fa-solid fa-wand-magic-sparkles', text: 'Kreativitasmu adalah kekuatanmu!' },
    { icon: 'fa-solid fa-bullseye', text: 'Fokus pada kualitas, kesuksesan akan menyusul!' },
    { icon: 'fa-solid fa-lightbulb', text: 'Ide brilian ada di benak mu!' },
    { icon: 'fa-solid fa-palette', text: 'Warna-warni konten menginspirasi jutaan orang!' },
    { icon: 'fa-solid fa-fire', text: 'Passion mu adalah bahan bakar kesuksesanmu!' },
    { icon: 'fa-solid fa-crown', text: 'Kamu adalah master di bidangmu!' },
    { icon: 'fa-solid fa-pen-nib', text: 'Seni membuat konten dimulai dari hati!' },
];

interface DashboardProps {
    stats: ReactNode;
}

export default function ClientDashboard({ stats }: DashboardProps) {
    const [time, setTime] = useState<string>('00:00:00');
    const [date, setDate] = useState<string>('Loading...');
    const [motivation, setMotivation] = useState(motivations[0]);
    const [characterPos, setCharacterPos] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Load Font Awesome CSS dynamically
        if (!document.getElementById('fa-cdn')) {
            const link = document.createElement('link');
            link.id = 'fa-cdn';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            document.head.appendChild(link);
        }

        // Set random motivation
        setMotivation(motivations[Math.floor(Math.random() * motivations.length)]);

        // Update time and date
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setTime(`${hours}:${minutes}:${seconds}`);

            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const dayName = days[now.getDay()];
            const day = now.getDate();
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            setDate(`${dayName}, ${day} ${month} ${year}`);
        };

        updateTime();
        const timeInterval = setInterval(updateTime, 1000);

        // Character animation
        const handleMouseMove = () => {
            const randomX = Math.random() * 100 - 50;
            const randomY = Math.random() * 100 - 50;
            setCharacterPos({ x: randomX, y: randomY });
        };

        const animationInterval = setInterval(handleMouseMove, 2000);

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearInterval(timeInterval);
            clearInterval(animationInterval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    if (!mounted) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border-2 border-orange-500/30 shadow-xl">
                        <div className="space-y-4">
                            <div className="h-4 bg-slate-700 rounded w-32"></div>
                            <div className="h-16 bg-slate-700 rounded w-48"></div>
                            <div className="h-4 bg-slate-700 rounded w-64"></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-8 rounded-2xl border-2 border-orange-500/50 shadow-xl">
                        <div className="h-8 bg-slate-700 rounded w-48"></div>
                    </div>
                </div>

                {stats}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header dengan Clock dan Motivation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clock Section */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border-2 border-orange-500/30 shadow-xl">
                    <div className="space-y-4">
                        <h2 className="text-sm font-mono text-orange-500 tracking-widest">LIVE_CLOCK</h2>
                        <div className="text-5xl md:text-6xl font-black text-white font-mono tracking-tighter mb-4">
                            {time}
                        </div>
                        <div className="text-sm md:text-base font-mono text-slate-400 leading-relaxed">
                            {date}
                        </div>
                    </div>
                </div>

                {/* Motivation Section */}
                <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-8 rounded-2xl border-2 border-orange-500/50 shadow-xl flex items-center">
                    <div className="w-full">
                        <h2 className="text-sm font-mono text-orange-500 tracking-widest mb-4">MOTIVASI_HARIAN</h2>
                        <p className="text-xl md:text-2xl font-black text-orange-300 leading-snug animate-pulse flex items-center gap-3">
                            <i className={`${motivation.icon} text-orange-400`}></i>
                            {motivation.text}
                        </p>
                    </div>
                </div>
            </div>

            {stats}

            {/* Animated Character Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border-2 border-orange-500/30 shadow-xl min-h-60 md:min-h-72 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl"></div>
                </div>

                {/* Modern Robot Character */}
                <svg
                    className="w-32 h-32 md:w-48 md:h-48 relative z-10 transition-transform duration-500"
                    viewBox="0 0 200 210"
                    style={{
                        transform: `translate(${characterPos.x}px, ${characterPos.y}px)`,
                    }}
                >
                    {/* Antenna */}
                    <line x1="100" y1="28" x2="100" y2="10" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="7" r="5" fill="#FF6B00" className="animate-pulse-dot" />

                    {/* Head — sleek rectangle with rounded corners */}
                    <rect x="60" y="28" width="80" height="62" rx="14" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />

                    {/* Visor / face screen */}
                    <rect x="68" y="38" width="64" height="36" rx="8" fill="#020617" />

                    {/* Scan-line glow inside visor */}
                    <rect x="68" y="38" width="64" height="36" rx="8" fill="url(#visorGlow)" opacity="0.25" />

                    {/* Left Eye — cyan LED */}
                    <circle cx="86" cy="56" r="9" fill="#001a1a" />
                    <circle cx="86" cy="56" r="6" fill="#00E5FF" className="animate-eye-glow" />
                    <circle cx="86" cy="56" r="3" fill="#ffffff" opacity="0.9" />
                    <circle cx="88" cy="54" r="1.5" fill="#ffffff" opacity="0.6" />

                    {/* Right Eye — cyan LED */}
                    <circle cx="114" cy="56" r="9" fill="#001a1a" />
                    <circle cx="114" cy="56" r="6" fill="#00E5FF" className="animate-eye-glow" />
                    <circle cx="114" cy="56" r="3" fill="#ffffff" opacity="0.9" />
                    <circle cx="116" cy="54" r="1.5" fill="#ffffff" opacity="0.6" />

                    {/* Mouth — cool LED bar */}
                    <rect x="82" y="66" width="36" height="4" rx="2" fill="#FF6B00" opacity="0.8" />
                    <rect x="88" y="66" width="8" height="4" rx="2" fill="#ffffff" opacity="0.6" />

                    {/* Neck joint */}
                    <rect x="88" y="90" width="24" height="12" rx="5" fill="#1e293b" stroke="#FF6B00" strokeWidth="1.5" />

                    {/* Body — main torso */}
                    <rect x="62" y="102" width="76" height="62" rx="12" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />

                    {/* Chest panel */}
                    <rect x="74" y="112" width="52" height="36" rx="6" fill="#020617" stroke="#FF6B00" strokeWidth="1" opacity="0.8" />

                    {/* Chest LED indicators */}
                    <circle cx="88" cy="126" r="5" fill="#FF6B00" className="animate-led-orange" />
                    <circle cx="100" cy="126" r="5" fill="#00E5FF" className="animate-led-cyan" />
                    <circle cx="112" cy="126" r="5" fill="#FF6B00" className="animate-led-orange" style={{ animationDelay: '0.4s' }} />

                    {/* Chest bar bottom */}
                    <rect x="78" y="138" width="44" height="4" rx="2" fill="#1e293b" />
                    <rect x="78" y="138" width="20" height="4" rx="2" fill="#FF6B00" opacity="0.7" className="animate-scan" />

                    {/* Left Arm */}
                    <g className="animate-arm-left">
                        <rect x="34" y="105" width="28" height="18" rx="9" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />
                        {/* Left Hand */}
                        <circle cx="34" cy="114" r="10" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />
                        <circle cx="34" cy="114" r="5" fill="#FF6B00" opacity="0.6" />
                    </g>

                    {/* Right Arm */}
                    <g className="animate-arm-right" style={{ animationDelay: '0.5s' }}>
                        <rect x="138" y="105" width="28" height="18" rx="9" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />
                        {/* Right Hand */}
                        <circle cx="166" cy="114" r="10" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />
                        <circle cx="166" cy="114" r="5" fill="#FF6B00" opacity="0.6" />
                    </g>

                    {/* Left Leg */}
                    <rect x="74" y="164" width="20" height="34" rx="7" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />
                    {/* Right Leg */}
                    <rect x="106" y="164" width="20" height="34" rx="7" fill="#0f172a" stroke="#FF6B00" strokeWidth="2" />

                    {/* Left Foot */}
                    <rect x="68" y="191" width="34" height="12" rx="6" fill="#1e293b" stroke="#FF6B00" strokeWidth="1.5" />
                    {/* Right Foot */}
                    <rect x="98" y="191" width="34" height="12" rx="6" fill="#1e293b" stroke="#FF6B00" strokeWidth="1.5" />

                    {/* Floating data orb */}
                    <g className="animate-float-orb">
                        <circle cx="158" cy="45" r="12" fill="#FF6B00" opacity="0.15" />
                        <circle cx="158" cy="45" r="7" fill="#FF6B00" opacity="0.5" />
                        <circle cx="158" cy="45" r="3" fill="#ffffff" opacity="0.8" />
                    </g>

                    {/* Gradient defs */}
                    <defs>
                        <radialGradient id="visorGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#00E5FF" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                </svg>

                {/* Motivational text below character */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-xs md:text-sm font-mono text-orange-400 animate-pulse flex items-center justify-center gap-2">
                        <i className="fa-solid fa-bolt"></i>
                        KEEP CREATING!
                        <i className="fa-solid fa-bolt"></i>
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes armLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-18deg); }
        }
        @keyframes armRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(18deg); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes ledPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scanBar {
          0% { width: 8px; }
          50% { width: 32px; }
          100% { width: 8px; }
        }
        @keyframes eyeGlow {
          0%, 100% { filter: drop-shadow(0 0 4px #00E5FF); }
          50% { filter: drop-shadow(0 0 10px #00E5FF); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; r: 5; }
          50% { opacity: 0.4; r: 7; }
        }
        .animate-arm-left {
          animation: armLeft 1.6s ease-in-out infinite;
          transform-origin: 62px 114px;
        }
        .animate-arm-right {
          animation: armRight 1.6s ease-in-out infinite;
          transform-origin: 138px 114px;
        }
        .animate-float-orb {
          animation: floatOrb 2.4s ease-in-out infinite;
        }
        .animate-led-orange {
          animation: ledPulse 1.2s ease-in-out infinite;
        }
        .animate-led-cyan {
          animation: ledPulse 1.2s ease-in-out infinite;
          animation-delay: 0.6s;
        }
        .animate-scan {
          animation: scanBar 1.8s ease-in-out infinite;
        }
        .animate-eye-glow {
          animation: eyeGlow 2s ease-in-out infinite;
        }
        .animate-pulse-dot {
          animation: pulseDot 1.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
