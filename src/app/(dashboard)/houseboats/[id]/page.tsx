'use client';

import React, { useEffect, useState } from 'react';
import HouseboatWizard from '@/components/houseboats/wizard/HouseboatWizard';
import { HouseboatAPI } from '@/services/api';
import { Houseboat } from '@/types';

interface Props {
    params: { id: string };
}

export default function EditHouseboatPage({ params }: Props) {
    const [houseboat, setHouseboat] = useState<Houseboat | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHouseboat = async () => {
            try {
                const data = await HouseboatAPI.getOne(params.id);
                setHouseboat(data);
            } catch (error) {
                console.error('Failed to load houseboat', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHouseboat();
    }, [params.id]);

    if (loading) return <div className="p-8 text-center text-[var(--color-primary)]">Loading houseboat details...</div>;
    if (!houseboat) return <div className="p-8 text-center text-red-500">Houseboat not found</div>;

    return (
        <div className="p-6 md:p-8">
            <HouseboatWizard existingHouseboat={houseboat} />
        </div>
    );
}
