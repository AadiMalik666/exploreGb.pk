
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MountainSnow, User, ShieldCheck, Globe, HelpCircle, ChevronDown, LogOut, Heart, Briefcase, CreditCard, Star, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, user, logout, openAuthModal } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path ? "text-primary font-bold border-b-2 border-primary" : "text-gray-600 hover:text-primary hover:bg-green-50 rounded-md px-2 transition-all";

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100 font-sans">
            {/* Top Bar for Currency/Language (Desktop) */}
            <div className="bg-slate-900 text-white text-xs py-2 px-4 hidden md:block">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex space-x-4">
                        <span className="hover:text-emerald-400 cursor-pointer">Gilgit-Baltistan Tourism Board</span>
                        <span className="hover:text-emerald-400 cursor-pointer">Partner with us</span>
                    </div>
                    <div className="flex space-x-4 items-center">
                        <span className="hover:text-emerald-400 cursor-pointer font-bold">PKR</span>
                        <span className="border-r border-white/20 h-3"></span>
                        <div className="flex items-center cursor-pointer hover:text-emerald-400 gap-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/20px-Flag_of_the_United_States.svg.png" alt="US" className="w-4 rounded-[2px]" />
                            <span>EN</span>
                        </div>
                        <span className="border-r border-white/20 h-3"></span>
                        <Link to="/help" className="flex items-center gap-1 hover:text-emerald-400">
                            <HelpCircle size={14} /> Help
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-primary to-emerald-800 p-2 rounded-lg shadow-lg transform group-hover:rotate-3 transition-transform">
                            <MountainSnow className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
                                Explore<span className="text-primary">GB</span><span className="text-gray-400 text-lg">.pk</span>
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Gateway to North</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center font-medium text-sm">
                        <Link to="/" className={`py-1 ${isActive('/')}`}>Home</Link>
                        <Link to="/tours" className={`py-1 ${isActive('/tours')}`}>Destinations</Link>
                        
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <Link to="/admin" className="text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                            <ShieldCheck size={16} />
                            <span>Admin</span>
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-full transition-colors border border-transparent hover:border-gray-200"
                                >
                                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="text-left leading-tight hidden lg:block">
                                        <div className="font-bold text-gray-900 text-xs">{user?.name}</div>
                                        <div className="text-[10px] text-yellow-600 font-bold">Genius Level 1</div>
                                    </div>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>

                                {/* User Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-blue-900 text-white -mt-2 rounded-t-lg mb-2">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-white">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{user?.name}</p>
                                                    <p className="text-xs text-blue-200">Genius Level 1</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm">
                                            <User size={18} /> My account
                                        </Link>
                                        <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm">
                                            <Briefcase size={18} /> Bookings & Trips
                                        </Link>
                                        <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm cursor-pointer">
                                            <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white">G</span> 
                                            Genius loyalty programme
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm cursor-pointer">
                                            <CreditCard size={18} /> Rewards & Wallet
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm cursor-pointer">
                                            <Star size={18} /> Reviews
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm cursor-pointer border-b border-gray-100 mb-2 pb-4">
                                            <Heart size={18} /> Saved
                                        </div>
                                        
                                        <button 
                                            onClick={() => {
                                                logout();
                                                setIsProfileOpen(false);
                                            }} 
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm"
                                        >
                                            <LogOut size={18} /> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button 
                                onClick={() => openAuthModal()}
                                className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                                Sign in / Register
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <span>PKR</span>
                            <Globe size={18} />
                        </div>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary focus:outline-none p-2">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full z-50">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-green-50 hover:text-primary font-medium">Home</Link>
                        <Link to="/tours" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-green-50 hover:text-primary font-medium">Destinations</Link>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-green-50 hover:text-primary font-medium">Dashboard</Link>
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-lg text-gray-700 hover:bg-green-50 hover:text-primary font-medium">Admin</Link>
                        <div className="border-t border-gray-100 my-2"></div>
                        {!isAuthenticated && (
                            <button onClick={() => { setIsOpen(false); openAuthModal(); }} className="block w-full text-left py-3 px-4 rounded-lg text-primary font-bold">Sign In</button>
                        )}
                        {isAuthenticated && (
                            <button onClick={() => { setIsOpen(false); logout(); }} className="block w-full text-left py-3 px-4 rounded-lg text-red-500 font-bold">Sign Out</button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
