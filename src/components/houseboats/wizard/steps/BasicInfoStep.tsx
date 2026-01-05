import React, { FC, useEffect, useState, useCallback } from 'react';
import { Houseboat } from '@/types';
import { CategoryAPI } from '@/services/api';
import { Wind, CheckCircle2, Wrench, Archive } from 'lucide-react';

interface BasicInfoStepProps {
    formData: Houseboat;
    handleChange: (field: keyof Houseboat, value: any) => void;
}

export const BasicInfoStep: FC<BasicInfoStepProps> = ({ formData, handleChange }) => {
    const [categories, setCategories] = useState<any[]>([]);

    const [error, setError] = useState<string | null>(null);

    const loadCategories = useCallback(async () => {
        try {
            setError(null);
            setError(null);
            const data = await CategoryAPI.getAll() as any[];
            console.log('Categories loaded:', data);
            setCategories(data);
            if (data.length > 0 && !formData.category_id) {
                // Auto-select first if new
                handleChange('category_id', data[0]._id);
            }
        } catch (e: any) {
            console.error('Failed to load categories', e);
            setError('Failed to load categories');
        }
    }, [formData.category_id, handleChange]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* 1. Identity Section */}
            <section className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">Vessel Identity</h2>
                    <p className="text-sm text-gray-500">Basic identification and categorization.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Boat Name</label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-300"
                            placeholder="e.g. Royal Queen II"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <div className="relative">
                            <select
                                value={formData.category_id || ''}
                                onChange={e => handleChange('category_id', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none appearance-none transition-all cursor-pointer"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.display_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>


                {/* Status Selection - Full Width */}
                <div className="pt-4 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Operational Status</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                value: 'active',
                                label: 'Active',
                                desc: 'Available for booking',
                                icon: CheckCircle2,
                                color: 'text-green-600',
                                bg: 'bg-green-50',
                                border: 'border-green-200',
                                activeBorder: 'border-green-600 ring-1 ring-green-600'
                            },
                            {
                                value: 'maintenance',
                                label: 'Maintenance',
                                desc: 'Temporarily unavailable',
                                icon: Wrench,
                                color: 'text-amber-600',
                                bg: 'bg-amber-50',
                                border: 'border-amber-200',
                                activeBorder: 'border-amber-600 ring-1 ring-amber-600'
                            },
                            {
                                value: 'decommissioned',
                                label: 'Decommissioned',
                                desc: 'Permanently removed',
                                icon: Archive,
                                color: 'text-gray-600',
                                bg: 'bg-gray-50',
                                border: 'border-gray-200',
                                activeBorder: 'border-gray-900 ring-1 ring-gray-900'
                            }
                        ].map((option) => {
                            const isSelected = formData.status === option.value;
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleChange('status', option.value)}
                                    className={`relative flex flex-col items-start p-5 rounded-xl border text-left transition-all duration-200 group hover:shadow-md ${isSelected
                                        ? `${option.bg} ${option.activeBorder}`
                                        : `bg-white border-gray-200 hover:border-gray-300`
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-lg mb-4 ${isSelected ? 'bg-white/60' : 'bg-gray-100 group-hover:bg-gray-50'} transition-colors`}>
                                        <Icon className={`w-6 h-6 ${isSelected ? option.color : 'text-gray-500'}`} />
                                    </div>
                                    <span className={`text-base font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                        {option.label}
                                    </span>
                                    <span className={`text-sm mt-1.5 ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                                        {option.desc}
                                    </span>

                                    {isSelected && (
                                        <div className="absolute top-4 right-4 text-gray-900">
                                            <div className="w-2.5 h-2.5 rounded-full bg-current" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Booking Config moved to its own row */}
                <div className="pt-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Booking Configuration</label>
                        <div
                            onClick={() => handleChange('shared_package_available', !formData.shared_package_available)}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${formData.shared_package_available
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                        >
                            <div>
                                <span className="text-sm font-medium block">Shared Booking</span>
                                <span className={`text-xs ${formData.shared_package_available ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Allow multiple groups to book separate rooms on this boat
                                </span>
                            </div>
                            <div className={`w-11 h-6 rounded-full relative transition-colors ${formData.shared_package_available ? 'bg-white/20' : 'bg-gray-200'
                                }`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.shared_package_available ? 'left-6' : 'left-1'
                                    }`} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Specs Section */}
            <section className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">Specifications</h2>
                    <p className="text-sm text-gray-500">Physical characteristics and sleeping capacity.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <NumberInput
                        label="Bedrooms"
                        value={formData.bedrooms || 1}
                        onChange={(v) => handleChange('bedrooms', v)}
                        min={1} max={10}
                    />
                    <NumberInput
                        label="Max Guests"
                        value={formData.capacity_adults || 2}
                        onChange={(v) => handleChange('capacity_adults', v)}
                        min={1} max={50} step={1}
                    />

                    {/* Cruise Hours */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Cruise Hours</label>
                        <div className="relative">
                            <select
                                value={formData.cruise_hours || 22}
                                onChange={(e) => handleChange('cruise_hours', parseInt(e.target.value))}
                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none appearance-none transition-all cursor-pointer font-medium text-gray-900"
                            >
                                {[21, 22, 23, 24, 48, 4, 5, 6].sort((a, b) => a - b).map(num => (
                                    <option key={num} value={num}>{num} Hours</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* AC Toggle */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">A/C System</label>
                        <button
                            type="button"
                            onClick={() => handleChange('has_ac', !formData.has_ac)}
                            className={`w-full px-4 py-2.5 rounded-lg border text-left transition-all font-medium flex justify-between items-center ${formData.has_ac
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                                }`}
                        >
                            <span>{formData.has_ac ? 'Installed' : 'Standard'}</span>
                            {formData.has_ac && <Wind size={14} />}
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. Pricing Section */}
            <section className="space-y-6">
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-gray-900">Price Range</h2>
                    <p className="text-sm text-gray-500">Set the minimum and maximum price per night.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PriceInput
                        label="Minimum Price"
                        value={formData.price_override?.price_range?.min ?? formData.min_price}
                        onChange={(v) => handleChange('price_override', {
                            ...formData.price_override,
                            price_range: {
                                ...formData.price_override?.price_range,
                                min: v,
                                max: formData.price_override?.price_range?.max ?? formData.max_price ?? 0
                            }
                        })}
                        placeholder="Min Rate"
                    />
                    <PriceInput
                        label="Maximum Price"
                        value={formData.price_override?.price_range?.max ?? formData.max_price}
                        onChange={(v) => handleChange('price_override', {
                            ...formData.price_override,
                            price_range: {
                                ...formData.price_override?.price_range,
                                max: v,
                                min: formData.price_override?.price_range?.min ?? formData.min_price ?? 0
                            }
                        })}
                        placeholder="Max Rate"
                    />
                </div>
            </section>
        </div>
    );
};

// Helper Components
interface NumberInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

const NumberInput: FC<NumberInputProps> = ({ label, value, onChange, min = 0, max = 100, step = 1 }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
                onClick={() => onChange(Math.max(min, value - step))}
                className="px-3 py-2 bg-gray-50 border-r border-gray-300 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                type="button"
            >-</button>
            <div className="flex-1 flex items-center justify-center font-semibold text-gray-900 bg-white">
                {value}
            </div>
            <button
                onClick={() => onChange(Math.min(max, value + step))}
                className="px-3 py-2 bg-gray-50 border-l border-gray-300 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                type="button"
            >+</button>
        </div>
    </div>
);

interface PriceInputProps {
    label: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder?: string;
}

const PriceInput: FC<PriceInputProps> = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-2">
        <div className="flex justify-between">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
        </div>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
            <input
                type="number"
                value={value || ''}
                onChange={e => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none font-medium placeholder:text-gray-300 transition-all text-gray-900"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);
