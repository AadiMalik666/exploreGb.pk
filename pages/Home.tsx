
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getTours, getHeroMedia } from '../services/mockData';
import TourCard from '../components/TourCard';
import InquiryModal from '../components/InquiryModal';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [featuredTours, setFeaturedTours] = useState(getTours().filter(t => t.featured).slice(0, 3));
    const heroMedia = getHeroMedia();
    const timerRef = useRef<number | null>(null);

    const nextMedia = () => {
        setCurrentMediaIndex((prev) => (prev + 1) % heroMedia.length);
    };

    useEffect(() => {
        // Clear any existing timer when index changes
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const currentItem = heroMedia[currentMediaIndex];

        if (currentItem.type === 'image') {
            // Images stay for exactly 5 seconds as requested
            timerRef.current = window.setTimeout(nextMedia, 5000);
        }
        // For videos, the onEnded callback on the video element handles the transition

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentMediaIndex, heroMedia]);

    useEffect(() => {
        setFeaturedTours(getTours().filter(t => t.featured).slice(0, 3));
    }, [isInquiryModalOpen]);

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* HERO SECTION - CINEMATIC BACKGROUND */}
            <div className="relative h-[92vh] w-full overflow-hidden">
                {heroMedia.map((media, index) => (
                    <div 
                        key={media.id}
                        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentMediaIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {media.type === 'video' ? (
                            <video 
                                autoPlay 
                                muted 
                                playsInline 
                                onEnded={nextMedia}
                                className={`w-full h-full object-cover transition-transform duration-[12000ms] ${index === currentMediaIndex ? 'scale-105' : 'scale-100'}`}
                                src={media.url}
                            />
                        ) : (
                            <div 
                                className={`w-full h-full bg-cover bg-center transition-transform duration-[12000ms] bg-no-repeat ${index === currentMediaIndex ? 'scale-105' : 'scale-100'}`}
                                style={{ backgroundImage: `url(${media.url})` }}
                                role="img"
                                aria-label={`Media ${index}`}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-[#020617]/90"></div>
                    </div>
                ))}

                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border border-white/20 mb-8 shadow-2xl">
                            <Sparkles className="text-emerald-400" size={16} />
                            <span className="text-white font-black tracking-[0.3em] uppercase text-[10px]">
                                The Gateway to North Pakistan
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-[130px] font-black text-white mb-10 leading-[0.85] tracking-tighter drop-shadow-2xl">
                            Peak Luxury. <br/> <span className="text-emerald-400">Pure Nature.</span>
                        </h1>
                        <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto mb-12">Experience the most breathtaking valleys and peaks of Gilgit-Baltistan with curated premium expeditions.</p>
                        <button 
                            onClick={() => navigate('/tours')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-6 px-14 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl uppercase tracking-tighter"
                        >
                            Explore Destinations
                        </button>
                    </div>
                </div>
            </div>

            {/* CUSTOM TRIP REQUEST SECTION */}
            <div className="container mx-auto px-4 mt-20 relative z-30">
                <div className="bg-[#0f172a] rounded-[64px] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[180px] opacity-10 -mr-64 -mt-64 group-hover:opacity-25 transition-opacity duration-1000"></div>
                    <div className="relative z-10 max-w-2xl text-left">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                                <Sparkles className="text-emerald-400" size={28} />
                            </div>
                            <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs">Custom Planning</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">Your Journey, <br/> Your Way.</h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-lg">Can't find the perfect pre-defined plan? Tell us your vision. We'll arrange private flights and hand-selected luxury stays for a completely personalized adventure.</p>
                    </div>
                    <div className="relative z-10 mt-12 md:mt-0">
                        <button 
                            onClick={() => setIsInquiryModalOpen(true)}
                            className="bg-white hover:bg-emerald-50 text-gray-950 font-black px-12 py-8 rounded-[36px] flex items-center gap-4 transition-all active:scale-95 shadow-2xl text-lg uppercase tracking-tight"
                        >
                            Request Custom Bill <ArrowRight size={28} className="text-emerald-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* FEATURED DESTINATIONS */}
            <div className="py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                        <div className="max-w-3xl">
                            <h2 className="text-6xl md:text-[100px] font-black text-gray-900 mb-8 tracking-tighter leading-[0.9] animate-fade-in">The Majestic <br/> Collection</h2>
                            <p className="text-slate-500 text-2xl font-medium leading-relaxed max-w-xl">Curated premium trips ranging from 2-day short escapes to 15-day full expeditions.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/tours')}
                            className="flex items-center gap-5 text-emerald-800 font-black text-xl hover:gap-10 transition-all group px-12 py-7 bg-emerald-50 rounded-[40px] border border-emerald-100/50"
                        >
                            Full Collection <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-20">
                        {featuredTours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                </div>
            </div>

            <InquiryModal 
                isOpen={isInquiryModalOpen} 
                onClose={() => setIsInquiryModalOpen(false)} 
            />
        </div>
    );
};

export default Home;
