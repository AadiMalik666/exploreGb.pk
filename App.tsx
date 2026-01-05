
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AiAssistant from './components/AiAssistant';
import Loading from './components/Loading';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages for better performance on slow connections
const Home = lazy(() => import('./pages/Home'));
const Tours = lazy(() => import('./pages/Tours'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="flex-grow">
            <Suspense fallback={<Loading />}>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/tours/:slug" element={<TourDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                </Routes>
            </Suspense>
            </main>
            <footer className="bg-white border-t border-gray-200 py-12 mt-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">ExploreGB.pk</h3>
                            <p className="text-gray-500 max-w-xs leading-relaxed">
                                Experience the majestic beauty of Gilgit-Baltistan where adventure meets nature.
                                We promote sustainable and eco-friendly tourism in the North.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-gray-900">Destinations</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li>Hunza Valley</li>
                                <li>Skardu</li>
                                <li>Fairy Meadows</li>
                                <li>Khunjerab Pass</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-gray-900">Contact</h4>
                            <ul className="space-y-2 text-gray-500 text-sm">
                                <li>malikahad257@gmail.com</li>
                                <li>+92 318 384001</li>
                                <li>Islamabad, Pakistan</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm flex flex-col gap-2">
                        <p>&copy; {new Date().getFullYear()} ExploreGB.pk. All rights reserved.</p>
                        <p className="font-medium text-primary/80">Powered by Ahad Malik</p>
                    </div>
                </div>
            </footer>
            <AiAssistant />
            <AuthModal />
        </div>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;
