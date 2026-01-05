
export interface Destination {
    id: number;
    name: string;
    description: string;
    image: string;
    services: string[];
    visitPlaces: string[]; // List of specific spots to visit
    gallery: { url: string; type: 'image' | 'video' }[];
}

export interface Tour {
    id: number;
    destinationId: number;
    title: string;
    slug: string;
    description: string;
    price: number;
    capacity: number;
    available_seats: number;
    duration_days: number;
    location: string;
    start_date: string; // YYYY-MM-DD
    featured: boolean;
    image: string;
    video?: string;
    rating: number;
    reviews_count: number;
    category: 'Standard' | 'Premium' | 'Luxury';
    services?: string[]; // Added to allow custom services per tour plan
}

export interface Booking {
    id: number;
    tour_id: number;
    tour_title: string;
    seats: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    date: string;
}

export interface Inquiry {
    id: number;
    userName: string;
    email: string;
    destination: string;
    budget: string;
    notes: string;
    status: 'new' | 'responded' | 'archived';
    date: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    sources?: { title: string; uri: string }[];
}

export interface Review {
    id: number;
    tourId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}
