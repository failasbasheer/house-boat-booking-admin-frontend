"use client";

import React, { useEffect, useRef, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowLeft, Save, Edit2
} from 'lucide-react';
import Image from 'next/image';
import { HouseboatAPI } from '@/services/api';
import { getImageUrl } from '@/lib/constants';
import { Houseboat, HouseboatTier } from '@/types';

// Register plugins safely
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Editable Component
const EditableText = ({
    value,
    onChange,
    className,
    tag = "div",
    multiline = false
}: {
    value: string | number,
    onChange: (val: string) => void,
    className?: string,
    tag?: string,
    multiline?: boolean
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // Sync local value when prop changes
    useEffect(() => setLocalValue(value), [value]);

    const handleBlur = () => {
        setIsEditing(false);
        onChange(localValue.toString());
    };

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    autoFocus
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    className={`bg-white/90 text-forest-900 p-2 rounded border border-accent w-full outline-none font-sans ${className}`}
                    rows={4}
                />
            );
        }
        return (
            <input
                autoFocus
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                className={`bg-white/90 text-forest-900 px-2 py-1 rounded border border-accent min-w-[200px] outline-none font-serif ${className}`}
            />
        );
    }

    return React.createElement(tag, {
        className: `${className} cursor-pointer hover:bg-white/10 hover:outline hover:outline-1 hover:outline-dashed hover:outline-accent/50 rounded transition-all relative group`,
        onClick: () => setIsEditing(true),
        title: "Click to edit"
    }, [
        <span key="content">{value}</span>,
        <Edit2 key="icon" className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 text-accent bg-white rounded-full p-0.5" />
    ]);
};

interface Props {
    params: { id: string };
}

export default function HouseboatPackagePage({ params }: Props) {
    const router = useRouter();
    const [tier, setTier] = useState<HouseboatTier | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [original, setOriginal] = useState<Houseboat | null>(null);

    const containerRef = useRef(null);
    const heroImageRef = useRef(null);

    // Booking State
    // Booking state removed (unused)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await HouseboatAPI.getOne(params.id) as Houseboat;
                setOriginal(data);
                // Map Admin Data to Preview Template Data
                // Map Admin Data to Preview Template Data
                const minPrice = data.price_override?.price_range?.min ?? (data.price_override as any)?.min ?? data.min_price ?? 0;
                const maxPrice = data.price_override?.price_range?.max ?? (data.price_override as any)?.max ?? data.max_price ?? 0;
                const catName = (data.category_id && typeof data.category_id === 'object') ? (data.category_id as any).display_name : 'Houseboat';

                const mapped: HouseboatTier = {
                    id: data._id || '',
                    name: data.name,
                    // Map Rich Data from DB
                    tagline: data.tagline || 'Experience the Backwaters',
                    description: data.description || data.notes || `Experience the beauty of Alleppey in our ${catName} houseboat.`,
                    secondaryDescription: data.secondaryDescription || '',
                    badges: data.badges || [],

                    shortPitch: data.shortPitch || '',
                    crew: data.crew || { size: 3, roles: ['Captain', 'Chef', 'Service Staff'] },
                    dining: data.dining || { cuisineTypes: ['Kerala Traditional'], isPrivate: false },
                    deck: data.deck || { type: 'Upper Deck', seating: 'Lounge Chairs' },
                    journeyFlow: data.journeyFlow || [],


                    // Legacy Maps
                    heroImage: data.images.hero,
                    imagePlaceholder: data.images.hero,
                    duration: `${data.cruise_hours || 22} Hours`,
                    guestCapacity: `${data.capacity_adults} Guests`,
                    amenitiesList: [
                        ...(data.amenities || []).map(a => ({
                            icon: 'Wifi',
                            title: typeof a === 'string' ? 'Amenity' : (a as any).name,
                            desc: 'Included'
                        })),
                        ...(data.features || []).map(f => ({
                            icon: 'Star',
                            title: typeof f === 'string' ? 'Feature' : (f as any).name,
                            desc: 'Included'
                        }))
                    ],

                    pricing: {
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        currency: 'INR'
                    },
                    priceEstimate: `₹${minPrice} - ₹${maxPrice}`,
                    highlights: (data.features || []).map(f => typeof f === 'string' ? 'Feature' : (f as any).name),
                    features: [],
                    faqs: [],
                    gallery: [
                        { src: data.images.interior, span: "col-span-2 row-span-2", label: "Interior" },
                        { src: data.images.bedroom, span: "col-span-1 row-span-1", label: "Bedroom" },
                        { src: data.images.exterior, span: "col-span-1 row-span-2", label: "Exterior" },
                        { src: data.images.dining || data.images.hero, span: "col-span-1 row-span-1", label: "Dining" },
                        ...(data.images.extra1 ? [{ src: data.images.extra1, span: "col-span-1 row-span-1", label: "Extra View" }] : []),
                        ...(data.images.extra2 ? [{ src: data.images.extra2, span: "col-span-1 row-span-1", label: "Extra View" }] : []),
                        ...(data.images.extra3 ? [{ src: data.images.extra3, span: "col-span-1 row-span-1", label: "Extra View" }] : []),
                    ],
                    // Defaults
                    seoTitle: data.slug,
                    startingPoint: { location: 'Alleppey', access: [] },
                    bookingInfo: { confirmation: 'Instant', cancellationPolicy: {} },
                    trustSignals: [],
                    stats: { rating: 4.8, reviews: 120, currentlyViewing: 3, boatsLeft: 1 },
                    reviews: [],
                    audience: [],
                    availableCount: 1
                } as any;
                setTier(mapped);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    useGSAP(() => {
        if (!tier || loading) return;

        const tl = gsap.timeline();

        // Hero Animations
        if (heroImageRef.current) {
            tl.fromTo(heroImageRef.current,
                { scale: 1.2, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
            );

            gsap.to(heroImageRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            });
        }

        // Content Reveal
        const revealElements = gsap.utils.toArray('.reveal-on-scroll');
        revealElements.forEach((el: any) => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef, dependencies: [tier, loading] });

    // Handle updates
    const updateField = (field: keyof HouseboatTier, val: any) => {
        if (!tier) return;
        setTier({ ...tier, [field]: val });
    };

    const updateNestedField = (parent: string, child: string, val: any) => {
        if (!tier) return;
        setTier({
            ...tier,
            [parent]: { ...(tier as any)[parent], [child]: val }
        });
    };

    const saveChanges = async () => {
        if (!tier || !original) return;
        setSaving(true);
        try {
            // Reconstruct Partial Houseboat Payload
            // Align with Houseboat Interface: name, notes, min_price, max_price
            const payload: Partial<Houseboat> = {
                name: tier.name,
                notes: tier.description, // Visual editor description -> Internal notes
                price_override: {
                    price_range: {
                        min: Number(tier.pricing.minPrice),
                        max: Number(tier.pricing.maxPrice)
                    }
                }
            };

            await HouseboatAPI.update(params.id, payload);
            alert('Changes saved successfully!');
            router.refresh();
        } catch (e) {
            console.error(e);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-forest-900">Loading Preview...</div>;
    if (!tier) return notFound();

    const GALLERY = tier.gallery;

    return (
        <div ref={containerRef} className="bg-ivory-50 min-h-screen text-forest-950 font-sans selection:bg-bronze-200 selection:text-forest-950 rounded-xl overflow-hidden shadow-2xl my-8 border border-gray-200">
            {/* Admin Header Overlay with Save Action */}
            <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono uppercase text-accent tracking-widest">Preview & Edit Mode</span>
                    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-300">Click text to edit</span>
                </div>
                <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 hover:shadow-glow"
                >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* --- HERO SECTION --- */}
            <header className="relative h-[50vh] lg:h-[60vh] w-full overflow-hidden flex items-end bg-forest-950">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        ref={heroImageRef}
                        src={getImageUrl(tier.heroImage || tier.imagePlaceholder)}
                        alt={tier.name}
                        fill
                        className="object-cover origin-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
                </div>

                <div className="relative z-10 w-full max-w-[96rem] mx-auto px-6 lg:px-12 pb-8 lg:pb-12">
                    <div className="max-w-4xl">
                        <div className="hero-text-element mb-4">
                            <Link href={`/houseboats/${params.id}`} className="inline-flex items-center gap-3 text-ivory-100 hover:text-white transition-colors group">
                                <div className="w-8 h-8 rounded-full border border-ivory-200/20 flex items-center justify-center group-hover:bg-ivory-50 group-hover:text-forest-950 transition-all">
                                    <ArrowLeft className="w-3 h-3" />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Exit Editor</span>
                            </Link>
                        </div>

                        <EditableText
                            tag="h1"
                            value={tier.name}
                            onChange={(val) => updateField('name', val)}
                            className="hero-text-element text-4xl md:text-6xl lg:text-7xl font-serif text-ivory-50 leading-[0.9] tracking-tight mb-4 inline-block min-w-[300px]"
                        />

                        <div className="hero-text-element flex flex-wrap gap-6 text-ivory-200/80 items-center mt-4">
                            <div className="px-3 py-1 border border-ivory-200/20 rounded-full text-[10px] uppercase tracking-widest backdrop-blur-md">
                                <EditableText
                                    tag="span"
                                    value={tier.tagline}
                                    onChange={(val) => updateField('tagline', val)}
                                    className="min-w-[150px] inline-block"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-[96rem] mx-auto px-6 lg:px-12 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* LEFT COLUMN: Narrative & Details */}
                    <div className="lg:col-span-7 space-y-16">

                        {/* 1. Narrative */}
                        <div className="reveal-on-scroll">
                            <h2 className="text-xs font-bold text-bronze-600 uppercase tracking-[0.2em] mb-4">The Experience</h2>
                            <EditableText
                                multiline
                                value={tier.description}
                                onChange={(val) => updateField('description', val)}
                                className="text-lg md:text-xl text-espresso-800 leading-relaxed font-serif font-light block"
                            />
                        </div>

                        {/* 2. Amenities */}
                        <div className="reveal-on-scroll">
                            <h3 className="text-2xl font-serif text-forest-950 mb-8 border-b border-ivory-200 pb-4">Facilities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                                {(tier.amenitiesList || []).map((amenity: any, idx: number) => (
                                    <div key={idx} className="flex gap-3 text-forest-900/50">
                                        <div>
                                            <h4 className="text-sm font-bold text-forest-950">{amenity.title}</h4>
                                            <p className="text-xs text-espresso-500">{amenity.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. VISUAL GALLERY */}
                        <div className="reveal-on-scroll">
                            <h3 className="text-2xl font-serif text-forest-950 mb-8">Visual Journey</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-[150px_150px] md:grid-rows-[220px_220px] gap-2 md:gap-4">
                                {GALLERY.map((item: any, idx: number) => (
                                    <div key={idx} className={`relative overflow-hidden rounded-2xl bg-ivory-200 group ${item.span}`}>
                                        <Image src={getImageUrl(item.src)} alt={item.label} fill className="object-cover" />
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 rounded text-[10px] font-bold uppercase tracking-widest text-forest-950 shadow-sm">
                                            {item.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>



                    </div>

                    {/* RIGHT COLUMN: Sticky Booking Module */}
                    <div className="hidden lg:block lg:col-span-5 relative">
                        <div className="sticky top-12 reveal-on-scroll">
                            <div className="bg-white p-6 shadow-soft border border-ivory-200 rounded-2xl">
                                <div className="text-center mb-8">
                                    <span className="text-[10px] font-bold text-bronze-500 uppercase tracking-[0.2em]">Price Range</span>
                                    <div className="flex items-center justify-center gap-1 text-3xl font-serif text-forest-950 mt-3">
                                        <span className="text-lg relative -top-1">₹</span>
                                        <EditableText
                                            value={tier.pricing?.minPrice || 0}
                                            onChange={(val) => updateNestedField('pricing', 'minPrice', val)}
                                            className="min-w-[80px] text-center"
                                        />
                                        <span className="text-xl text-gray-400 font-light">-</span>
                                        <span className="text-lg relative -top-1">₹</span>
                                        <EditableText
                                            value={tier.pricing?.maxPrice || 0}
                                            onChange={(val) => updateNestedField('pricing', 'maxPrice', val)}
                                            className="min-w-[80px] text-center"
                                        />
                                    </div>
                                    <p className="text-sm text-espresso-500 mt-2 font-light italic">per night</p>
                                </div>
                                <button disabled className="w-full py-5 bg-gray-200 text-gray-400 text-xs font-bold uppercase tracking-[0.2em] rounded-xl cursor-not-allowed">
                                    Booking Disabled in Editor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
