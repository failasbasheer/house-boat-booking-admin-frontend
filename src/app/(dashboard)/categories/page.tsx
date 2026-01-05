
import React, { Suspense } from 'react';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <CategoriesClient />
        </Suspense>
    );
}
