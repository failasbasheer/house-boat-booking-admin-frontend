import React from 'react';
import HouseboatWizard from '@/components/houseboats/wizard/HouseboatWizard';
import { HouseboatAPI } from '@/services/api';
import { Houseboat } from '@/types';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function EditHouseboatPage({ params }: { params: { id: string } }) {
    const cookieStore = cookies();
    let houseboat: Houseboat | null = null;

    try {
        // Fetch specific houseboat with cookies for authentication
        const response = await HouseboatAPI.getOne(params.id, {
            headers: { Cookie: cookieStore.toString() }
        });

        if (response) {
            houseboat = response as Houseboat;

            // Normalize category_id if populated
            if (houseboat.category_id && typeof houseboat.category_id === 'object' && '_id' in (houseboat.category_id as any)) {

                houseboat.category_id = (houseboat.category_id as any)._id;
            }

            // Normalize amenities if populated
            if (Array.isArray(houseboat.amenities) && houseboat.amenities.length > 0 && typeof houseboat.amenities[0] === 'object') {

                houseboat.amenities = houseboat.amenities.map((a: any) => a._id);
            }

            // Normalize features if populated
            if (Array.isArray(houseboat.features) && houseboat.features.length > 0 && typeof houseboat.features[0] === 'object') {

                houseboat.features = houseboat.features.map((f: any) => f._id);
            }
        }

    } catch (error) {
        console.error("Failed to fetch houseboat for edit:", error);
    }

    if (!houseboat) {
        return <div className="p-8 text-center text-red-500">Failed to load boat data or boat not found.</div>;
    }

    return (
        <HouseboatWizard existingHouseboat={houseboat} />
    );
}
