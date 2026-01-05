
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CategoryAPI } from '@/services/api';
import { getImageUrl } from '@/lib/constants';
import { Category } from '@/types';
import { ArrowLeft, Check, Star, Users, Clock, Info } from 'lucide-react';

export default function CategoryPreviewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadCategory(id as string);
        }
    }, [id]);

    const loadCategory = async (catId: string) => {
        try {
            // Find by ID manually from all or implement getOne if available
            // Assuming getAll returns everything for now
            const all = await CategoryAPI.getAll() as Category[];
            const found = all.find(c => c._id === catId || c.slug === catId || c.id === catId);
            if (found) {
                setCategory(found);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Preview...</div>;
    if (!category) return <div className="p-8 text-center text-red-500">Category not found</div>;

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header/Nav */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview Mode</h1>
                        <p className="text-xs text-gray-500">Viewing: {category.display_name}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => router.push(`/categories?action=edit&id=${category._id}`)} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        Edit Content
                    </button>
                </div>
            </div>

            {/* Simulated Public View */}
            <main>
                {/* Hero Section */}
                <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageUrl(category.imagePlaceholder) || '/logo.png'}
                            alt={category.display_name}
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto text-white">
                        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full mb-6 border border-white/30">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold tracking-widest uppercase">Premium Experience</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
                            {category.display_name}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light leading-relaxed">
                            {category.tagline || category.description?.slice(0, 100) + '...'}
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-8 mt-10 border-t border-white/20 pt-8">
                            <div className="flex items-center gap-3">
                                <Users className="text-white/80" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Capacity</p>
                                    <p className="font-medium">{category.guestCapacity || '2 - 10 Guests'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-white/80" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                                    <p className="font-medium">{category.duration || 'Overnight'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-white/80" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                                    <p className="font-medium">{category.duration || 'Overnight'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">About this Experience</h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed">
                                <p>{category.description || 'No description available.'}</p>
                                {category.secondaryDescription && (
                                    <p className="mt-4">{category.secondaryDescription}</p>
                                )}
                            </div>
                        </section>

                        {/* Amenities */}
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">What&apos;s Included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {category.amenitiesList?.map((amenity, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 border rounded-xl hover:border-gray-400 transition-colors">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Check size={20} className="text-gray-900" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{amenity.title}</h3>
                                            <p className="text-sm text-gray-500">{amenity.desc}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!category.amenitiesList || category.amenitiesList.length === 0) && (
                                    <p className="text-gray-500 italic">No amenities listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Reviews */}
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Guest Reviews</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {category.reviews?.slice(0, 3).map((review, idx) => (
                                    <div key={idx} className="bg-gray-50 p-8 rounded-2xl relative">
                                        <div className="text-4xl text-gray-300 absolute top-6 left-6 font-serif">&quot;</div>
                                        <p className="text-gray-700 italic mb-6 relative z-10 pl-4">{review.text}</p>
                                        <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-300">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                                                <p className="text-xs text-gray-500">{review.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Booking Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gray-900 p-6 text-white text-center">
                                <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Book Your Experience</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex items-start gap-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                                    <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                                    <p>Access to {category.availableCount || 0} boats in this category.</p>
                                </div>
                                <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5">
                                    Check Availability
                                </button>
                                <p className="text-xs text-center text-gray-400">
                                    Instant confirmation • 100% Secure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
