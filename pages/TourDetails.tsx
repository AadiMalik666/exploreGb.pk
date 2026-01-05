
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_TOURS, getReviewsByTourId, addReview, getDestinations } from '../services/mockData';
// Added ChevronRight to imports
import { Calendar, MapPin, Star, Clock, Users, ChevronLeft, ChevronRight, PlayCircle, User, MessageSquare, Plus, Minus, Plane, Car, Globe, CheckCircle2, Mountain } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { Review, Destination } from '../types';

const TourDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const tour = MOCK_TOURS.find(t => t.slug === slug);
    const destination = getDestinations().find(d => d.id === tour?.destinationId);
    
    const [seats, setSeats] = useState(1);
    const [startDate, setStartDate] = useState(tour?.start_date || '');
    const [startLocation, setStartLocation] = useState('Islamabad');
    
    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (tour) {
            setReviews(getReviewsByTourId(tour.id));
        }
    }, [tour]);

    if (!tour) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Tour not found</h2>
                <Link to="/tours" className="text-primary hover:underline mt-4 inline-block">Back to Tours</Link>
            </div>
        );
    }

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/checkout', { 
            state: { 
                tour, 
                seats,
                startDate,
                startLocation,
                totalAmount: tour.price * seats
            } 
        });
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const newReview = addReview({
                tourId: tour.id,
                userName: "Current User",
                rating: userRating,
                comment: userComment
            });
            setReviews([newReview, ...reviews]);
            setUserComment('');
            setUserRating(5);
            setIsSubmitting(false);
        }, 1000);
    };

    // Related plans at the same spot
    const relatedPlans = MOCK_TOURS.filter(t => t.destinationId === tour.destinationId && t.id !== tour.id);

    return (
        <div className="bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Header */}
            <div className="bg-[#0f172a] text-white pt-12 pb-20 relative overflow-hidden">
                {/* eslint-disable-next-line */}
                <div className="absolute inset-0 opacity-20 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${tour.image})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <Link to="/tours" className="inline-flex items-center text-emerald-400 hover:text-white mb-8 transition-colors text-xs font-black uppercase tracking-widest">
                        <ChevronLeft size={16} className="mr-1" /> Back to Destinations
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="max-w-4xl">
                            <div className="inline-block bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg mb-6 tracking-widest">
                                {tour.category} EXPEDITION
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9]">{tour.title}</h1>
                            <div className="flex flex-wrap gap-6 text-sm font-bold">
                                <span className="flex items-center gap-2 text-slate-300">
                                    <MapPin size={18} className="text-emerald-400" /> {tour.location}, GB
                                </span>
                                <span className="flex items-center gap-2 text-slate-300">
                                    <Clock size={18} className="text-emerald-400" /> {tour.duration_days} Days Trip
                                </span>
                                <span className="flex items-center gap-2 text-slate-300">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" /> 
                                    <span className="text-white font-black">{tour.rating}</span> 
                                    <span className="text-slate-500">({tour.reviews_count} reviews)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-10 relative z-20">
                <div className="grid lg:grid-cols-3 gap-10">
                    
                    {/* LEFT MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* Summary & Destination Intro */}
                        <div className="bg-white p-10 md:p-14 rounded-[48px] shadow-sm border border-slate-100">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                                <Mountain className="text-emerald-600" size={32} /> Experience the Magic
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-12 text-xl font-medium">{tour.description}</p>
                            
                            {destination && (
                                <div className="space-y-10 pt-10 border-t border-slate-50">
                                    <div className="bg-slate-50/50 p-8 rounded-[36px] border border-slate-100">
                                        <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4">About {destination.name}</h3>
                                        <p className="text-slate-500 text-base leading-relaxed">{destination.description}</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Places You Will Visit</h4>
                                            <ul className="space-y-4">
                                                {destination.visitPlaces.map((place, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                                                        <CheckCircle2 size={18} className="text-emerald-500" /> {place}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Included Services</h4>
                                            <ul className="space-y-4">
                                                {destination.services.map((service, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                                                        <CheckCircle2 size={18} className="text-emerald-500" /> {service}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gallery Section */}
                        {destination && destination.gallery.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visual Journey</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {destination.gallery.map((media, i) => (
                                        <div key={i} className={`rounded-[32px] overflow-hidden shadow-sm border border-slate-100 ${i === 0 ? 'col-span-2 row-span-2 h-96' : 'h-44'}`}>
                                            {media.type === 'video' ? (
                                                <video src={media.url} className="w-full h-full object-cover" controls={false} autoPlay muted loop />
                                            ) : (
                                                <img src={media.url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Destination Gallery" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related plans for this destination */}
                        {relatedPlans.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Other Options in {destination?.name}</h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {relatedPlans.map(plan => (
                                        <Link key={plan.id} to={`/tours/${plan.slug}`} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-emerald-300 transition-all group flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-emerald-100">
                                                        {plan.duration_days} Day Plan
                                                    </div>
                                                    <span className="font-black text-slate-900 text-xl">${plan.price}</span>
                                                </div>
                                                <h3 className="font-black text-2xl text-slate-900 group-hover:text-emerald-700 transition-colors mb-4">{plan.title}</h3>
                                                <p className="text-base text-slate-500 line-clamp-2 leading-relaxed">{plan.description}</p>
                                            </div>
                                            <div className="mt-8 flex items-center text-emerald-600 font-black text-xs uppercase tracking-widest gap-2">
                                                Learn More <ChevronRight size={16} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR - BOOKING BOX */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-10 rounded-[56px] shadow-2xl border border-slate-100 sticky top-28">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fixed Price</p>
                                    <span className="text-6xl font-black text-[#0f172a] leading-none tracking-tighter">${tour.price}</span>
                                </div>
                            </div>

                            <form onSubmit={handleBook} className="space-y-8">
                                {/* Start Location Selector */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Starting Point</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            {id: 'Islamabad', icon: Car, label: 'ISB/RWP'},
                                            {id: 'Lahore', icon: Car, label: 'LHR'},
                                            {id: 'GB', icon: MapPin, label: 'ALREADY IN GB'},
                                            {id: 'International', icon: Globe, label: 'INTL FLY-IN'}
                                        ].map(loc => (
                                            <button 
                                                key={loc.id}
                                                type="button"
                                                onClick={() => setStartLocation(loc.id)}
                                                className={`flex flex-col items-center justify-center p-5 rounded-[24px] border-2 transition-all gap-3 ${startLocation === loc.id ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                <loc.icon size={22} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{loc.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Arrival</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                                        <input 
                                            type="date" 
                                            required
                                            title="Arrival date"
                                            aria-label="Arrival date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full pl-16 pr-6 py-6 rounded-[28px] bg-slate-50 border-none outline-none font-black text-slate-900 shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Travelers Selection */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Group Size</label>
                                    <div className="flex items-center bg-slate-50 rounded-[28px] overflow-hidden shadow-inner p-2">
                                        <button 
                                            type="button"
                                            onClick={() => setSeats(Math.max(1, seats - 1))}
                                            title="Decrease group size"
                                            aria-label="Decrease group size"
                                            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#0f172a] transition-all shadow-sm"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <input 
                                            type="number" 
                                            value={seats} 
                                            readOnly
                                            title="Group size"
                                            aria-label="Group size"
                                            className="flex-1 text-center font-black text-[#0f172a] bg-transparent border-none focus:ring-0 text-2xl" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setSeats(seats + 1)}
                                            title="Increase group size"
                                            aria-label="Increase group size"
                                            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#0f172a] transition-all shadow-sm"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Final Calculation */}
                                <div className="pt-8 border-t border-slate-100 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-3xl font-black text-[#0f172a] tracking-tighter uppercase text-sm">Grand Total</span>
                                        <span className="text-4xl font-black text-emerald-700 tracking-tighter">${(tour.price * seats).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-[#008267] hover:bg-[#006b54] text-white font-black py-7 rounded-[32px] transition-all shadow-[0_25px_50px_-12px_rgba(0,130,103,0.4)] text-lg uppercase tracking-widest transform active:scale-95"
                                >
                                    Confirm Booking
                                </button>
                                <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">Secure 256-bit Payment Gateway</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetails;
