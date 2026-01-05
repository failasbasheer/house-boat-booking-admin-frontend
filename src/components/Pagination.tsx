'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function Pagination({ meta, baseUrl }: { meta: any, baseUrl: string }) {
    const searchParams = useSearchParams();
    const currentPage = meta.page;
    const totalPages = meta.totalPages;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-2 mt-6">
            <Link
                href={createPageUrl(currentPage - 1)}
                className={`px-3 py-1 border rounded ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                aria-disabled={currentPage === 1}
            >
                Prev
            </Link>
            <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
            </span>
            <Link
                href={createPageUrl(currentPage + 1)}
                className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                aria-disabled={currentPage === totalPages}
            >
                Next
            </Link>
        </div>
    );
}
