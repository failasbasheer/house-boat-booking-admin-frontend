"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryAPI } from '@/services/api';
import { Category } from '@/types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { CategoryForm } from '@/components/categories/CategoryForm';

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
            const data = await CategoryAPI.getAll() as Category[];
            // Filter only packages
            const packages = data.filter(c => c.type === 'package');
            setCategories(packages);
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
            // We need to fetch or find the category
            // For now, let's assume it's in the list or we fetch it
            CategoryAPI.getAll().then((data: any) => {
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
                await CategoryAPI.delete(id);
                success('Package deleted successfully');
                loadPackages();
            } catch (err) {
                console.error(err);
                error('Failed to delete package');
            }
        }
    };



    // Filtered list
    const filteredHelper = categories.filter(c =>
        c.display_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <CategoryForm
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

            {/* Search */}
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

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Duration</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading packages...</td></tr>
                        ) : filteredHelper.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No packages found.</td></tr>
                        ) : (
                            filteredHelper.map((pkg) => (
                                <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 flex items-center gap-2">
                                            {pkg.display_name}
                                            {pkg.isHero && (
                                                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-amber-200">
                                                    Hero
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">{pkg.tagline}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        ₹ {pkg.base_price?.toLocaleString() || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {pkg.duration || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {pkg.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/categories/${pkg.slug}/preview`)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                                title="Preview"
                                            >
                                                <Search size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(pkg)}
                                                className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pkg._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
