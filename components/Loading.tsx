
import React from 'react';
import { MountainSnow, Cloud, Compass } from 'lucide-react';

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] w-full min-h-[400px]">
            <div className="relative">
                {/* Spinning Compass */}
                <div className="absolute -top-8 -right-8 animate-spin-slow">
                    <Compass size={32} className="text-emerald-300" />
                </div>
                
                {/* Main Logo Animation */}
                <div className="bg-white p-6 rounded-full shadow-xl border border-emerald-50 animate-bounce-subtle relative z-10">
                    <MountainSnow size={48} className="text-emerald-600" />
                </div>

                {/* Clouds */}
                <Cloud size={24} className="absolute top-1/2 -left-12 text-gray-200 animate-drift-left" />
                <Cloud size={20} className="absolute top-0 -right-10 text-gray-200 animate-drift-right" />
            </div>
            
            <div className="mt-8 text-center space-y-2">
                <h3 className="text-lg font-bold text-gray-900">Planning your journey...</h3>
                <p className="text-gray-500 text-sm">Discovering hidden trails in Gilgit-Baltistan</p>
            </div>

            {/* Loading Dots */}
            <div className="flex space-x-2 mt-6">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-300"></div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                .animate-bounce-subtle {
                    animation: bounce 2s infinite;
                }
                @keyframes drift-left {
                    0% { transform: translateX(0); opacity: 0.5; }
                    50% { transform: translateX(-10px); opacity: 0.8; }
                    100% { transform: translateX(0); opacity: 0.5; }
                }
                .animate-drift-left {
                    animation: drift-left 4s ease-in-out infinite;
                }
                @keyframes drift-right {
                    0% { transform: translateX(0); opacity: 0.5; }
                    50% { transform: translateX(10px); opacity: 0.8; }
                    100% { transform: translateX(0); opacity: 0.5; }
                }
                .animate-drift-right {
                    animation: drift-right 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Loading;
