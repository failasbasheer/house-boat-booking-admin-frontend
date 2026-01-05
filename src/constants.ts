
import { HouseboatTier } from './types';

export const WHATSAPP_NUMBER = "919876543210";
export const WHATSAPP_MESSAGE = "Hi, I'm interested in checking availability for a houseboat experience.";
export const CONTACT_PHONE = "+91 98765 43210";
export const CONTACT_EMAIL = "hello@alleppeyhouseboats.com";

export const PREMIUM_TIER: HouseboatTier = {
    id: 'premium',
    name: 'Premium Houseboats Alleppey',
    seoTitle: 'Best Premium Houseboat Booking in Alleppey 2025',
    tagline: 'Premium Excellence',
    shortPitch: 'Spacious AC suites, gourmet dining & personalized service.',
    duration: 'Overnight Cruise',
    guestCapacity: '2 - 6 Guests',
    secondaryDescription: 'Immerse yourself in the tranquility of the Alleppey backwaters. This vessel is designed not just for travel, but for comfort. Every detail invites you to slow down and enjoy the journey.',
    badges: ['Premium Class', 'Guest Favorite', 'Govt. Authorized'],
    amenitiesList: [
        { icon: 'Wind', title: 'Climate Control', desc: 'AC Bedrooms (9PM - 6AM)' },
        { icon: 'Utensils', title: 'Full Board Dining', desc: 'Lunch, Dinner & Breakfast' },
        { icon: 'Sun', title: 'Private Sundeck', desc: 'Open-air viewing area' },
        { icon: 'Wifi', title: 'Connectivity', desc: 'Complimentary Wi-Fi' },
        { icon: 'Droplets', title: 'En-suite', desc: 'Private attached bathrooms' },
        { icon: 'Coffee', title: 'Hospitality', desc: 'Welcome drink & tea service' }
    ],
    description:
        'Our premium houseboats offer an elevated Kerala backwater experience with spacious AC suites, gourmet dining, enhanced decks, and a dedicated 4-member crew. Ideal for discerning travelers, families, and special occasions.',

    highlights: [
        'Spacious AC Suites',
        'Gourmet Dining',
        'Private Balconies',
        'Premium Service'
    ],

    features: [
        'Large Air-Conditioned Suites (24/7)',
        'King-Size Beds with Premium Linens',
        'Attached Luxury Bathrooms',
        'Private Balconies Overlooking Backwaters',
        'Multi-Cuisine Gourmet Dining',
        'Premium Upper Deck Lounge Seating',
        'High-Speed WiFi',
        'Entertainment System',
        'Mini-Bar & Premium Toiletries',
        'Bathrobes & Welcome Beverages',
        'Room Service for All Meals',
        'Special Celebration Arrangements'
    ],

    crew: {
        size: 4,
        roles: [
            'Experienced Captain',
            'Master Chef',
            'Dedicated Service Staff',
            'Cultural Guide / Host'
        ]
    },

    dining: {
        cuisineTypes: ['Kerala', 'Continental', 'Chinese'],
        customization: true,
        dietaryOptions: ['Vegetarian', 'Non-Vegetarian', 'Special Diets'],
        beverages: ['Welcome Drinks', 'Complimentary Snacks'],
        serviceStyle: 'Room Service + Dining Area'
    },

    deck: {
        type: 'Enhanced Premium Deck',
        usage: ['Sunset Cocktails', 'Relaxation', 'Dining'],
        seating: 'Lounge Seating'
    },

    amenities: [
        'WiFi & Charging Points',
        'Western Toilets & Hot Water',
        'Clean Bed Linens & Towels',
        'Safety Equipment & First Aid Kit'
    ],

    services: [
        'Priority Booking Assistance',
        'Customized Itineraries',
        'Special Celebration Setup',
        '24/7 Concierge Support'
    ],



    journeyFlow: [
        '10:00 AM – Traditional Welcome with Drinks & Snacks',
        'Scenic Cruise through Canals & Coconut Groves',
        'Village Visits & Cultural Activities',
        'Freshly Prepared Gourmet Lunch',
        'Relaxation on Premium Upper Deck',
        'Evening Tea & Sunset Views',
        'Overnight Stay in AC Comfort',
        'Morning Bird Watching & Breakfast'
    ],

    bookingInfo: {
        confirmation: 'Instant',
        support: '24/7 Customer Support',
        paymentSecurity: [
            'SSL Secured',
            '100% Safe Payment',
            'Data Protected'
        ],
        cancellationPolicy: {
            freeCancellation: 'Up to 48 hours before check-in',
            partialRefund: '24–48 hours before check-in',
            noRefund: 'Same-day cancellation',
            weatherPolicy: 'Full refund for weather issues'
        }
    },

    trustSignals: [
        '25+ Premium Houseboats',
        '4.9/5 Average Rating',
        'Verified Premium Listings',
        'Instant Confirmation'
    ],

    stats: {
        rating: 4.9,
        reviews: 250,
        currentlyViewing: 25,
        boatsLeft: 7
    },

    reviews: [
        {
            name: 'Amit & Priya Sharma',
            location: 'Mumbai',
            tag: 'Anniversary Trip',
            text:
                'Absolutely worth the upgrade! Spacious suite, gourmet meals, and exceptional service. Perfect for celebrations.'
        },
        {
            name: 'Rachel Thompson',
            location: 'UK',
            tag: 'Solo Traveler',
            text:
                'Private balcony mornings were magical. Crew anticipated every need. Best decision of my Kerala trip.'
        },
        {
            name: 'Vivek & Family',
            location: 'Delhi',
            tag: 'Family Vacation',
            text:
                'Perfect for a family of 5. Spacious, comfortable, and amazing food.'
        }
    ],

    faqs: [
        {
            q: 'What makes premium houseboats different from deluxe?',
            a: 'Premium houseboats offer larger suites, private balconies, gourmet dining, enhanced decks, a 4-member crew, room service, and premium amenities compared to deluxe options.'
        },
        {
            q: 'What is included in premium houseboat booking?',
            a: 'AC suites, all gourmet meals, welcome drinks, 4-member crew, premium deck access, WiFi, room service, and safety equipment.'
        },
        {
            q: 'Is premium houseboat worth the extra cost?',
            a: 'Yes. The added space, dining quality, service level, and privacy justify the upgrade.'
        },
        {
            q: 'Can premium itineraries be customized?',
            a: 'Yes. Routes, meals, celebrations, and stay duration can be customized.'
        },
        {
            q: 'Best time to book premium houseboats?',
            a: 'October–March is ideal. Book 2–3 weeks in advance for best availability.'
        }
    ],

    pricing: {
        startingFrom: '₹12,000/night',
        currency: 'INR'
    },

    audience: [
        'Premium Travelers',
        'Families',
        'International Guests',
        'Special Occasions'
    ],

    availableCount: 25,
    imagePlaceholder: '/packages/premium.webp',
    gallery: [
        { src: '/packages/premium.webp', span: "col-span-2 row-span-2", label: "Premium Exterior" },
        { src: '/images/premium-interiors.webp', span: "col-span-1 row-span-1", label: "Luxury Lounge" },
        { src: '/collection/interior.jpg', span: "col-span-1 row-span-2", label: "Master Suite" },
        { src: '/images/onboard-dining.webp', span: "col-span-1 row-span-1", label: "Dining Experience" }
    ]
};


export const LUXURY_TIER: HouseboatTier = {
    id: 'luxury',
    name: 'Luxury Houseboats Alleppey',
    seoTitle: 'Luxury Houseboat Experience in Alleppey',
    tagline: 'Ultimate Backwater Opulence',
    shortPitch: 'Presidential suites, personal butler & five-star service.',
    duration: 'Overnight Cruise',
    guestCapacity: '2 - 10 Guests',
    secondaryDescription: 'Experience the pinnacle of luxury. With a personal butler, infinity pool deck, and presidential suites, this houseboat offers a floating five-star hotel experience unlike any other.',
    badges: ['Luxury Class', 'Elite Choice', 'Butler Service'],
    amenitiesList: [
        { icon: 'Wind', title: 'Central AC', desc: '24/7 Climate Control' },
        { icon: 'Utensils', title: 'Gourmet Dining', desc: 'Chef-prepared meals' },
        { icon: 'Sun', title: 'Infinity Deck', desc: 'Private pool & lounge' },
        { icon: 'Wifi', title: 'High-Speed Wifi', desc: 'Starlink Connectivity' },
        { icon: 'Droplets', title: 'Jacuzzi', desc: 'In-suite private jacuzzi' },
        { icon: 'Coffee', title: 'Butler Service', desc: '24/7 Personal Attention' }
    ],
    description:
        'Luxury houseboats redefine opulence on Kerala’s backwaters with presidential suites, infinity pool decks, personal butler service, fine dining, spa & entertainment facilities. Built for elite, privacy-focused guests.',

    highlights: [
        'Presidential Suites',
        'Personal Butler',
        'Infinity Pool Deck',
        '5-Star Service'
    ],

    features: [
        'Presidential Suites with Separate Living Areas',
        'Marble Bathrooms with Jacuzzi',
        'Walk-In Closets',
        'Floor-to-Ceiling Panoramic Windows',
        'Personal Butler Service (24/7)',
        'Private Infinity Pool Deck',
        'Executive Chef & Fine Dining',
        'Private Cinema & Entertainment Lounge',
        'Business Center',
        'High-Speed Satellite Internet',
        'Five-Star Hotel Amenities'
    ],

    crew: {
        size: 5,
        roles: [
            'Senior Captain',
            'Executive Chef',
            'Personal Butler',
            'Luxury Service Staff',
            'Wellness / Experience Manager'
        ]
    },

    deck: {
        type: 'Infinity Pool Deck',
        usage: ['Sunbathing', 'Private Parties', 'Stargazing'],
        seating: 'Luxury Loungers & Daybeds'
    },

    dining: {
        cuisineTypes: [
            'Michelin-Inspired Fine Dining',
            'Molecular Gastronomy',
            'Chef’s Tasting Menus'
        ],
        wineSommelier: true,
        privateDining: true
    },

    wellness: [
        'Onboard Spa Suite',
        'Ayurvedic Treatments',
        'Massage Therapists',
        'Private Yoga & Meditation'
    ],

    entertainment: [
        'Private Cinema',
        'Gaming Lounge',
        'Library'
    ],

    exclusiveServices: [
        'Helicopter Transfers',
        'Luxury Car Pickup',
        'Professional Photography',
        'Custom Event Planning',
        'VIP Concierge Access',
        '24/7 Medical Support'
    ],

    journeyFlow: [
        '12:00 PM – Presidential Welcome with Champagne',
        'Cruising through Exclusive, Quiet Routes',
        'Gourmet Lunch prepared by Executive Chef',
        'Infinity Pool Deck Relaxation',
        'High Tea with Sunset Views',
        'Private Cinema Experience / Spa',
        'Candlelight Dinner with Butler Service',
        'Overnight in Presidential Suite'
    ],

    bookingInfo: {
        confirmation: 'Instant (subject to customization)',
        bookingAdvice: '4–6 weeks in advance',
        peakSeasonAdvice: '2+ months recommended'
    },

    trustSignals: [
        '15+ Luxury Houseboats',
        '4.9/5 Average Rating',
        'Elite Verified Listings',
        'VIP Concierge Support'
    ],

    stats: {
        rating: 4.9,
        reviews: 150,
        currentlyViewing: 31,
        boatsLeft: 7
    },

    reviews: [
        {
            name: 'Rajesh & Meera Gupta',
            location: 'Dubai',
            tag: 'Anniversary',
            text:
                'More luxurious than 5-star hotels. Butler service and infinity pool were unreal.'
        },
        {
            name: 'James & Sarah Wilson',
            location: 'London',
            tag: 'Luxury Honeymoon',
            text:
                'Michelin-level cuisine, spa on water, total privacy. Once-in-a-lifetime experience.'
        },
        {
            name: 'Arjun Kapoor Family',
            location: 'Mumbai',
            tag: 'Corporate Retreat',
            text:
                'Hosted board meetings onboard. World-class facilities and service.'
        }
    ],

    faqs: [
        {
            q: 'What makes luxury houseboats different from premium?',
            a: 'Luxury houseboats include presidential suites, personal butler service, infinity pool decks, onboard spa, private cinema, executive chefs, and five-star concierge services.'
        },
        {
            q: 'Are luxury houseboats suitable for special occasions?',
            a: 'Yes. Perfect for luxury honeymoons, VIP events, elite corporate retreats, and milestone celebrations.'
        },
        {
            q: 'What dining experiences are available?',
            a: 'Fine dining, molecular gastronomy, wine pairing, private poolside dinners, and chef’s table experiences.'
        },
        {
            q: 'How early should luxury houseboats be booked?',
            a: '4–6 weeks in advance. Peak season may require 2+ months.'
        },
        {
            q: 'Can luxury itineraries be fully customized?',
            a: 'Yes. Dining, wellness, routes, events, and onboard experiences are fully customizable.'
        }
    ],

    pricing: {
        startingFrom: '₹18,000/night',
        currency: 'INR'
    },

    audience: [
        'Luxury Seekers',
        'VIP Guests',
        'Celebrities',
        'Corporate Leaders'
    ],

    availableCount: 15,
    imagePlaceholder: '/packages/luxury.webp',
    gallery: [
        { src: '/packages/luxury.webp', span: "col-span-2 row-span-2", label: "Grand Exterior" },
        { src: '/images/luxury-houseboat-exterior.webp', span: "col-span-1 row-span-1", label: "Infinity Deck" },
        { src: '/collection/interior2.jpg', span: "col-span-1 row-span-2", label: "Presidential Suite" },
        { src: '/images/serene-waters.webp', span: "col-span-1 row-span-1", label: "Private Views" }
    ]
};

export const DELUXE_TIER: HouseboatTier = {
    id: 'deluxe',
    name: 'Deluxe Houseboats Alleppey',
    seoTitle: 'Deluxe Houseboat Booking in Alleppey – Best Value Experience',
    tagline: 'Best Value Experience',
    shortPitch: 'Premium comfort meets authentic Kerala charm.',
    duration: 'Overnight Cruise',
    guestCapacity: '2 - 8 Guests',
    secondaryDescription: 'A perfect blend of tradition and comfort. Enjoy the authentic Kerala houseboat experience with modern amenities and a friendly crew dedicated to your service.',
    badges: ['Deluxe Class', 'Best Value', 'Family Friendly'],
    amenitiesList: [
        { icon: 'Wind', title: 'AC Bedroom', desc: '9PM - 6AM Cooling' },
        { icon: 'Utensils', title: 'Traditional Food', desc: 'Kerala Style Meals' },
        { icon: 'Sun', title: 'Upper Deck', desc: 'Scenic viewing area' },
        { icon: 'Wifi', title: 'Free Wifi', desc: 'Basic Connectivity' },
        { icon: 'Droplets', title: 'Attached Bath', desc: 'Clean & Hygienic' },
        { icon: 'Coffee', title: 'Tea & Snacks', desc: 'Evening refreshments' }
    ],
    description:
        'Our deluxe houseboats offer the perfect blend of comfort and authentic Kerala experience with modern amenities, traditional charm, and memorable backwater journeys. Ideal for families, couples, and senior travelers.',

    highlights: [
        'AC Bedrooms',
        'Traditional Meals',
        'Sunset Cruise',
        'Professional Crew'
    ],

    features: [
        'Well-Appointed Air-Conditioned Cabins (Night)',
        'Comfortable Beds with Quality Linens',
        'Attached Bathrooms',
        'Traditional Kerala Interior Design',
        'All Meals Included (Breakfast, Lunch, Dinner, Tea & Snacks)',
        'Authentic Kerala Cuisine with Fresh Ingredients',
        'Spacious Upper Deck Seating',
        'Panoramic Backwater Views',
        'Village Visits & Cultural Stops',
        'Sunset Cruise Experience',
        'WiFi & Entertainment System',
        'Basic Toiletries & Drinking Water',
        'Complimentary Welcome Refreshments',
        'Safety Equipment & First Aid Kit'
    ],

    crew: {
        size: 3,
        roles: [
            'Experienced Captain',
            'Onboard Chef',
            'Service Staff'
        ]
    },

    dining: {
        cuisineTypes: ['Traditional Kerala'],
        includes: [
            'Breakfast',
            'Lunch',
            'Dinner',
            'Evening Tea & Snacks'
        ],
        customization: true
    },

    deck: {
        type: 'Upper Deck',
        seating: 'Comfortable Seating',
        usage: ['Scenic Viewing', 'Dining', 'Sunset Relaxation']
    },



    startingPoint: {
        location: 'Alleppey Boat Jetty',
        access: [
            '53 km from Kochi',
            '159 km from Trivandrum'
        ]
    },

    journeyFlow: [
        '10:00 AM – Traditional Welcome with Coconut Water & Snacks',
        'Scenic Cruise through Canals & Coconut Groves',
        'Village Visits & Cultural Activities',
        'Freshly Prepared Traditional Kerala Lunch',
        'Relaxation on Upper Deck',
        'Evening Tea & Sunset Views',
        'Overnight Stay in AC Comfort',
        'Morning Bird Watching & Breakfast'
    ],

    bookingInfo: {
        confirmation: 'Instant',
        support: '24/7 Customer Support',
        paymentSecurity: [
            'SSL Secured',
            '100% Safe Payment',
            'Data Protected'
        ],
        cancellationPolicy: {
            freeCancellation: 'Up to 48 hours before check-in',
            partialRefund: '24–48 hours before check-in',
            noRefund: 'Same-day cancellation',
            weatherPolicy: 'Full refund for weather-related cancellations',
            refundTime: '5–7 business days'
        }
    },

    trustSignals: [
        '30+ Deluxe Houseboats',
        '4.8/5 Average Rating',
        '500+ Verified Reviews',
        'Instant Confirmation'
    ],

    stats: {
        rating: 4.8,
        reviews: 500,
        recommendationRate: '98%',
        fiveStarRate: '95%',
        currentlyViewing: 23,
        boatsLeft: 10
    },

    reviews: [
        {
            name: 'Rajesh & Family',
            location: 'Mumbai',
            tag: 'Family Stay',
            text:
                'Perfect deluxe experience. Comfortable AC rooms, amazing food, and professional crew. Kids loved the village visit.'
        },
        {
            name: 'Arjun & Priya',
            location: 'Bangalore',
            tag: 'Honeymoon',
            text:
                'Romantic and peaceful. Beautiful sunset views and delicious Kerala cuisine.'
        },
        {
            name: 'Sarah Johnson',
            location: 'UK',
            tag: 'International Guest',
            text:
                'Absolutely magical. Clean, comfortable houseboat and very helpful crew.'
        },
        {
            name: 'Meera & Group',
            location: 'Chennai',
            tag: 'Corporate Retreat',
            text:
                'Smooth booking, great amenities, and excellent service.'
        },
        {
            name: 'Vikram & Parents',
            location: 'Pune',
            tag: 'Senior Friendly',
            text:
                'Slow pace, respectful crew, and very comfortable for elderly travelers.'
        }
    ],

    faqs: [
        {
            q: 'What is included in deluxe houseboat booking?',
            a: 'AC accommodation, all meals, professional crew, full-day backwater cruise, village visits, safety equipment, WiFi, and traditional welcome.'
        },
        {
            q: 'Is deluxe houseboat suitable for families with children?',
            a: 'Yes. Deluxe houseboats are child-safe, family-friendly, and include kid-friendly meals and safety equipment.'
        },
        {
            q: 'What are the available capacity options?',
            a: 'Deluxe houseboats are available for 2, 4, and 6 adults with family and group-friendly layouts.'
        },
        {
            q: 'What is the best time to book deluxe houseboats?',
            a: 'October to March is ideal. December to February is peak season and requires advance booking.'
        },
        {
            q: 'Can the itinerary be customized?',
            a: 'Yes. Extended stays, special village visits, photography sessions, and meal preferences can be customized.'
        },
        {
            q: 'What is the cancellation policy?',
            a: 'Free cancellation up to 48 hours before check-in. Partial refund for 24–48 hours. No refund for same-day cancellation.'
        }
    ],

    pricing: {
        startingFrom: '₹8,500/night',
        adultsOptions: [2, 4, 6],
        bookingAdvice: 'Book 1–2 weeks in advance',
        currency: 'INR'
    },

    audience: [
        'Families',
        'Couples',
        'Senior Travelers',
        'Budget-Conscious Guests'
    ],

    availableCount: 30,
    imagePlaceholder: '/packages/deluxe.webp',
    gallery: [
        { src: '/packages/deluxe.webp', span: "col-span-2 row-span-2", label: "Houseboat View" },
        { src: '/collection/chair.jpg', span: "col-span-1 row-span-1", label: "Comfortable Seating" },
        { src: '/images/backwater-sunset.webp', span: "col-span-1 row-span-2", label: "Sunset Deck" },
        { src: '/collection/IMG-20250217-WA0121 (3).jpg', span: "col-span-1 row-span-1", label: "Cozy Bedroom" }
    ]
};

export const HONEYMOON_TIER: HouseboatTier = {
    id: 'romantic',
    name: 'Romantic Houseboats Alleppey',
    seoTitle: 'Romantic Honeymoon Houseboat Packages in Alleppey',
    tagline: 'Now Available',
    shortPitch: 'Intimate privacy, candlelight dinners & flower decorations.',
    description: 'Designed exclusively for couples, our romantic houseboats offer complete privacy, romantic candlelight dinners, flower bed decorations, and a serene journey through the most secluded canals.',
    duration: '21 Hours',
    guestCapacity: '2 Guests',
    secondaryDescription: 'Celebrate your love in the most romantic setting. Private decks, candlelight dinners, and flower decorations create an unforgettable atmosphere for honeymooners.',
    badges: ['Honeymoon Special', 'Privacy Guaranteed', 'Romantic Choice'],
    amenitiesList: [
        { icon: 'Wind', title: 'Private AC', desc: 'Cozy Bedroom' },
        { icon: 'Utensils', title: 'Candlelight Dinner', desc: 'Romantic Setting' },
        { icon: 'Sun', title: 'Private Deck', desc: 'Exclusively for two' },
        { icon: 'Wifi', title: 'Connectivity', desc: 'Stay connected' },
        { icon: 'Droplets', title: 'Modern Bath', desc: 'Hot water available' },
        { icon: 'Coffee', title: 'Welcome Cake', desc: 'Honeymoon Special' }
    ],

    highlights: [
        'Complete Privacy',
        'Candlelight Dinner',
        'Flower Decoration',
        'Honeymoon Cake'
    ],

    features: [
        'Private AC Bedroom with Romantic Ambiance',
        'Flower Bed Decoration (First Night)',
        'Candlelight Dinner on Upper Deck',
        'Honeymoon Cake & Fruit Basket',
        'Private Upper Deck for Couples',
        'All Meals Included (Customized Menu)',
        'Music System for Romantic Evenings',
        'Privacy-Focused Crew Service',
        'Sunset Cruise through Quiet Canals',
        'Attached Modern Bathroom',
        '24/7 Air Conditioning Option',
        'Welcome Garland & Drink'
    ],

    crew: {
        size: 3,
        roles: [
            'Experienced Captain',
            'Private Chef',
            'Service Associate'
        ]
    },

    dining: {
        cuisineTypes: ['Kerala', 'North Indian', 'Continental'],
        includes: ['Welcome Drink', 'Lunch', 'Evening Tea', 'Candlelight Dinner', 'Breakfast'],
        customization: true,
        privateDining: true
    },

    deck: {
        type: 'Private Upper Deck',
        seating: 'Daybeds & Lounge Chairs',
        usage: ['Sunbathing', 'Romantic Dinner', 'Stargazing']
    },



    journeyFlow: [
        '12:00 PM – Welcome with Flower Garlands & Tender Coconut',
        'Romantic Cruise through Narrow Canals',
        'Freshly Prepared Lunch on Open Deck',
        'Evening Tea with scenic sunset backdrop',
        'Candlelight Dinner under the stars',
        'Flower Bed Decoration reveal',
        'Overnight Stay in quiet privacy',
        'Morning Breakfast while cruising'
    ],

    bookingInfo: {
        confirmation: 'Instant',
        bookingAdvice: 'Book 1 month in advance for anniversaries/honeymoons'
    },

    trustSignals: [
        'Honeymoon Special',
        'Privacy Guaranteed',
        'Top Rated by Couples'
    ],

    stats: {
        rating: 4.9,
        reviews: 180,
        currentlyViewing: 12,
        boatsLeft: 3
    },

    reviews: [
        {
            name: 'Rohan & Aishwarya',
            location: 'Bangalore',
            tag: 'Honeymoon',
            text: 'The flower decoration and candlelight dinner were dreamy. The crew respected our privacy completely.'
        },
        {
            name: 'Chris & Emily',
            location: 'Australia',
            tag: 'Anniversary',
            text: 'Magical experience. The quiet canals at sunset were the highlight of our India trip.'
        }
    ],

    faqs: [
        {
            q: 'Is the houseboat private?',
            a: 'Yes, the entire houseboat is exclusively for the couple.'
        },
        {
            q: 'Can we customize the food?',
            a: 'Absolutely. The private chef will prepare meals according to your preferences.'
        },
        {
            q: 'Is there a candle light dinner?',
            a: 'Yes, a romantic candlelight dinner on the upper deck is included.'
        },
        {
            q: 'How safe is it at night?',
            a: 'Completely safe. The boat is docked in a secure location and crew is available 24/7 in their separate quarters.'
        }
    ],

    pricing: {
        startingFrom: '₹15,000/night',
        currency: 'INR'
    },

    audience: [
        'Honeymooners',
        'Couples',
        'Anniversaries'
    ],

    availableCount: 5,
    imagePlaceholder: '/packages/honeymoon.webp',
    gallery: [
        { src: '/packages/honeymoon.webp', span: "col-span-2 row-span-2", label: "Romantic Getaway" },
        { src: '/images/sunset.jpg', span: "col-span-1 row-span-1", label: "Golden Hour" },
        { src: '/collection/IMG-20250617-WA0019 (3).jpg', span: "col-span-1 row-span-2", label: "Candlelight Dinner" },
        { src: '/collection/IMG-20250617-WA0018 (3).jpg', span: "col-span-1 row-span-1", label: "Private Moment" }
    ]
};


