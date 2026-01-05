
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_TOURS, MOCK_INQUIRIES, addTour, updateTour, deleteTour, getHeroMedia, updateHeroMedia, HeroMedia, getAllUsers, getDestinations, addDestination, updateDestination } from '../services/mockData';
import { Plus, Edit2, Trash2, X, Shield, MessageSquare, ListChecks, Map, LogOut, Users, CheckCircle, ArrowUpRight, Upload, Film, Trash, Image as ImageIcon, MapPin, Sparkles, Tag } from 'lucide-react';
import { Destination, Tour } from '../types';

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'tours' | 'inquiries' | 'media' | 'users' | 'destinations'>('destinations');
    const [tours, setTours] = useState<Tour[]>([]);
    const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
    const [users, setUsers] = useState(getAllUsers());
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [heroMedia, setHeroMedia] = useState<HeroMedia[]>(getHeroMedia());
    
    // Modals
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isDestModalOpen, setIsDestModalOpen] = useState(false);
    const [isAssetsModalOpen, setIsAssetsModalOpen] = useState(false);
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [assetEditingDest, setAssetEditingDest] = useState<Destination | null>(null);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    // File Upload Refs
    const destImageRef = useRef<HTMLInputElement>(null);
    const tourImageRef = useRef<HTMLInputElement>(null);
    const assetFileInputRef = useRef<HTMLInputElement>(null);
    const heroFileInputRef = useRef<HTMLInputElement>(null);

    // Forms
    const [tourForm, setTourForm] = useState({
        destinationId: 0, 
        title: '', 
        description: '', 
        price: '', 
        duration_days: '', 
        location: '', 
        start_date: '', 
        image: '', 
        category: 'Standard' as 'Standard' | 'Premium' | 'Luxury', 
        capacity: '20', 
        featured: false,
        services: [] as string[]
    });

    const [destForm, setDestForm] = useState({
        name: '', 
        description: '', 
        image: '', 
        services: [] as string[], 
        visitPlaces: [] as string[], 
        gallery: [] as {url: string, type: 'image' | 'video'}[]
    });

    useEffect(() => {
        setTours([...MOCK_TOURS]);
        setDestinations(getDestinations());
        setHeroMedia(getHeroMedia());
    }, [activeTab, isPlanModalOpen, isDestModalOpen]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginForm.email === 'admin@exploregb.pk' && loginForm.password === 'admin123') {
            setIsAuthenticated(true);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'dest-main' | 'tour-main' | 'assets' | 'hero') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (target === 'dest-main') {
            const url = URL.createObjectURL(files[0]);
            setDestForm(prev => ({ ...prev, image: url }));
        } else if (target === 'tour-main') {
            const url = URL.createObjectURL(files[0]);
            setTourForm(prev => ({ ...prev, image: url }));
        } else if (target === 'assets' && assetEditingDest) {
            // Fix: Explicitly type 'file' as 'File' to resolve 'unknown' type errors during mapping
            const newMedia = Array.from(files).map((file: File) => ({
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' as const : 'image' as const
            }));
            const updatedGallery = [...assetEditingDest.gallery, ...newMedia];
            const updatedDest = updateDestination(assetEditingDest.id, { gallery: updatedGallery });
            if (updatedDest) {
                setAssetEditingDest({ ...updatedDest });
                setDestinations(getDestinations());
            }
        } else if (target === 'hero') {
            // Fix: Explicitly type 'file' as 'File' to resolve 'unknown' type errors during mapping
            const newMedia = Array.from(files).map((file: File) => ({
                id: Math.random().toString(36).substr(2, 9),
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' as const : 'image' as const,
                section: 'hero' as const
            }));
            const updatedHero = [...heroMedia, ...newMedia];
            setHeroMedia(updatedHero);
            updateHeroMedia(updatedHero);
        }
    };

    const handleAddDest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!destForm.image) {
            alert("Please upload a destination cover image.");
            return;
        }
        addDestination(destForm);
        setDestinations(getDestinations());
        setIsDestModalOpen(false);
        setDestForm({ name: '', description: '', image: '', services: [], visitPlaces: [], gallery: [] });
    };

    const handleEditTour = (tour: Tour) => {
        setTourForm({
            destinationId: tour.destinationId,
            title: tour.title,
            description: tour.description,
            price: tour.price.toString(),
            duration_days: tour.duration_days.toString(),
            location: tour.location,
            start_date: tour.start_date,
            image: tour.image,
            category: tour.category,
            capacity: tour.capacity.toString(),
            featured: tour.featured,
            services: tour.services || []
        });
        setEditingId(tour.id);
        setIsPlanModalOpen(true);
    };

    const handleSubmitTour = (e: React.FormEvent) => {
        e.preventDefault();
        const dest = destinations.find(d => d.id === Number(tourForm.destinationId));
        if (!dest) {
            alert("Please select a valid destination.");
            return;
        }

        const data = {
            ...tourForm,
            destinationId: Number(tourForm.destinationId),
            location: dest.name,
            price: parseFloat(tourForm.price),
            duration_days: parseInt(tourForm.duration_days),
            capacity: parseInt(tourForm.capacity),
            image: tourForm.image || dest.image
        };

        if (editingId) {
            updateTour(editingId, data);
        } else {
            addTour(data);
        }
        setTours([...MOCK_TOURS]);
        setIsPlanModalOpen(false);
        setTourForm({
            destinationId: 0, title: '', description: '', price: '', duration_days: '', location: '', start_date: '', image: '', category: 'Standard', capacity: '20', featured: false, services: []
        });
        setEditingId(null);
    };

    const handleRemoveAsset = (idx: number) => {
        if (!assetEditingDest) return;
        const newGallery = assetEditingDest.gallery.filter((_, i) => i !== idx);
        const updated = updateDestination(assetEditingDest.id, { gallery: newGallery });
        if (updated) {
            setAssetEditingDest({ ...updated });
            setDestinations(getDestinations());
        }
    };

    const handleRemoveHeroMedia = (id: string) => {
        const updated = heroMedia.filter(m => m.id !== id);
        setHeroMedia(updated);
        updateHeroMedia(updated);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 font-sans relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none"></div>
                <div className="w-full max-w-md bg-[#0f172a] p-10 md:p-14 rounded-[48px] shadow-2xl border border-white/5 text-center relative z-10">
                    <div className="inline-flex p-5 bg-emerald-500/10 rounded-3xl mb-8 border border-emerald-500/20">
                        <Shield className="text-emerald-400" size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Staff Portal</h1>
                    <p className="text-slate-400 text-sm mb-10 font-medium">Internal Enterprise Access Only</p>
                    <form onSubmit={handleLogin} className="space-y-6 text-left">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity</label>
                             <input type="email" required className="w-full p-5 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" placeholder="admin@exploregb.pk" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Code</label>
                             <input type="password" required className="w-full p-5 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                        </div>
                        <button className="w-full bg-emerald-600 text-white font-black py-6 rounded-2xl text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/10 active:scale-95">ENTER PORTAL</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
            {/* Sub-Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40 py-4 px-6 mb-8 shadow-sm">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex bg-[#f1f5f9] p-1.5 rounded-2xl gap-1 overflow-x-auto scrollbar-hide">
                        {[
                            {id: 'destinations', label: 'DESTINATIONS', icon: Map},
                            {id: 'tours', label: 'TOUR PLANS', icon: ListChecks},
                            {id: 'inquiries', label: 'INQUIRIES', icon: MessageSquare},
                            {id: 'media', label: 'GLOBAL MEDIA', icon: ImageIcon},
                            {id: 'users', label: 'USERS', icon: Users},
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2.5 ${activeTab === tab.id ? 'bg-white text-[#008267] shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                                <tab.icon size={16} strokeWidth={2.5} /> {tab.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} title="Logout" aria-label="Logout" className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors shadow-sm ml-4 flex-shrink-0"><LogOut size={20} /></button>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {activeTab === 'destinations' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                            <h1 className="text-2xl font-black text-[#0f172a]">Active Destinations</h1>
                            <button onClick={() => setIsDestModalOpen(true)} className="bg-[#008267] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all w-full md:w-auto">
                                <Plus size={18} strokeWidth={3} /> Add Destination
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destinations.map(d => (
                                <div key={d.id} className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm group hover:shadow-xl transition-all">
                                    <div className="h-56 relative">
                                        <img src={d.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={d.name} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                        <h3 className="absolute bottom-6 left-8 text-3xl font-black text-white tracking-tight">{d.name}</h3>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">{d.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {d.visitPlaces.slice(0, 3).map((p, i) => (
                                                <span key={i} className="text-[9px] bg-slate-50 text-slate-400 border border-slate-100 px-2 py-1 rounded font-bold uppercase">{p}</span>
                                            ))}
                                            {d.visitPlaces.length > 3 && <span className="text-[9px] text-slate-300 font-bold">+{d.visitPlaces.length - 3} more</span>}
                                        </div>
                                        <button 
                                            onClick={() => { setAssetEditingDest(d); setIsAssetsModalOpen(true); }}
                                            className="text-[11px] font-black text-[#008267] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all pt-4"
                                        >
                                            Manage Assets <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tours' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                            <h1 className="text-2xl font-black text-[#0f172a]">Manage Tour Plans</h1>
                            <button onClick={() => { setEditingId(null); setIsPlanModalOpen(true); setTourForm({destinationId: 0, title: '', description: '', price: '', duration_days: '', location: '', start_date: '', image: '', category: 'Standard', capacity: '20', featured: false, services: []}); }} className="bg-[#008267] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all w-full md:w-auto">
                                <Plus size={18} strokeWidth={3} /> NEW PLAN
                            </button>
                        </div>
                        <div className="bg-white rounded-[32px] border border-gray-100 overflow-x-auto shadow-sm">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-[#fcfdfe] text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-50">
                                    <tr>
                                        <th className="px-10 py-6">Plan Info</th>
                                        <th className="px-10 py-6 text-center">Price</th>
                                        <th className="px-10 py-6 text-center">Seats</th>
                                        <th className="px-10 py-6 text-center">Featured</th>
                                        <th className="px-10 py-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tours.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <img src={t.image} alt={t.title} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                                                    <div>
                                                        <div className="text-[#0f172a] font-black text-base">{t.title}</div>
                                                        <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{t.location} • {t.duration_days} Days</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center font-black text-[#008267] text-lg">${t.price}</td>
                                            <td className="px-10 py-8 text-center font-bold text-slate-500">{t.available_seats}/{t.capacity}</td>
                                            <td className="px-10 py-8 text-center">
                                                {t.featured ? <span className="text-emerald-500"><CheckCircle size={20} className="mx-auto" /></span> : <span className="text-slate-300">—</span>}
                                            </td>
                                            <td className="px-10 py-8 text-right space-x-2">
                                                <button title="Edit tour" aria-label="Edit tour" onClick={() => handleEditTour(t)} className="p-3 text-slate-400 hover:text-emerald-600 transition-all"><Edit2 size={18} /></button>
                                                <button title="Delete tour" aria-label="Delete tour" onClick={() => { if(confirm('Delete plan?')) { deleteTour(t.id); setTours([...MOCK_TOURS]); } }} className="p-3 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex items-center justify-between">
                            <h1 className="text-2xl font-black text-[#0f172a]">Global Website Assets</h1>
                            <button onClick={() => heroFileInputRef.current?.click()} className="bg-[#008267] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                                <Plus size={18} strokeWidth={3} /> Add Media
                            </button>
                            <input type="file" ref={heroFileInputRef} className="hidden" title="Upload media" aria-label="Upload media" multiple accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'hero')} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {heroMedia.map(m => (
                                <div key={m.id} className="aspect-square rounded-2xl overflow-hidden relative group border border-slate-100">
                                    {m.type === 'video' ? <div className="w-full h-full bg-slate-900 flex items-center justify-center"><Film className="text-white/40" /></div> : <img src={m.url} alt={m.id} className="w-full h-full object-cover" />}
                                    <button title="Delete media" aria-label="Delete media" onClick={() => handleRemoveHeroMedia(m.id)} className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Destination Modal */}
            {isDestModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white rounded-[56px] w-full max-w-3xl shadow-2xl overflow-hidden p-12 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Add Destination</h2>
                            <button onClick={() => setIsDestModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-all"><X size={32} strokeWidth={3} /></button>
                        </div>
                        <form onSubmit={handleAddDest} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Name</label>
                                    <input required className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold shadow-sm" placeholder="e.g. Gilgit" value={destForm.name} onChange={e => setDestForm({...destForm, name: e.target.value})} />
                                    
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                                    <div 
                                        onClick={() => destImageRef.current?.click()}
                                        className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group overflow-hidden"
                                    >
                                        {destForm.image ? (
                                            <img src={destForm.image} alt={destForm.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Upload className="text-slate-300 group-hover:text-emerald-500 mb-2" size={32} />
                                                <span className="text-[10px] font-black text-slate-400 uppercase">Upload from device</span>
                                            </>
                                        )}
                                        <input type="file" ref={destImageRef} className="hidden" title="Upload destination image" aria-label="Upload destination image" accept="image/*" onChange={(e) => handleFileUpload(e, 'dest-main')} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Summary Description</label>
                                    <textarea required rows={8} className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-sm resize-none shadow-sm" placeholder="Tell the world about this place..." value={destForm.description} onChange={e => setDestForm({...destForm, description: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={14}/> Areas to Visit (Comma separated)</label>
                                    <input className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-sm shadow-sm" placeholder="Naltar Valley, Rakaposhi Base..." value={destForm.visitPlaces.join(', ')} onChange={e => setDestForm({...destForm, visitPlaces: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} />
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {destForm.visitPlaces.map((p, i) => (
                                            <span key={i} className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-black border border-emerald-100">{p}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2"><Sparkles size={14}/> General Services (Comma separated)</label>
                                    <input className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-sm shadow-sm" placeholder="WiFi, Breakfast, Guide..." value={destForm.services.join(', ')} onChange={e => setDestForm({...destForm, services: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} />
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {destForm.services.map((s, i) => (
                                            <span key={i} className="text-[9px] bg-slate-900 text-white px-2 py-1 rounded font-black">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-[#008267] text-white font-black py-7 rounded-[32px] text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                                CREATE DESTINATION
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Tour Plan Modal */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white rounded-[56px] w-full max-w-3xl shadow-2xl overflow-hidden p-12 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">{editingId ? 'Modify Tour Plan' : 'Add New Plan'}</h2>
                            <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-all"><X size={32} strokeWidth={3} /></button>
                        </div>
                        <form onSubmit={handleSubmitTour} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Linked Destination</label>
                                        <select required title="Select destination" aria-label="Select destination" className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-base shadow-sm" value={tourForm.destinationId} onChange={e => setTourForm({...tourForm, destinationId: Number(e.target.value)})}>
                                            <option value="">Select Destination...</option>
                                            {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</label>
                                        <div 
                                            onClick={() => tourImageRef.current?.click()}
                                            className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-all overflow-hidden relative group"
                                        >
                                            {tourForm.image ? (
                                                <img src={tourForm.image} alt={tourForm.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Upload className="text-slate-300 mb-2" size={32} />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Upload Cover</span>
                                                </>
                                            )}
                                            <input type="file" ref={tourImageRef} className="hidden" title="Upload tour image" aria-label="Upload tour image" accept="image/*" onChange={(e) => handleFileUpload(e, 'tour-main')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Title</label>
                                        <input required className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-base shadow-sm" placeholder="7-Day Luxury Hunza Expedition" value={tourForm.title} onChange={e => setTourForm({...tourForm, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Summary</label>
                                        <textarea required rows={4} className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-sm resize-none shadow-sm" placeholder="Briefly describe the tour experience..." value={tourForm.description} onChange={e => setTourForm({...tourForm, description: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
                                            <input type="number" required title="Price" aria-label="Price" className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-base shadow-sm" value={tourForm.price} onChange={e => setTourForm({...tourForm, price: e.target.value})} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Days</label>
                                            <input type="number" required title="Duration in days" aria-label="Duration in days" className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-base shadow-sm" value={tourForm.duration_days} onChange={e => setTourForm({...tourForm, duration_days: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2"><Tag size={14}/> Specific Plan Services (Comma separated)</label>
                                <input className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-sm shadow-sm" placeholder="Private 4x4, Special Dinner..." value={tourForm.services.join(', ')} onChange={e => setTourForm({...tourForm, services: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select required title="Select category" aria-label="Select category" className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-base shadow-sm" value={tourForm.category} onChange={e => setTourForm({...tourForm, category: e.target.value as any})}>
                                        <option value="Standard">Standard</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Luxury">Luxury</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                                    <input type="number" required title="Capacity" aria-label="Capacity" className="w-full p-6 bg-slate-50 rounded-[28px] border border-slate-100 outline-none font-bold text-base shadow-sm" value={tourForm.capacity} onChange={e => setTourForm({...tourForm, capacity: e.target.value})} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                                <input type="checkbox" id="featured" checked={tourForm.featured} onChange={e => setTourForm({...tourForm, featured: e.target.checked})} className="w-6 h-6 rounded accent-emerald-600 cursor-pointer" />
                                <label htmlFor="featured" className="text-[11px] font-black text-slate-600 uppercase tracking-widest cursor-pointer">Promote as "Featured" on Homepage</label>
                            </div>

                            <button className="w-full bg-[#008267] text-white font-black py-7 rounded-[32px] text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                                {editingId ? 'SAVE CHANGES' : 'PUBLISH TOUR PLAN'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Assets Manager Modal */}
            {isAssetsModalOpen && assetEditingDest && (
                 <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white rounded-[56px] w-full max-w-3xl shadow-2xl overflow-hidden p-12 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Gallery Assets</h2>
                                <p className="text-slate-400 font-bold text-sm">Managing visual media for <span className="text-emerald-600">{assetEditingDest.name}</span></p>
                            </div>
                            <button onClick={() => setIsAssetsModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-all"><X size={32} strokeWidth={3} /></button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
                            <button onClick={() => assetFileInputRef.current?.click()} className="aspect-square rounded-[36px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 hover:border-[#008267] hover:bg-emerald-50 transition-all text-slate-400 hover:text-[#008267] group">
                                <Upload size={32} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Add Files</span>
                            </button>
                            <input type="file" ref={assetFileInputRef} className="hidden" title="Upload asset files" aria-label="Upload asset files" multiple accept="image/*,video/*" onChange={(e) => handleFileUpload(e, 'assets')} />
                            {assetEditingDest.gallery.map((item, idx) => (
                                <div key={idx} className="aspect-square rounded-[36px] overflow-hidden relative group shadow-sm border border-slate-50">
                                    {item.type === 'video' ? (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><Film size={40} /></div>
                                    ) : (
                                        <img src={item.url} alt={`Asset ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    )}
                                    <button title="Delete asset" aria-label="Delete asset" onClick={() => handleRemoveAsset(idx)} className="absolute top-4 right-4 bg-white/95 text-red-500 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-md"><Trash size={18} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setIsAssetsModalOpen(false)} className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-black py-7 rounded-[32px] text-base uppercase tracking-widest transition-all">Done Managing Gallery</button>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default Admin;
