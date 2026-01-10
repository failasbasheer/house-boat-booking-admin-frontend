export interface Feature {
    _id: string;
    name: string;
    category: 'highlight' | 'service' | 'audience' | 'crew_role' | 'safety' | 'accommodation' | 'dining' | 'wellness' | 'entertainment' | 'policy' | 'other';
}

export interface HouseboatTier {
    id: string;
    name: string;
    seoTitle: string;
    tagline: string;
    shortPitch: string;
    duration: string;
    guestCapacity: string;
    secondaryDescription: string;

    amenitiesList: { icon: string; title: string; desc: string }[];
    description: string;
    highlights: string[];
    features: string[];
    pricing?: {
        startingFrom?: string | number; // Legacy support
        minPrice?: number;
        maxPrice?: number;
        currency: string;
        adultsOptions?: number[];
        bookingAdvice?: string;
    };
    gallery: {
        src: string;
        label?: string;
        span?: string;
    }[];
    heroImage?: string;
    imagePlaceholder?: string;
    priceEstimate?: string;
    faqs?: any[];
    startingPoint?: any;
    bookingInfo?: any;
    trustSignals?: any[];
    stats?: any;
    reviews?: any[];
    audience?: any[];
    availableCount?: number;
    crew?: any;
    dining?: any;
    deck?: any;
    amenities?: string[];
    services?: string[];

    journeyFlow?: string[];
    wellness?: string[];
    entertainment?: string[];
    policies?: {
        smoking: string;
        pets: string;
        children: string;
        alcohol: string;
    };
    exclusiveServices?: string[];
}

export interface GalleryImage {
    url: string;
    label?: string;
    order: number;
    span?: string;
}

export interface Amenity {
    _id: string;
    name: string;
    icon: string;
    category?: string;
}







export interface FAQ {
    question: string;
    answer: string;
}

export interface Houseboat {
    _id?: string;
    name: string;
    slug: string;
    category_id: any; // Populated object or string ID
    status: 'active' | 'maintenance' | 'decommissioned';
    shared_package_available?: boolean;
    // structured price override

    bedrooms: number;
    capacity_adults: number;
    capacity_children?: number;
    has_ac: boolean;
    cruise_hours?: number;
    images: {
        hero: string;
        exterior: string;
        interior: string;
        bedroom: string;
        dining?: string;
        bathroom?: string;
        extra1?: string;
        extra2?: string;
        extra3?: string;
    };
    // Rich Content
    tagline?: string;
    shortPitch?: string;
    description?: string;
    secondaryDescription?: string;


    // Rich Features
    crew?: {
        size: number;
        roles: string[];
    };
    dining?: {
        cuisineTypes: string[];
        isPrivate?: boolean;
        wineSommelier?: boolean;
    };
    deck?: {
        type: string;
        seating?: string;
    };
    journeyFlow?: string[];


    // Master Data
    amenities: string[];
    features: string[];
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    // Legacy/Optional for compatibility
    heroImage?: string;
    galleryImages?: any[];
    highlights?: string[];
}

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
}

export interface Category {
    _id: string;
    id: string;
    slug: string;
    type?: 'category' | 'package';
    display_name: string;
    base_price: number;
    sortOrder?: number;
    is_active: boolean;
    fleet_size?: number;
    whatsappTemplate?: string;

    // Rich Content
    tagline?: string;
    duration?: string;
    guestCapacity?: string;
    secondaryDescription?: string;
    description?: string;
    availableCount?: number;
    imagePlaceholder?: string;
    amenitiesList?: { title: string; desc: string; icon?: string }[];

    // Package Specific
    itinerary?: { day?: number; title: string; activity: string }[];
    inclusions?: string[];
    exclusions?: string[];

    stats?: { rating: number };
    reviews?: { name: string; location: string; text: string }[];
    priceDisplay?: string;
    isHero?: boolean;
}

export interface PricingPlan {
    title: string;
    duration: string;
    description: string;
    includes: string[];
    priceEstimate: string;
    bestFor: string;
}

export interface Testimonial {
    id: number;
    text: string;
    author: string;
    location: string;
}

export interface FAQCategory {
    title: string;
    items: {
        question: string;
        answer: string | string[];
    }[];
}
