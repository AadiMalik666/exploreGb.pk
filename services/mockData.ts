
import { Tour, Booking, Review, Inquiry, Destination } from '../types';

export interface HeroMedia {
    id: string;
    url: string;
    type: 'image' | 'video';
    section?: 'hero' | 'about' | 'gallery';
}

// Internal store that survives throughout the session
let HERO_MEDIA_STORE: HeroMedia[] = [
    { id: '1', url: "https://images.unsplash.com/photo-1548320936-c6a3e041551e?auto=format&fit=crop&w=1920&q=80", type: 'image', section: 'hero' },
    { id: '2', url: "https://www.w3schools.com/html/mov_bbb.mp4", type: 'video', section: 'hero' },
    { id: '3', url: "https://images.unsplash.com/photo-1627896610402-8a8b8e6c4c5b?auto=format&fit=crop&w=1920&q=80", type: 'image', section: 'hero' }
];

export const getHeroMedia = () => [...HERO_MEDIA_STORE];
export const updateHeroMedia = (media: HeroMedia[]) => { 
    HERO_MEDIA_STORE = [...media]; 
    return HERO_MEDIA_STORE; 
};

export let MOCK_USERS = [
    { email: 'admin@exploregb.pk', phone: '0318384001', name: 'Ahad Malik', role: 'admin', joined: '2023-10-12' },
    { email: 'user@example.com', phone: '03001234567', name: 'John Doe', role: 'user', joined: '2024-01-05' },
    { email: 'sarah.khan@travel.pk', phone: '03219876543', name: 'Sarah Khan', role: 'user', joined: '2024-03-15' }
];

export const getAllUsers = () => [...MOCK_USERS];

// Fix: Add checkUserExists
export const checkUserExists = (identifier: string) => {
    return MOCK_USERS.some(u => u.email === identifier || u.phone === identifier);
};

// Fix: Add registerUser
export const registerUser = (identifier: string, name: string) => {
    const newUser = {
        email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
        phone: !identifier.includes('@') ? identifier : '',
        name: name,
        role: 'user' as const,
        joined: new Date().toISOString().split('T')[0]
    };
    MOCK_USERS = [...MOCK_USERS, newUser];
    return newUser;
};

export let MOCK_DESTINATIONS: Destination[] = [
    { 
        id: 1, 
        name: "Hunza", 
        description: "Known as the 'Heaven on Earth', Hunza is a mountainous valley in the northern part of the Gilgit-Baltistan region of Pakistan. It is home to ancient forts and turquoise lakes.",
        image: "https://images.unsplash.com/photo-1548320936-c6a3e041551e?auto=crop&w=800&q=80", 
        services: ["Luxury SUV Transport", "Local Tour Guide", "Altit Fort Access", "Breakfast Included"],
        visitPlaces: ["Altit Fort", "Baltit Fort", "Attabad Lake", "Passu Cones", "Eagle's Nest"],
        gallery: [
            { url: "https://images.unsplash.com/photo-1548320936-c6a3e041551e?auto=format&fit=crop&w=800&q=80", type: 'image' },
            { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", type: 'image' }
        ]
    },
    { 
        id: 2, 
        name: "Skardu", 
        description: "Skardu is the central valley of Baltistan and the gateway to some of the highest peaks in the world, including K2. It offers a unique desert-mountain landscape.",
        image: "https://images.unsplash.com/photo-1623150954026-3e0964987593?auto=format&fit=crop&w=800&q=80", 
        services: ["4x4 Deosai Safari", "Shangrila Resort Entry", "Cold Desert Camping", "Stargazing Kit"],
        visitPlaces: ["Shangrila Resort", "Upper Kachura Lake", "Deosai National Park", "Katpana Desert"],
        gallery: [
            { url: "https://images.unsplash.com/photo-1623150954026-3e0964987593?auto=format&fit=crop&w=800&q=80", type: 'image' }
        ]
    }
];

export const getDestinations = () => [...MOCK_DESTINATIONS];

export const addDestination = (data: Omit<Destination, 'id'>) => {
    const newDest = { ...data, id: Date.now() };
    MOCK_DESTINATIONS = [newDest, ...MOCK_DESTINATIONS];
    return newDest;
};

export const updateDestination = (id: number, data: Partial<Destination>) => {
    const idx = MOCK_DESTINATIONS.findIndex(d => d.id === id);
    if (idx !== -1) {
        MOCK_DESTINATIONS[idx] = { ...MOCK_DESTINATIONS[idx], ...data };
        return MOCK_DESTINATIONS[idx];
    }
    return null;
};

export let MOCK_TOURS: Tour[] = [
    {
        id: 1,
        destinationId: 1,
        title: "Hunza Valley: 7-Day Luxury Plan",
        slug: "hunza-luxury-7",
        description: "Witness the golden hues of Hunza. Visit Altit & Baltit Forts, Attabad Lake, and the majestic Rakaposhi View Point.",
        price: 950.00,
        capacity: 10,
        available_seats: 10,
        duration_days: 7,
        location: "Hunza",
        start_date: "2024-10-15",
        featured: true,
        image: "https://images.unsplash.com/photo-1548320936-c6a3e041551e?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviews_count: 342,
        category: 'Luxury',
        services: ["Luxury SUV", "Guided Tours", "All Meals"]
    },
    {
        id: 2,
        destinationId: 2,
        title: "Skardu & Deosai: 10-Day Expedition",
        slug: "skardu-deosai-10",
        description: "Explore the land of giants. Deosai Plains, Shangrila Resort, and the cold desert of Skardu.",
        price: 1250.00,
        capacity: 12,
        available_seats: 8,
        duration_days: 10,
        location: "Skardu",
        start_date: "2024-07-10",
        featured: true,
        image: "https://images.unsplash.com/photo-1623150954026-3e0964987593?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviews_count: 215,
        category: 'Premium',
        services: ["4x4 Jeep", "Camping Gear", "Local Chef"]
    }
];

export const getTours = () => [...MOCK_TOURS];

export let MOCK_INQUIRIES: Inquiry[] = [
    { id: 1, userName: "Ahad Malik", email: "aadimalik226@gmail.com", destination: "Custom Skardu Honeymoon", budget: "2000", notes: "Need a private cottage near Shangrila.", status: 'new', date: "2024-05-20" }
];

// Fix: Add addInquiry
export const addInquiry = (data: Omit<Inquiry, 'id' | 'status' | 'date'>) => {
    const inquiry: Inquiry = {
        ...data,
        id: Date.now(),
        status: 'new',
        date: new Date().toISOString().split('T')[0]
    };
    MOCK_INQUIRIES = [inquiry, ...MOCK_INQUIRIES];
    return inquiry;
};

export const addTour = (data: any) => {
    const tour: Tour = { 
        ...data, 
        id: Date.now(), 
        slug: data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), 
        reviews_count: 0, 
        rating: 5.0, 
        available_seats: data.capacity || 20,
        featured: data.featured || false,
        services: data.services || []
    };
    MOCK_TOURS = [tour, ...MOCK_TOURS];
    return tour;
};

export const updateTour = (id: number, data: any) => {
    const idx = MOCK_TOURS.findIndex(t => t.id === id);
    if (idx !== -1) { 
        MOCK_TOURS[idx] = { ...MOCK_TOURS[idx], ...data }; 
        return MOCK_TOURS[idx]; 
    }
    return null;
};

export const deleteTour = (id: number) => {
    const idx = MOCK_TOURS.findIndex(t => t.id === id);
    if (idx !== -1) { 
        MOCK_TOURS.splice(idx, 1); 
        MOCK_TOURS = [...MOCK_TOURS];
        return true; 
    }
    return false;
};

// Fix: Add MOCK_REVIEWS and related functions
export let MOCK_REVIEWS: Review[] = [
    { id: 1, tourId: 1, userName: "Sarah Khan", rating: 5, comment: "Amazing experience! The views were breathtaking.", date: "2024-04-15" },
    { id: 2, tourId: 1, userName: "John Doe", rating: 4, comment: "Great tour, very well organized.", date: "2024-05-10" }
];

export const getReviewsByTourId = (tourId: number) => MOCK_REVIEWS.filter(r => r.tourId === tourId);

export const addReview = (data: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
        ...data,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
    };
    MOCK_REVIEWS = [review, ...MOCK_REVIEWS];
    return review;
};

// Fix: Add MOCK_BOOKINGS and related function
export let MOCK_BOOKINGS: Booking[] = [];

export const addBooking = (data: Omit<Booking, 'id' | 'status' | 'date'>) => {
    const booking: Booking = {
        ...data,
        id: Date.now(),
        status: 'confirmed',
        date: new Date().toISOString().split('T')[0]
    };
    MOCK_BOOKINGS = [booking, ...MOCK_BOOKINGS];
    return booking;
};
