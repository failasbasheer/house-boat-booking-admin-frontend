import React from 'react';
import Link from 'next/link';
// import { clientFetch } from '@/services/api'; // Removed unused
import { HouseboatTable } from '@/components/HouseboatTable';
import { Pagination } from '@/components/Pagination';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Removed getHouseboats local function in favor of HouseboatAPI
import { HouseboatAPI, CategoryAPI } from '@/services/api';
import { HouseboatFilters } from '@/components/houseboats/HouseboatFilters';

export default async function HouseboatListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    // ... (lines 14-41 remain same) ...

    if (Array.isArray(catRes)) {
        categories = catRes;
    }
} catch (e: any) {
    console.error('Failed to load data', e);
    if (e.message === 'Unauthorized' || e.message === 'Invalid Token') {
        redirect('/login');
    }
}

return (
    <div className="p-6 md:p-8">
        <div className="mb-6 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Houseboats</h1>
                <p className="text-espresso-500">Manage your fleet inventory</p>
            </div>
            <Link href="/houseboats/new" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
                + Add New
            </Link>
        </div>

        <HouseboatFilters categories={categories} />

        <HouseboatTable houseboats={houseboats} />

        <Pagination meta={meta} baseUrl="/houseboats" />
    </div>
);
}
