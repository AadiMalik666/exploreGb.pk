
import React, { useState } from 'react';
import { X, Send, Sparkles, MapPin, DollarSign, MessageSquare, Loader2 } from 'lucide-react';
import { addInquiry } from '../services/mockData';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        destination: '',
        budget: '',
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulating API call
        setTimeout(() => {
            addInquiry(formData);
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ userName: '', email: '', destination: '', budget: '', notes: '' });
            }, 2500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-white/40 animate-fade-in font-sans">
            <div className="relative w-full max-w-2xl bg-white rounded-[56px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
                
                {/* Decorative Soft Glow Effects */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    title="Close inquiry modal"
                    aria-label="Close inquiry modal"
                    className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 hover:bg-slate-50 p-2.5 rounded-full transition-all duration-300 z-50"
                >
                    <X size={28} strokeWidth={2.5} />
                </button>

                <div className="p-12 md:p-16 relative z-10">
                    {!isSuccess ? (
                        <>
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <Sparkles className="text-emerald-600" size={20} />
                                    </div>
                                    <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px]">Premium Experience</span>
                                </div>
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">Request Custom Bill</h2>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">Share your travel vision and we'll create a tailored quote for your journey.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.25em] ml-1">Full Name</label>
                                        <input 
                                            required
                                            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[28px] text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white placeholder:text-slate-300 font-bold transition-all shadow-sm"
                                            placeholder="John Doe"
                                            value={formData.userName}
                                            onChange={e => setFormData({...formData, userName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.25em] ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email"
                                            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[28px] text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white placeholder:text-slate-300 font-bold transition-all shadow-sm"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.25em] ml-1">Target Area</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                            <input 
                                                required
                                                className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[28px] text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white placeholder:text-slate-300 font-bold transition-all shadow-sm"
                                                placeholder="e.g. Hunza, Skardu"
                                                value={formData.destination}
                                                onChange={e => setFormData({...formData, destination: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.25em] ml-1">Budget Range ($)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                            <input 
                                                required
                                                type="number"
                                                className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[28px] text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white placeholder:text-slate-300 font-bold transition-all shadow-sm"
                                                placeholder="e.g. 2000"
                                                value={formData.budget}
                                                onChange={e => setFormData({...formData, budget: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.25em] ml-1">Special Requests</label>
                                    <div className="relative group">
                                        <MessageSquare className="absolute left-6 top-8 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                        <textarea 
                                            required
                                            rows={3}
                                            className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[32px] text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white placeholder:text-slate-300 font-bold transition-all resize-none leading-relaxed shadow-sm"
                                            placeholder="Tell us about your preferences..."
                                            value={formData.notes}
                                            onChange={e => setFormData({...formData, notes: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={isLoading}
                                    className="w-full py-8 bg-[#008267] hover:bg-[#006b54] disabled:bg-slate-200 text-white font-black rounded-[36px] text-xl transition-all shadow-[0_20px_40px_-10px_rgba(0,130,103,0.3)] transform active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-tighter"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : (
                                        <>SUBMIT INQUIRY <Send size={24} /></>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="inline-flex items-center justify-center w-32 h-32 bg-emerald-50 rounded-full mb-10 border border-emerald-100 relative">
                                <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-25"></div>
                                <Sparkles className="text-emerald-600 relative z-10" size={60} />
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Request Received</h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-sm mx-auto">Our travel consultants are designing your itinerary. We'll be in touch within 24 hours.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InquiryModal;
