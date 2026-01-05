import React, { useState } from 'react';
import { Plane, Cloud } from 'lucide-react';

interface LoginLampProps {
    isOn?: boolean;
    color?: string;
    onToggle?: () => void;
}

const LoginLamp: React.FC<LoginLampProps> = ({ isOn = false, color = '#10b981', onToggle }) => {
    const [isPulling, setIsPulling] = useState(false);

    const handlePull = () => {
        setIsPulling(true);
        if (onToggle) onToggle();
        setTimeout(() => setIsPulling(false), 300);
    };

    const beamStyle = isOn
        ? {
            background: `conic-gradient(from 180deg at 50% 0%, transparent 165deg, ${color}30 175deg, ${color}60 180deg, ${color}30 185deg, transparent 195deg)`,
            opacity: 1,
            height: '1000px',
            filter: 'blur(30px)',
        }
        : {
            background: 'transparent',
            opacity: 0,
            height: '0px'
        };

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 flex justify-center">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[#0f172a]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20">
                    <Cloud className="absolute top-20 -left-10 text-white animate-drift-right" size={120} />
                    <Cloud className="absolute bottom-40 -right-10 text-white animate-drift-left delay-700" size={160} />
                </div>
            </div>

            {/* The Lamp Fixture */}
            <div className="absolute -top-10 flex flex-col items-center animate-lamp-swing lamp-origin pointer-events-auto">
                
                {/* Suspension Wire */}
                <div className="w-0.5 h-40 bg-slate-700"></div>

                {/* Light Body */}
                <div className="relative z-20">
                    {/* eslint-disable-next-line */}
                    <div 
                        className="w-40 h-40 rounded-full border-2 transition-all duration-500 flex items-center justify-center relative border-white/20"
                        style={{ 
                            backgroundColor: isOn ? color : 'rgb(30 41 59 / 0.8)',
                            boxShadow: isOn ? `0 0 80px ${color}80, inset 0 0 20px rgba(255,255,255,0.2)` : '0 15px 40px rgba(0,0,0,0.6)' 
                        }}
                    >
                        {/* Plane Icon */}
                        <Plane 
                            size={70} 
                            strokeWidth={1.5}
                            className={`transform -rotate-45 transition-all duration-500 ${isOn ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-slate-600 opacity-40'}`}
                        />
                        
                        {/* Glass Shine */}
                        <div className="absolute top-4 left-6 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
                    </div>

                    {/* Pull Socket */}
                    <div className="w-4 h-4 bg-slate-800 mx-auto -mt-1 rounded-b-md border-x border-b border-slate-700"></div>

                    {/* The Cord */}
                    {/* eslint-disable-next-line */}
                    <button 
                        onClick={handlePull}
                        aria-label="Toggle lamp"
                        title="Click to toggle lamp"
                        className={`w-0.5 mx-auto bg-slate-500 cursor-pointer hover:bg-white transition-all group relative border-0
                            ${isPulling ? 'h-32' : 'h-28'}
                        `}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                        {/* The Handle */}
                        <div className={`w-3 h-7 rounded-full absolute bottom-0 -translate-x-1/2 left-1/2 shadow-lg transition-all border
                            ${isOn ? 'bg-white border-white' : 'bg-slate-700 border-slate-600'}
                            group-hover:scale-110 active:scale-95
                        `}></div>
                    </button>
                </div>

                {/* Light Beam Effect */}
                <div 
                    className="absolute top-[210px] left-1/2 -translate-x-1/2 w-[800px] z-0 pointer-events-none transition-all duration-1000 ease-out origin-top"
                    style={beamStyle}
                ></div>
            </div>

            <style>{`
                @keyframes drift-right {
                    0% { transform: translateX(-100%) translateY(0); opacity: 0; }
                    20% { opacity: 0.1; }
                    80% { opacity: 0.1; }
                    100% { transform: translateX(200%) translateY(20px); opacity: 0; }
                }
                @keyframes drift-left {
                    0% { transform: translateX(100%) translateY(0); opacity: 0; }
                    20% { opacity: 0.1; }
                    80% { opacity: 0.1; }
                    100% { transform: translateX(-200%) translateY(-20px); opacity: 0; }
                }
                .animate-drift-right { animation: drift-right 20s linear infinite; }
                .animate-drift-left { animation: drift-left 25s linear infinite; }
            `}</style>
        </div>
    );
};

export default LoginLamp;