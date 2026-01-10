import { Suspense } from 'react';
import EnquiriesClient from './EnquiriesClient';

export const dynamic = 'force-dynamic';

export default function EnquiriesPage() {
    return (
        <Suspense fallback={<div>Loading Enquiries...</div>}>
            <EnquiriesClient />
        </Suspense>
    );
}
