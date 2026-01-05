import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Mail, Lock, User, Loader2, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkUserExists, registerUser } from '../services/mockData';

// Social Icons - Precisely matching the brand colors and styles
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M23.52 12.29C23.52 11.43 23.44 10.6 23.29 9.79H12V14.41H18.45C18.17 15.86 17.3 17.09 15.99 17.97V20.93H19.85C22.11 18.84 23.52 15.75 23.52 12.29Z" fill="#4285F4"/><path d="M12 24C15.24 24 17.96 22.92 19.85 20.93L15.99 17.97C14.91 18.7 13.54 19.12 12 19.12C8.87 19.12 6.22 17 5.27 14.22H1.28V17.31C3.25 21.22 7.31 24 12 24Z" fill="#34A853"/><path d="M5.27 14.22C5.03 13.43 4.9 12.59 4.9 11.73C4.9 10.87 5.03 10.03 5.27 9.24V6.15H1.28C0.46 7.78 0 9.7 0 11.73C0 13.76 0.46 15.68 1.28 17.31L5.27 14.22Z" fill="#FBBC05"/><path d="M12 4.35C13.76 4.35 15.34 4.96 16.58 6.15L20.01 2.72C17.96 0.81 15.24 0 12 0C7.31 0 3.25 2.78 1.28 6.69L5.27 9.78C6.22 7 8.87 4.35 12 4.35Z" fill="#EA4335"/></svg>;
const AppleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28C16.03 21.79 14.61 23.85 12.79 23.89C11.07 23.94 10.51 22.88 8.53 22.88C6.55 22.88 5.92 23.86 4.29 23.92C2.5 24 1.07 21.94 0.38 19.12C-1.07 13.16 2.14 9.87 5.17 9.77C6.88 9.73 8.1 10.92 9.17 10.92C10.22 10.92 11.83 9.49 13.88 9.44C14.73 9.46 16.54 9.78 17.8 11.62C17.7 11.68 15.65 12.87 15.67 15.62C15.69 18.06 17.77 19.26 17.85 19.3C17.83 19.35 17.48 20.67 17.05 20.28ZM12.03 6.36C12.92 5.28 13.52 3.77 13.35 2.27C12.04 2.32 10.45 3.14 9.51 4.22C8.68 5.17 7.95 6.69 8.13 8.16C9.57 8.27 11.13 7.44 12.03 6.36Z" /></svg>;
const FacebookIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.415 23.094 10.125 23.991V15.563H7.078V12.073H10.125V9.429C10.125 6.421 11.916 4.768 14.657 4.768C15.97 4.768 17.344 5.003 17.344 5.003V7.956H15.83C14.339 7.956 13.875 8.88 13.875 9.829V12.073H17.203L16.67 15.563H13.875V23.991C19.585 23.094 24 18.1 24 12.073Z" /></svg>;

const AuthModal: React.FC = () => {
    const { isModalOpen, closeAuthModal, login } = useAuth();
    const [step, setStep] = useState<'email' | 'password' | 'signup_details'>('email');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (isModalOpen) {
            setStep('email');
            setIsAnimating(true);
            setError('');
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    const validateIdentifier = (id: string) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
        const isPhone = /^(\+|0)?\d{9,15}$/.test(id.replace(/[\s-]/g, ''));
        return isEmail || isPhone;
    };

    const handleIdentifierSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateIdentifier(identifier)) {
            setError('Please enter a valid email or phone number');
            return;
        }

        setIsLoading(true);
        setError('');
        
        setTimeout(() => {
            const userExists = checkUserExists(identifier);
            if (userExists) {
                setStep('password');
            } else {
                setError('No account found with this identifier. Would you like to create one?');
            }
            setIsLoading(false);
        }, 800);
    };

    const goToCreateAccount = () => {
        if (!identifier) {
            setError('Please enter an email or phone number first');
            return;
        }
        if (!validateIdentifier(identifier)) {
            setError('Please enter a valid email or phone number');
            return;
        }
        setStep('signup_details');
        setError('');
    };

    const handleFinalLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            login({ name: 'Traveler', email: identifier });
            handleClose();
            setIsLoading(false);
        }, 1000);
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setError('Name is required');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            registerUser(identifier, name);
            login({ name, email: identifier });
            handleClose();
            setIsLoading(false);
        }, 1000);
    };

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            closeAuthModal();
            setIdentifier('');
            setPassword('');
            setName('');
            setIsAnimating(false);
            setStep('email');
            setIsLoading(false);
            setError('');
        }, 200);
    };

    const isInputPhone = /^\+?[\d\s-]{1,}/.test(identifier) && !identifier.includes('@');

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'backdrop-blur-none bg-black/0' : 'backdrop-blur-md bg-black/60'}`}>
            <div 
                className={`
                    relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden transition-all duration-500 ease-out
                    ${isAnimating ? 'scale-95 opacity-0 translate-y-8' : 'scale-100 opacity-100 translate-y-0'}
                `}
            >
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    title="Close modal"
                    aria-label="Close modal"
                    className="absolute top-8 right-8 z-50 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                    <X size={24} strokeWidth={2.5} />
                </button>

                <div className="p-10 md:p-14">
                    {step === 'email' && (
                        <div className="animate-fade-in space-y-8">
                            <div>
                                <h3 className="text-[40px] font-black text-[#0f172a] tracking-tight mb-2">Welcome</h3>
                                <p className="text-[#64748b] text-lg font-medium opacity-80">
                                    Sign in or create an account to start your journey.
                                </p>
                            </div>

                            <form onSubmit={handleIdentifierSubmit} className="space-y-6">
                                <div className={`relative transition-all duration-300 rounded-[22px] border-2 ${error ? 'border-red-500 bg-red-50' : 'border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10'}`}>
                                    <div className={`absolute left-5 top-5 transition-colors ${identifier ? 'text-[#008267]' : 'text-slate-400'}`}>
                                        {isInputPhone ? <Phone size={24} /> : <Mail size={24} />}
                                    </div>
                                    <input 
                                        type="text" 
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none font-medium placeholder-slate-400"
                                        placeholder="Email or mobile number"
                                        value={identifier}
                                        onChange={e => {setIdentifier(e.target.value); if(error) setError('');}}
                                        autoFocus
                                    />
                                </div>
                                
                                {error && (
                                    <div className="flex items-start gap-2 text-red-500 text-sm font-semibold px-2 animate-fade-in">
                                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" /> 
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button 
                                    disabled={isLoading}
                                    className="w-full py-5 rounded-[22px] text-white font-black text-xl shadow-xl shadow-[#008267]/20 transition-all transform active:scale-[0.98] flex items-center justify-center bg-[#008267] hover:bg-[#006b54]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-7 h-7" /> : 'SIGN IN'}
                                </button>
                            </form>

                            <div className="text-center">
                                <p className="text-slate-500 font-medium">
                                    New to ExploreGB?{' '}
                                    <button 
                                        onClick={goToCreateAccount}
                                        className="text-[#008267] font-bold hover:underline"
                                    >
                                        Create account
                                    </button>
                                </p>
                            </div>

                            <div className="relative flex py-4 items-center">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink-0 mx-6 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">or continue with</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <button title="Sign in with Google" aria-label="Sign in with Google" className="h-16 flex items-center justify-center border-2 border-slate-50 rounded-[22px] hover:bg-slate-50 transition-all hover:border-slate-100 shadow-sm">
                                    <GoogleIcon />
                                </button>
                                <button title="Sign in with Apple" aria-label="Sign in with Apple" className="h-16 flex items-center justify-center border-2 border-slate-50 rounded-[22px] hover:bg-slate-50 transition-all hover:border-slate-100 shadow-sm text-slate-900">
                                    <AppleIcon />
                                </button>
                                <button title="Sign in with Facebook" aria-label="Sign in with Facebook" className="h-16 flex items-center justify-center border-2 border-slate-50 rounded-[22px] hover:bg-slate-50 transition-all hover:border-slate-100 shadow-sm">
                                    <FacebookIcon />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'password' && (
                        <div className="animate-fade-in space-y-8">
                            <button onClick={() => setStep('email')} className="flex items-center text-slate-400 hover:text-slate-900 text-xs font-black uppercase tracking-widest transition-colors">
                                <ArrowLeft size={16} className="mr-2" /> CHANGE ACCOUNT
                            </button>
                            <div>
                                <h3 className="text-[32px] font-black text-[#0f172a] mb-2">Welcome back</h3>
                                <div className="bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100 inline-block">
                                    <p className="text-[#008267] text-sm font-black">{identifier}</p>
                                </div>
                            </div>

                            <form onSubmit={handleFinalLogin} className="space-y-6">
                                <div className="relative rounded-[22px] border-2 border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10 transition-all">
                                    <Lock className={`absolute left-5 top-5 transition-colors ${password ? 'text-[#008267]' : 'text-slate-400'}`} size={24} />
                                    <input 
                                        type="password" 
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none font-medium placeholder-slate-400"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {error && <div className="text-red-500 text-sm font-semibold px-2">{error}</div>}
                                
                                <button 
                                    disabled={isLoading}
                                    className="w-full py-5 rounded-[22px] text-white font-black text-xl shadow-xl shadow-[#008267]/20 transition-all transform active:scale-[0.98] flex items-center justify-center bg-[#008267] hover:bg-[#006b54]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-7 h-7" /> : 'SIGN IN'}
                                </button>
                            </form>
                            <div className="text-center">
                                <button className="text-[#008267] font-bold text-sm hover:underline">Forgot password?</button>
                            </div>
                        </div>
                    )}

                    {step === 'signup_details' && (
                        <div className="animate-fade-in space-y-8">
                            <button onClick={() => setStep('email')} className="flex items-center text-slate-400 hover:text-slate-900 text-xs font-black uppercase tracking-widest transition-colors">
                                <ArrowLeft size={16} className="mr-2" /> BACK
                            </button>
                            <div>
                                <h3 className="text-[32px] font-black text-[#0f172a] mb-2">Create Account</h3>
                                <p className="text-slate-500 text-lg font-medium">Sign up for <span className="font-black text-[#008267]">{identifier}</span></p>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-6">
                                <div className="relative rounded-[22px] border-2 border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10 transition-all">
                                    <User className={`absolute left-5 top-5 transition-colors ${name ? 'text-[#008267]' : 'text-slate-400'}`} size={24} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none font-medium placeholder-slate-400"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="relative rounded-[22px] border-2 border-slate-100 focus-within:border-[#008267] focus-within:ring-4 focus-within:ring-[#008267]/10 transition-all">
                                    <Lock className={`absolute left-5 top-5 transition-colors ${password ? 'text-[#008267]' : 'text-slate-400'}`} size={24} />
                                    <input 
                                        type="password" 
                                        className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-900 text-lg outline-none font-medium placeholder-slate-400"
                                        placeholder="Create Password (min 6 chars)"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <button 
                                    disabled={isLoading}
                                    className="w-full py-5 rounded-[22px] text-white font-black text-xl shadow-xl shadow-[#008267]/20 transition-all transform active:scale-[0.98] flex items-center justify-center bg-[#008267] hover:bg-[#006b54]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin w-7 h-7" /> : 'CREATE ACCOUNT'}
                                </button>
                            </form>
                            <p className="text-center text-xs text-slate-400 px-6 font-medium leading-relaxed">
                                By signing up, you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;