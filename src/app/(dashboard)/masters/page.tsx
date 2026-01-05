import React from 'react';
import Link from 'next/link';
import { clientFetch } from '@/services/api';
import { MasterForm } from '@/components/masters/MasterForm';
import { MasterList } from '@/components/masters/MasterList';
import { Pagination } from '@/components/Pagination';
import { redirect } from 'next/navigation';

async function getMasters(type: string, page: number, limit: number) {
    return clientFetch<any>(`/masters/${type}?page=${page}&limit=${limit}`);
}

export default async function MastersPage({ searchParams }: { searchParams: { tab?: string; page?: string } }) {
    // ... lines 13-28 ...

} else if (Array.isArray(res)) {
    // Fallback
    items = res;
}
    } catch (e: any) {
    console.error(e);
    if (e.message === 'Unauthorized' || e.message === 'Invalid Token') {
        redirect('/login');
    }
}

const tabs = ['amenities', 'features', 'badges'];

return (
    <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Master Data Management</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
            {tabs.map((tab) => (
                <Link
                    key={tab}
                    href={`/masters?tab=${tab}`}
                    className={`pb-2 px-4 capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 font-semibold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {tab}
                </Link>
            ))}
        </div>

        {/* Client Components */}
        <div className="space-y-6">
            {/* Add Form */}
            <MasterForm type={activeTab} />

            {/* List */}
            <MasterList items={items} type={activeTab} />

            {/* Pagination */}
            <Pagination meta={meta} baseUrl="/masters" />
        </div>
    </div>
);
}
