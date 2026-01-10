
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PackageAPI } from '@/services/api';
import { SettingsAPI, GlobalSettings } from '@/services/settings.service';
import { getImageUrl } from '@/lib/constants';
import { Category } from '@/types';
import { ArrowLeft, Check, Star, Users, Clock, Info, MessageCircle } from 'lucide-react';

export default function PackagePreviewPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [pkg, setPkg] = useState<Category | null>(null);
    const [settings, setSettings] = useState<GlobalSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (slug) {
                    await loadPackage(slug as string);
                }
                const settingsData = await SettingsAPI.get();
                setSettings(settingsData);
            } catch (err) {
                console.error("Failed to load data", err);
            }
        };
        loadData();
    }, [slug]);

    const loadPackage = async (id: string) => {
        try {
            // PackageAPI.getOne now hits /packages/:id which checks for ID or Slug
            const data = await PackageAPI.getOne(id) as Category;
            setPkg(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Preview...</div>;
    if (!pkg) return <div className="p-8 text-center text-red-500">Package not found</div>;

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
                        <p className="text-xs text-gray-500">Viewing: {pkg.display_name}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => router.push(`/packages?action=edit&id=${pkg._id}`)} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        Edit Content
                    </button>
                </div>
            </div>

            {/* Content using Category/Package common structure */}
            <main>
                {/* Hero Section */}
                <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageUrl(pkg.imagePlaceholder) || 'https://placehold.co/1200x800?text=Package'}
                            alt={pkg.display_name}
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto text-white">
                        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full mb-6 border border-white/30">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold tracking-widest uppercase">Premium Package</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">
                            {pkg.display_name}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light leading-relaxed">
                            {pkg.tagline || pkg.description?.slice(0, 100) + '...'}
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-8 mt-10 border-t border-white/20 pt-8">
                            <div className="flex items-center gap-3">
                                <Clock className="text-white/80" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                                    <p className="font-medium">{pkg.duration || 'Flexible'}</p>
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
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">About this Package</h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed">
                                <p>{pkg.description || 'No description available.'}</p>
                            </div>
                        </section>

                        {/* Itinerary */}
                        {pkg.itinerary && pkg.itinerary.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Itinerary</h2>
                                <div className="space-y-8 border-l-2 border-gray-200 ml-4 pl-8 relative">
                                    {pkg.itinerary.map((day, idx) => (
                                        <div key={idx} className="relative">
                                            <span className="absolute -left-[41px] top-0 w-6 h-6 bg-gray-900 rounded-full border-4 border-white ring-1 ring-gray-200"></span>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Day {day.day}: {day.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{day.activity}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions */}
                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">What&apos;s Included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pkg.inclusions && pkg.inclusions.length > 0 ? (
                                    pkg.inclusions.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 border rounded-xl bg-green-50/50 border-green-100">
                                            <div className="bg-green-100 p-2 rounded-lg text-green-700">
                                                <Check size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No specific inclusions listed.</p>
                                )}
                            </div>

                            {/* Exclusions */}
                            {pkg.exclusions && pkg.exclusions.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Exclusions</h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        {pkg.exclusions.map((ex, i) => (
                                            <li key={i}>{ex}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gray-900 p-6 text-white text-center">
                                <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Book Your Experience</p>
                            </div>
                            <div className="p-8 space-y-6">

                                <a
                                    href={`https://wa.me/${settings?.whatsappNumber || '916282118829'}?text=I'm interested in the ${pkg.display_name} package.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <span>Enquire Package</span>
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </a>

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
