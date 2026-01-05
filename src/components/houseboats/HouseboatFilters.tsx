'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

export function HouseboatFilters({ categories = [] }: { categories?: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current values from URL
    const status = searchParams.get('status') || '';
    const categoryQuery = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';
    const shared = searchParams.get('shared_package_available') === 'true';

    // Helper to update URL
    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page to 1 on filter change
        params.set('page', '1');
        router.push(`/houseboats?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">

            <div className="flex items-center gap-2 text-gray-500 mr-2">
                <SlidersHorizontal size={20} />
                <span className="font-semibold text-sm">Filters:</span>
            </div>

            {/* Category Filter */}
            <select
                value={categoryQuery}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none min-w-[140px]"
            >
                <option value="">All Packages</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.display_name}</option>
                ))}
            </select>

            {/* Status Filter */}
            <select
                value={status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
            >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="decommissioned">Decommissioned</option>
            </select>

            {/* Sort Filter */}
            <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
            >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
            </select>

            {/* Shared Package Toggle */}
            <button
                onClick={() => updateFilter('shared_package_available', shared ? null : 'true')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${shared
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${shared ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                    {shared && <span className="text-white text-[10px]">✓</span>}
                </div>
                Shared Package Only
            </button>

            {/* Clear Filters */}
            {(status || sort || shared || categoryQuery) && (
                <button
                    onClick={() => router.push('/houseboats')}
                    className="ml-auto text-sm text-red-500 hover:text-red-700 font-medium"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}
