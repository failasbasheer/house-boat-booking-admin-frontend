"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HouseboatAPI } from '@/services/api';
import { Houseboat } from '@/types';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { FeaturesStep } from './steps/FeaturesStep';
import { GalleryStep } from './steps/GalleryStep';
import { useToast } from '@/components/ui/Toast';

interface HouseboatWizardProps {
    existingHouseboat?: Houseboat | null;
}

const emptyHouseboat = (): Houseboat => ({
    name: '',
    slug: '',
    category_id: '',
    status: 'active',
    images: { hero: '', exterior: '', interior: '', bedroom: '', dining: '', bathroom: '' },
    amenities: [],
    features: [],
    bedrooms: 1,
    capacity_adults: 2,
    has_ac: true,
    cruise_hours: 22,
    price_override: { price_range: { min: 0, max: 0 } },
    min_price: undefined, // legacy
    max_price: undefined, // legacy
    notes: '',

    // Rich Data Defaults
    tagline: '',
    shortPitch: '',
    description: '',
    badges: [],
    crew: { size: 3, roles: ['Captain', 'Chef', 'Service Staff'] },
    dining: { cuisineTypes: ['Kerala Traditional'], isPrivate: false },
    deck: { type: 'Upper Deck', seating: 'Lounge Chairs' },
    journeyFlow: [
        '12:00 PM – Welcome Drink',
        '01:00 PM – Lunch',
        '04:00 PM – Tea & Snacks',
        '08:00 PM – Dinner',
        '08:00 AM – Breakfast'
    ]
});

export default function HouseboatWizard({ existingHouseboat }: HouseboatWizardProps) {
    const router = useRouter();
    const { success, error } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Houseboat>(existingHouseboat || emptyHouseboat());
    const [saving, setSaving] = useState(false);

    // Steps Configuration -> Removed "Content" Step
    const STEPS = [
        { num: 1, label: 'Overview' },
        { num: 2, label: 'Amenities' },
        { num: 3, label: 'Visuals' }
    ];

    const handleFieldChange = (field: keyof Houseboat, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Backend validates too.
            // If editing...
            if (existingHouseboat?._id) {
                // update
                await HouseboatAPI.update(existingHouseboat._id, formData);
                success('Boat updated successfully');
            } else {
                await HouseboatAPI.create(formData);
                success('New boat created successfully');
            }
            router.push('/houseboats');
            router.refresh();
        } catch (err: any) {
            console.error(err);
            error('Failed to save: ' + (err.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    const canProceed = () => {
        // Simple validation
        if (currentStep === 1) return !!formData.name && !!formData.category_id;
        // Step 2 is now Amenities (always proceed)
        if (currentStep === 2) return true;
        // Step 3 is Visuals
        if (currentStep === 3) {
            const imgCount = Object.values(formData.images || {}).filter(Boolean).length;
            return imgCount >= 3;
        }
        return true;
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100 my-8">
            {/* Stepper Header */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {existingHouseboat ? 'Edit Inventory' : 'Add to Fleet'}
                    </h1>
                    <div className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
                        Step {currentStep} of {STEPS.length}
                    </div>
                </div>

                <div className="relative flex justify-between w-full max-w-3xl mx-auto">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -z-10 -translate-y-1/2"></div>
                    <div
                        className="absolute top-1/2 left-0 h-[1px] bg-primary transition-all duration-300 -z-10 -translate-y-1/2"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    ></div>

                    {STEPS.map((s) => {
                        const active = currentStep >= s.num;
                        const current = currentStep === s.num;
                        return (
                            <div key={s.num} className="flex flex-col items-center gap-2 bg-white px-2 cursor-default">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${active
                                        ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                                        : 'border-gray-200 bg-white text-gray-400'
                                        }`}
                                >
                                    {active ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : (
                                        <span className="text-xs font-bold">{s.num}</span>
                                    )}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${current ? 'text-primary' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[500px] mb-8">
                {currentStep === 1 && <BasicInfoStep formData={formData} handleChange={handleFieldChange} />}
                {currentStep === 2 && <FeaturesStep formData={formData} handleChange={handleFieldChange} />}
                {currentStep === 3 && <GalleryStep formData={formData} handleChange={handleFieldChange} />}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-auto sticky bottom-0 bg-white z-10 p-4 -mx-4 -mb-4 rounded-b-xl backdrop-blur-sm bg-white/95 supports-[backdrop-filter]:bg-white/80">
                <button
                    disabled={currentStep === 1}
                    onClick={() => setCurrentStep(p => p - 1)}
                    className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    Back
                </button>

                {currentStep < STEPS.length ? (
                    <button
                        disabled={!canProceed()}
                        onClick={() => setCurrentStep(p => p + 1)}
                        className="px-8 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none transition-all hover:-translate-y-0.5"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={saving || !canProceed()}
                        className="px-8 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:shadow-none transition-all hover:-translate-y-0.5"
                    >
                        {saving ? 'Saving...' : 'Complete & Save'}
                    </button>
                )}
            </div>
        </div>
    );
}
