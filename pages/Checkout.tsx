
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { addBooking } from '../services/mockData';
import { PaymentService } from '../services/paymentService';

interface CheckoutState {
    tour: any;
    seats: number;
    totalAmount: number;
}

const Checkout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as CheckoutState;

    // Payment Intent State
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    
    // Form State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    
    // Processing State
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!state) {
            navigate('/tours');
            return;
        }

        // 1. Initialize Payment Intent on Mount
        const initPayment = async () => {
            try {
                const intent = await PaymentService.createPaymentIntent(state.totalAmount);
                setClientSecret(intent.clientSecret);
            } catch (err) {
                setError("Failed to initialize payment system. Please try refreshing.");
            } finally {
                setIsInitializing(false);
            }
        };

        initPayment();
    }, [state, navigate]);

    if (!state) return null;

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        }
        return value;
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientSecret) return;
        
        setIsProcessing(true);
        setError(null);

        try {
            // 2. Confirm Payment using the Client Secret and Form Data
            const result = await PaymentService.confirmPayment(clientSecret, {
                cardNumber,
                expiry,
                cvc,
                name
            });

            if (result.status === 'succeeded') {
                // 3. Payment Succeeded - Create Booking Record
                addBooking({
                    tour_id: state.tour.id,
                    tour_title: state.tour.title,
                    seats: state.seats,
                    total_amount: state.totalAmount
                });

                navigate('/booking-success', { 
                    state: { 
                        bookingRef: result.transactionId.toUpperCase() 
                    } 
                });
            }

        } catch (err: any) {
            setError(err.message || "Payment failed. Please check your details.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Tour Details
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Payment Form */}
                    <div className="flex-1 order-2 lg:order-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                            <div className="bg-gray-900 text-white p-6">
                                <h2 className="text-xl font-bold flex items-center">
                                    <Lock size={20} className="mr-2 text-emerald-400" /> Secure Checkout
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Encrypted payment via Stripe</p>
                            </div>
                            
                            <div className="p-8">
                                {isInitializing ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Loader2 size={32} className="animate-spin mb-2 text-primary" />
                                        <p>Connecting to secure gateway...</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePayment} className="space-y-6">
                                        {error && (
                                            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm flex items-start">
                                                <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                                {error}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                                                placeholder="Name on card"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
                                            <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                                                <div className="flex items-center bg-white px-3 border-b border-gray-100">
                                                    <CreditCard size={20} className="text-gray-400 mr-3" />
                                                    <input 
                                                        type="text" 
                                                        required
                                                        maxLength={19}
                                                        className="w-full py-3 outline-none font-medium text-gray-800 placeholder-gray-400"
                                                        placeholder="Card number"
                                                        value={cardNumber}
                                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                    />
                                                </div>
                                                <div className="flex bg-gray-50">
                                                    <input 
                                                        type="text" 
                                                        required
                                                        maxLength={5}
                                                        className="w-1/2 px-4 py-3 bg-transparent outline-none border-r border-gray-200 text-gray-800 placeholder-gray-400"
                                                        placeholder="MM/YY"
                                                        value={expiry}
                                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        required
                                                        maxLength={3}
                                                        className="w-1/2 px-4 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                                                        placeholder="CVC"
                                                        value={cvc}
                                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button 
                                                type="submit" 
                                                disabled={isProcessing}
                                                className={`w-full bg-primary hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center ${isProcessing ? 'opacity-80 cursor-not-allowed' : ''}`}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 size={20} className="animate-spin mr-2" /> Processing...
                                                    </>
                                                ) : (
                                                    `Pay $${state.totalAmount.toLocaleString()}`
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                                            <ShieldCheck size={12} />
                                            <span>Your transaction is secured with 256-bit SSL encryption.</span>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-96 order-1 lg:order-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                            
                            <div className="flex gap-4 mb-6">
                                <img 
                                    src={state.tour.image} 
                                    alt={state.tour.title} 
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{state.tour.title}</h4>
                                    <p className="text-gray-500 text-xs mt-1">{state.tour.duration_days} Days • {state.tour.location}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Price per person</span>
                                    <span>${state.tour.price}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Travelers</span>
                                    <span>x {state.seats}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Taxes & Fees</span>
                                    <span>$0.00</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mt-4">
                                <span className="font-bold text-gray-900">Total Due</span>
                                <span className="text-2xl font-bold text-primary">${state.totalAmount.toLocaleString()}</span>
                            </div>
                            
                            <div className="mt-6 bg-blue-50 text-blue-700 text-xs p-3 rounded-lg">
                                <span className="font-bold block mb-1">Cancellation Policy</span>
                                Free cancellation up to 48 hours before the trip start date.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
