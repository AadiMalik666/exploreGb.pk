
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

const BookingSuccess: React.FC = () => {
    const location = useLocation();
    const bookingRef = location.state?.bookingRef;

    if (!bookingRef) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-8">Your adventure to Gilgit-Baltistan is confirmed.</p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
                    <p className="text-xl font-mono font-bold text-gray-800">{bookingRef}</p>
                </div>

                <div className="space-y-3">
                    <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors">
                        <Download size={18} className="mr-2" /> Download Ticket
                    </button>
                    <Link 
                        to="/dashboard" 
                        className="w-full bg-white text-gray-700 border border-gray-200 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        Go to Dashboard <ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
