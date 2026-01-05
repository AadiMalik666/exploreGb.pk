import React, { useState } from 'react';
import { User, Lock, Users, Settings, CreditCard, Shield, Plus, ChevronRight, BedDouble, Car, Briefcase, Phone, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkUserExists, registerUser } from '../services/mockData';

// Social Icons
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M23.52 12.29C23.52 11.43 23.44 10.6 23.29 9.79H12V14.41H18.45C18.17 15.86 17.3 17.09 15.99 17.97V20.93H19.85C22.11 18.84 23.52 15.75 23.52 12.29Z" fill="#4285F4"/><path d="M12 24C15.24 24 17.96 22.92 19.85 20.93L15.99 17.97C14.91 18.7 13.54 19.12 12 19.12C8.87 19.12 6.22 17 5.27 14.22H1.28V17.31C3.25 21.22 7.31 24 12 24Z" fill="#34A853"/><path d="M5.27 14.22C5.03 13.43 4.9 12.59 4.9 11.73C4.9 10.87 5.03 10.03 5.27 9.24V6.15H1.28C0.46 7.78 0 9.7 0 11.73C0 13.76 0.46 15.68 1.28 17.31L5.27 14.22Z" fill="#FBBC05"/><path d="M12 4.35C13.76 4.35 15.34 4.96 16.58 6.15L20.01 2.72C17.96 0.81 15.24 0 12 0C7.31 0 3.25 2.78 1.28 6.69L5.27 9.78C6.22 7 8.87 4.35 12 4.35Z" fill="#EA4335"/></svg>;
const AppleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28C16.03 21.79 14.61 23.85 12.79 23.89C11.07 23.94 10.51 22.88 8.53 22.88C6.55 22.88 5.92 23.86 4.29 23.92C2.5 24 1.07 21.94 0.38 19.12C-1.07 13.16 2.14 9.87 5.17 9.77C6.88 9.73 8.1 10.92 9.17 10.92C10.22 10.92 11.83 9.49 13.88 9.44C14.73 9.46 16.54 9.78 17.8 11.62C17.7 11.68 15.65 12.87 15.67 15.62C15.69 18.06 17.77 19.26 17.85 19.3C17.83 19.35 17.48 20.67 17.05 20.28ZM12.03 6.36C12.92 5.28 13.52 3.77 13.35 2.27C12.04 2.32 10.45 3.14 9.51 4.22C8.68 5.17 7.95 6.69 8.13 8.16C9.57 8.27 11.13 7.44 12.03 6.36Z" /></svg>;
const FacebookIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.415 23.094 10.125 23.991V15.563H7.078V12.073H10.125V9.429C10.125 6.421 11.916 4.768 14.657 4.768C15.97 4.768 17.344 5.003 17.344 5.003V7.956H15.83C14.339 7.956 13.875 8.88 13.875 9.829V12.073H17.203L16.67 15.563H13.875V23.991C19.585 23.094 24 18.1 24 12.073Z" /></svg>;

const Dashboard: React.FC = () => {
    const { isAuthenticated, login, user } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); 
    const [activeTab, setActiveTab] = useState('overview');
    const [step, setStep] = useState<'email' | 'password' | 'signup_details'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [profile, setProfile] = useState({
        name: user?.name || 'Ahad Malik',
        displayName: '',
        email: user?.email || 'aadimalik226@gmail.com',
        phone: '+92 300 1234567',
        dob: '01-01-1995',
        nationality: 'Pakistan',
        gender: 'Male',
        address: 'Islamabad',
        passport: ''
    });

    const validateIdentifier = (id: string) => {
        const isEmail = id.includes('@');
        const isPhone = /^\+?[\d\s-]{10,}$/.test(id);
        return isEmail || isPhone;
    };

    const handleIdentifierSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateIdentifier(identifier)) {
            setError('Enter a valid email or phone number');
            return;
        }

        setIsLoading(true);
        setError('');
        
        setTimeout(() => {
            const exists = checkUserExists(identifier);
            if (exists) {
                setStep('password');
            } else {
                setError('No account found. Use the Create Account option below.');
            }
            setIsLoading(false);
        }, 800);
    };

    const goToCreateAccount = () => {
        if (!identifier || !validateIdentifier(identifier)) {
            setError('Please enter a valid email or phone number first');
            return;
        }
        setStep('signup_details');
        setError('');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (identifier && password) {
            setIsLoading(true);
            setTimeout(() => {
                login({ name: 'Traveler', email: identifier });
                setIsLoading(false);
            }, 1000);
        }
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (identifier && password && name) {
            setIsLoading(true);
            setTimeout(() => {
                registerUser(identifier, name);
                login({ name: name, email: identifier });
                setIsLoading(false);
            }, 1000);
        }
    };

    const SidebarItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`w-full text-left px-4 py-4 font-medium text-sm transition-all flex items-center gap-4 ${
                activeTab === id 
                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            <Icon size={20} className={`${activeTab === id ? 'text-blue-600' : 'text-gray-400'}`} />
            {label}
        </button>
    );

    const SettingsRow = ({ label, value, actionLabel = "Edit", onClick, verified = false }: any) => (
        <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-4 transition-colors -mx-4">
            <div className="flex-1 pr-4">
                <span className="block text-gray-900 text-sm font-medium mb-1">{label}</span>
                <span className={`block text-gray-500 text-sm ${!value ? 'italic' : ''}`}>
                    {value || 'Not provided'}
                    {verified && <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Verified</span>}
                </span>
            </div>
            <button onClick={onClick} className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap">{actionLabel}</button>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 font-sans relative">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-80"></div>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 md:p-14 relative z-10 animate-fade-in border border-slate-800/50">
                    {step === 'email' && (
                        <div className="space-y-8 text-center">
                            <div>
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-3xl mb-6 shadow-inner ring-1 ring-emerald-100">
                                    <Briefcase className="text-[#008267]" size={36} />
                                </div>
                                <h2 className="text-[36px] font-black text-slate-900 tracking-tight">Welcome</h2>
                                <p className="text-slate-500 text-lg mt-2 font-medium">Sign in or create account to continue</p>
                            </div>

                            <form onSubmit={handleIdentifierSubmit} className="space-y-6 text-left">
                                <div className={`relative transition-all duration-300 rounded-[22px] border-2 ${error ? 'border-red-500 bg-red-50' : 'border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10'}`}>
                                    <Mail className="absolute left-5 top-5 text-slate-400" size={24} />
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none transition-all font-medium placeholder-slate-400"
                                        placeholder="Email or mobile number"
                                        value={identifier}
                                        onChange={e => {setIdentifier(e.target.value); setError('');}}
                                    />
                                </div>
                                {error && <div className="text-red-500 text-sm font-semibold px-2 animate-fade-in">{error}</div>}
                                <button className="w-full py-5 rounded-[22px] text-white font-black text-xl shadow-xl shadow-[#008267]/20 transition-all transform active:scale-[0.98] bg-[#008267] hover:bg-[#006b54] flex items-center justify-center">
                                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : 'SIGN IN'}
                                </button>
                            </form>

                            <div className="text-center pt-2">
                                <p className="text-slate-500 font-medium">
                                    New traveler?{' '}
                                    <button 
                                        onClick={goToCreateAccount}
                                        className="text-[#008267] font-bold hover:underline"
                                    >
                                        Create account
                                    </button>
                                </p>
                            </div>
                            
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink-0 mx-6 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">or connect with</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <button title="Sign in with Google" aria-label="Sign in with Google" className="h-16 flex items-center justify-center border-2 border-slate-50 rounded-[22px] hover:bg-slate-50 transition-all shadow-sm">
                                    <GoogleIcon />
                                </button>
                                <button title="Sign in with Apple" aria-label="Sign in with Apple" className="h-16 flex items-center justify-center border-2 border-slate-50 rounded-[22px] hover:bg-slate-50 transition-all shadow-sm text-slate-900">
                                    <AppleIcon />
                                </button>
                                <button title="Sign in with Facebook" aria-label="Sign in with Facebook" className="h-16 flex items-center justify-center border-2 border-slate-50 rounded-[22px] hover:bg-slate-50 transition-all shadow-sm">
                                    <FacebookIcon />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'password' && (
                        <div className="space-y-8 animate-fade-in">
                            <button onClick={() => setStep('email')} className="flex items-center text-slate-400 hover:text-slate-900 text-xs font-black tracking-widest uppercase transition-colors">
                                <ArrowLeft size={16} className="mr-2" /> CHANGE ACCOUNT
                            </button>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome back</h3>
                                <div className="bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100 inline-block">
                                    <p className="text-[#008267] text-sm font-black">{identifier}</p>
                                </div>
                            </div>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="relative rounded-[22px] border-2 border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10 transition-all">
                                    <Lock className="absolute left-5 top-5 text-slate-400" size={24} />
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none font-medium placeholder-slate-400"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <button className="w-full py-5 rounded-[22px] text-white font-black text-xl shadow-xl shadow-[#008267]/20 transition-all transform active:scale-[0.98] bg-[#008267] hover:bg-[#006b54] flex items-center justify-center">
                                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : 'SIGN IN'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'signup_details' && (
                        <div className="space-y-8 animate-fade-in">
                            <button onClick={() => setStep('email')} className="flex items-center text-slate-400 hover:text-slate-900 text-xs font-black tracking-widest uppercase transition-colors">
                                <ArrowLeft size={16} className="mr-2" /> GO BACK
                            </button>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h3>
                                <p className="text-slate-500 text-lg font-medium">New traveler at <span className="font-black text-[#008267]">{identifier}</span></p>
                            </div>
                            <form onSubmit={handleSignup} className="space-y-6">
                                <div className="relative rounded-[22px] border-2 border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10 transition-all">
                                    <User className="absolute left-5 top-5 text-slate-400" size={24} />
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none font-medium placeholder-slate-400"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="relative rounded-[22px] border-2 border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10 transition-all">
                                    <Lock className="absolute left-5 top-5 text-slate-400" size={24} />
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none font-medium placeholder-slate-400"
                                        placeholder="Create password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <button className="w-full py-5 rounded-[22px] text-white font-black text-xl shadow-xl shadow-[#008267]/20 transition-all transform active:scale-[0.98] bg-[#008267] hover:bg-[#006b54] flex items-center justify-center">
                                    {isLoading ? <Loader2 className="animate-spin" size={28} /> : 'CREATE ACCOUNT'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-blue-900 text-white pt-8 pb-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white text-white">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Hi, {user?.name || 'Traveler'}</h1>
                            <p className="text-yellow-400 text-sm font-bold">Genius Level 1</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <SidebarItem id="personal-details" label="Personal details" icon={User} />
                            <SidebarItem id="security" label="Security settings" icon={Lock} />
                            <SidebarItem id="travellers" label="Other travellers" icon={Users} />
                            <SidebarItem id="preferences" label="Customisation preferences" icon={Settings} />
                            <SidebarItem id="payment" label="Payment methods" icon={CreditCard} />
                            <SidebarItem id="privacy" label="Privacy and data management" icon={Shield} />
                        </div>
                    </div>

                    <div className="flex-1">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">You have 2 Genius rewards</h2>
                                    <p className="text-sm text-gray-600 mb-6">Enjoy rewards and discounts on select stays and rental cars worldwide.</p>
                                    
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        <div className="min-w-[160px] p-4 bg-gray-50 rounded border border-gray-100 flex flex-col items-start">
                                            <BedDouble className="text-yellow-600 mb-3" />
                                            <span className="text-sm font-bold text-gray-900">10% off stays</span>
                                        </div>
                                        <div className="min-w-[160px] p-4 bg-gray-50 rounded border border-gray-100 flex flex-col items-start">
                                            <Car className="text-blue-600 mb-3" />
                                            <span className="text-sm font-bold text-gray-900">10% discounts on rental cars</span>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 font-medium text-sm hover:underline">Learn more about your rewards</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'personal-details' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Personal details</h1>
                                        <p className="text-sm text-gray-600 mt-1">Update your information and find out how it's used.</p>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="border-t border-gray-100">
                                    <SettingsRow label="Name" value={profile.name} onClick={() => {}} />
                                    <SettingsRow label="Email address" value={profile.email} verified={true} onClick={() => {}} />
                                    <SettingsRow label="Phone number" value={profile.phone} onClick={() => {}} />
                                    <SettingsRow label="Address" value={profile.address} onClick={() => {}} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;