"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageAPI } from '@/services/api';
import { Category } from '@/types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { PackageForm } from '@/components/packages/PackageForm';
import { getImageUrl } from '@/lib/constants';

export default function PackagesClient() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { success, error } = useToast();

    const loadPackages = React.useCallback(async () => {
        setLoading(true);
        try {

            const data = await PackageAPI.getAll() as Category[];
            setCategories(data);
        } catch (err) {
            console.error(err);
            error('Failed to load packages');
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        loadPackages();
    }, [loadPackages]);

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setEditingCategory(null);
            setShowForm(true);
        } else if (searchParams.get('action') === 'edit' && searchParams.get('id')) {
            const id = searchParams.get('id');

            PackageAPI.getAll().then((data: any) => {
                const found = data.find((c: Category) => c._id === id);
                if (found) {
                    setEditingCategory(found);
                    setShowForm(true);
                }
            });
        } else {
            setShowForm(false);
            setEditingCategory(null);
        }
    }, [searchParams]);


    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
        router.push(`/packages?action=edit&id=${category._id}`);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this package?')) {
            try {
                await PackageAPI.delete(id);
                success('Package deleted successfully');
                loadPackages();
            } catch (err) {
                console.error(err);
                error('Failed to delete package');
            }
        }
    };




    const filteredHelper = categories.filter(c =>
        (c.display_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );


    if (showForm) {
        return (
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <button onClick={() => { setShowForm(false); router.push('/packages'); }} className="mr-4 text-gray-500 hover:text-gray-700">
                        Back
                    </button>
                    <h1 className="text-2xl font-bold font-serif text-primary">
                        {editingCategory ? 'Edit Package' : 'New Package'}
                    </h1>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        <PackageForm
                            initialData={editingCategory || { type: 'package' }}
                            onSuccess={() => {
                                setShowForm(false);
                                setEditingCategory(null);
                                router.push('/packages');
                                loadPackages();
                            }}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingCategory(null);
                                router.push('/packages');
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-primary">Packages</h1>
                    <p className="text-gray-500">Manage your special holiday packages</p>
                </div>
                <button
                    onClick={() => { setEditingCategory(null); setShowForm(true); router.push('/packages?action=new'); }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <Plus size={18} />
                    Add Package
                </button>
            </div>


            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 h-80 animate-pulse">
                            <div className="h-48 bg-gray-100 rounded-t-xl" />
                            <div className="p-4 space-y-3">
                                <div className="h-6 bg-gray-100 rounded w-3/4" />
                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                            </div>
                        </div>
                    ))
                ) : filteredHelper.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search terms</p>
                    </div>
                ) : (
                    filteredHelper.map((pkg) => (
                        <div key={pkg._id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">

                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={getImageUrl(pkg.imagePlaceholder)}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Package';
                                    }}
                                    alt={pkg.display_name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />


                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${pkg.is_active ? 'bg-white/90 text-green-700' : 'bg-gray-900/90 text-white'}`}>
                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>


                                {pkg.isHero && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-amber-400 text-amber-950 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-950 animate-pulse" />
                                            Hero
                                        </span>
                                    </div>
                                )}
                            </div>


                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 font-serif mb-1 line-clamp-1">{pkg.display_name}</h3>
                                {(pkg.tagline || pkg.duration) && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                                        {pkg.duration && <span>{pkg.duration}</span>}
                                        {pkg.duration && pkg.tagline && <span>•</span>}
                                        {pkg.tagline && <span className="line-clamp-1">{pkg.tagline}</span>}
                                    </div>
                                )}

                                {pkg.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                                        {pkg.description}
                                    </p>
                                )}


                                <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                                    <button
                                        onClick={() => router.push(`/packages/${pkg.slug}/preview`)}
                                        className="text-xs font-semibold text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                                    >

                                        View Details
                                    </button>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(pkg)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg._id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
