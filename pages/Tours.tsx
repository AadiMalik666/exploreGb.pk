
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTours } from '../services/mockData';
import { Search, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Tour } from '../types';

const HorizontalTourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
    const navigate = useNavigate();
    const perDay = Math.round(tour.price / tour.duration_days);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6 mb-5 shadow-sm group animate-fade-in">
            <div className="w-full md:w-64 h-52 md:h-auto flex-shrink-0 relative rounded-xl overflow-hidden cursor-pointer" onClick={() => navigate(`/tours/${tour.slug}`)}>
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-gray-900 uppercase">
                    {tour.category}
                </div>
            </div>

            <div className="flex-grow flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/tours/${tour.slug}`)}>
                            {tour.title}
                        </h3>
                        <div className="bg-primary/10 text-primary font-black px-2 py-1 rounded text-sm">
                            {tour.rating}
                        </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-primary font-bold mb-3 gap-2">
                        <MapPin size={14} /> {tour.location}
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {tour.description}
                    </p>

                    <div className="flex gap-4">
                        <div className="text-xs bg-gray-100 px-3 py-1.5 rounded-full font-bold text-gray-600">
                            {tour.duration_days} Days Trip
                        </div>
                        <div className="text-xs bg-emerald-50 px-3 py-1.5 rounded-full font-bold text-emerald-700">
                            Free Cancellation
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-56 flex flex-row md:flex-col justify-between items-end text-right md:pl-6 md:border-l border-gray-100">
                <div className="hidden md:block">
                    <div className="font-black text-gray-900 text-lg uppercase tracking-tight">Excellent</div>
                    <div className="text-xs text-gray-400">{tour.reviews_count} reviews</div>
                </div>

                <div className="flex flex-col items-end mt-auto w-full">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Per Person / Day: ${perDay}</div>
                    <div className="text-3xl font-black text-gray-900 mb-1">${tour.price}</div>
                    <div className="text-[10px] text-gray-500 mb-4 font-bold">+ Taxes & local charges</div>
                    <button 
                        onClick={() => navigate(`/tours/${tour.slug}`)}
                        className="bg-primary hover:bg-emerald-800 text-white font-black py-3 px-6 rounded-xl text-sm w-full transition-all shadow-lg shadow-primary/20"
                    >
                        Check Availability
                    </button>
                </div>
            </div>
        </div>
    );
};

const Tours: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [allTours, setAllTours] = useState<Tour[]>([]);
    
    const categories = ['Standard', 'Premium', 'Luxury'];

    useEffect(() => {
        setAllTours(getTours());
    }, []);

    const filteredTours = useMemo(() => {
        return allTours.filter(t => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(t.category);
            return matchesCategory;
        });
    }, [selectedCategories, allTours]);

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Header Title Area (Simplified, No Search Header) */}
            <div className="bg-[#064e3b] py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Our Destinations</h1>
                    <p className="text-emerald-200 text-lg font-medium">Find your perfect escape in Northern Pakistan</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* SIDEBAR FILTERS */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm sticky top-24">
                            <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase text-xs tracking-widest"><SlidersHorizontal size={16}/> Filter results</h4>
                            </div>
                            
                            <div className="p-6 space-y-8">
                                <div>
                                    <h5 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Plan Category</h5>
                                    <div className="space-y-3">
                                        {categories.map(cat => (
                                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => toggleCategory(cat)}
                                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" 
                                                />
                                                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{cat} Tier</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <Sparkles className="text-emerald-600 mb-3" size={24} />
                                            <h6 className="font-black text-emerald-900 text-base mb-2">Need a Custom Trip?</h6>
                                            <p className="text-emerald-700 text-xs leading-relaxed mb-4 font-medium">Our travel designers can curate a bespoke itinerary specifically for your group.</p>
                                            <button 
                                                onClick={() => navigate('/admin')}
                                                className="text-xs font-black text-white bg-emerald-700 px-5 py-3 rounded-xl hover:bg-emerald-800 transition-colors w-full shadow-lg shadow-emerald-900/10"
                                            >
                                                Talk to an Expert
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN RESULTS LIST */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Your Next Adventure</h1>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Showing {filteredTours.length} available packages</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {filteredTours.map(tour => (
                                <HorizontalTourCard key={tour.id} tour={tour} />
                            ))}
                        </div>

                        {filteredTours.length === 0 && (
                            <div className="bg-white p-24 rounded-[40px] border border-dashed border-gray-200 text-center shadow-inner">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Search size={40} className="text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No destinations found</h3>
                                <p className="text-gray-400 font-medium max-w-xs mx-auto mb-8">We couldn't find any trips matching your filters.</p>
                                <button 
                                    onClick={handleClearFilters}
                                    className="bg-emerald-900 text-white font-black px-8 py-3 rounded-xl text-sm transition-all shadow-lg active:scale-95"
                                >
                                    View All Tours
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tours;
