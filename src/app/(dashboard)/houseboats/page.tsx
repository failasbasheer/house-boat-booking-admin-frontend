import React from 'react';
import Link from 'next/link';
// import { clientFetch } from '@/services/api'; // Removed unused
import { HouseboatTable } from '@/components/HouseboatTable';
import { Pagination } from '@/components/Pagination';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Removed getHouseboats local function in favor of HouseboatAPI
import { HouseboatAPI, CategoryAPI } from '@/services/api';
import { HouseboatFilters } from '@/components/houseboats/HouseboatFilters';

export default async function HouseboatListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    // const page = parseInt(searchParams.page || '1'); // Removed unused
    // API now handles searchParams object directly

    let houseboats: any[] = [];
    let categories: any[] = [];
    let meta: any = { page: 1, totalPages: 1 };

    try {
        const cookieStore = cookies();
        const headers = { headers: { Cookie: cookieStore.toString() } };

        // Fetch boats and categories in parallel
        const [res, catRes] = await Promise.all([
            HouseboatAPI.getAll(searchParams, headers),
            CategoryAPI.getAll()
        ]);

        if ('data' in res) {
            houseboats = res.data;
            meta = res.meta;
        } else if (Array.isArray(res)) {
            houseboats = res;
        }

        if (Array.isArray(catRes)) {
            categories = catRes;
        }
    } catch (error) {
        console.error('Failed to load data', error);
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
