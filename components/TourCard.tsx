
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Tour } from '../types';
import { useAuth } from '../context/AuthContext';

interface TourCardProps {
    tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
    const navigate = useNavigate();
    const { isAuthenticated, openAuthModal } = useAuth();

    const handleViewDetails = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate(`/tours/${tour.slug}`);
        } else {
            openAuthModal(() => {
                navigate(`/tours/${tour.slug}`);
            });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden group cursor-pointer" onClick={handleViewDetails}>
                <img 
                    src={tour.image} 
                    alt={tour.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {tour.featured && (
                    <span className="absolute top-3 right-3 bg-accent text-white text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                        Featured
                    </span>
                )}
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-gray-500 text-sm">
                        <MapPin size={14} className="mr-1" />
                        {tour.location}
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm font-bold">
                        <Star size={14} className="mr-1 fill-current" />
                        {tour.rating} <span className="text-gray-400 font-normal ml-1">({tour.reviews_count})</span>
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-primary transition-colors" onClick={handleViewDetails}>{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{tour.description}</p>
                
                <div className="border-t pt-4 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">From</span>
                        <span className="text-lg font-bold text-primary">${tour.price.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={handleViewDetails}
                        className="bg-gray-900 hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
