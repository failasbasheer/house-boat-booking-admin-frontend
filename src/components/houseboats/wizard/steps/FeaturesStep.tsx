import React, { FC, useEffect, useState } from 'react';
import { Houseboat, Amenity, Feature } from '@/types';
import { MasterService } from '@/services/master.service';
import { Search, Plus, Check } from 'lucide-react';

interface FeaturesStepProps {
    formData: Houseboat;
    handleChange: (field: keyof Houseboat, value: any) => void;
}

export const FeaturesStep: FC<FeaturesStepProps> = ({ formData, handleChange }) => {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);

    const [amenitySearch, setAmenitySearch] = useState('');
    const [featureSearch, setFeatureSearch] = useState('');

    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const filteredAmenities = amenities.filter(a => normalize(a.name).includes(normalize(amenitySearch)));
    const filteredFeatures = features.filter(f => normalize(f.name).includes(normalize(featureSearch)));

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const [a, f] = await Promise.all([
                    MasterService.list('amenities'),
                    MasterService.list('features')
                ]);

                // Helper to extract array from potentially paginated response
                const extractData = (res: any) => res.data || res || [];

                setAmenities(extractData(a) as Amenity[]);
                setFeatures(extractData(f) as Feature[]);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMasters();
    }, []);

    const toggleSelection = (field: keyof Houseboat, item: any) => {
        const current = (formData[field] as string[]) || [];
        const itemId = item._id;
        const exists = current.includes(itemId);

        let updated;
        if (exists) {
            updated = current.filter(id => id !== itemId);
        } else {
            updated = [...current, itemId];
        }
        handleChange(field, updated);
    };

    const isSelected = (field: keyof Houseboat, id: string) => {
        const list = (formData[field] as string[]) || [];
        return list.includes(id);
    };

    const createItem = async (type: 'amenities' | 'features', name: string) => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            // Check if exists first to avoid dupes (client side check)
            const list = type === 'amenities' ? amenities : features;
            if (list.find(i => normalize(i.name) === normalize(name))) {
                alert('Item already exists!');
                return;
            }

            const category = type === 'amenities' ? 'general' : 'highlight';
            await MasterService.create(type, { name: name.trim(), category });

            // Refresh
            const [a, f] = await Promise.all([
                MasterService.list('amenities'),
                MasterService.list('features')
            ]);

            // Helper to extract array from potentially paginated response
            const extractData = (res: any) => res.data || res || [];
            setAmenities(extractData(a) as Amenity[]);
            setFeatures(extractData(f) as Feature[]);

            // Clear search
            if (type === 'amenities') setAmenitySearch('');
            else setFeatureSearch('');

        } catch (e) {
            console.error('Failed to create item', e);
            alert('Failed to create item');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="p-20 text-center flex flex-col items-center justify-center space-y-4 animate-pulse text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Loading options...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">

            {/* 1. Amenities (Icon Grid) */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-3 gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Amenities</h3>
                        <p className="text-sm text-gray-500">Standard facilities included.</p>
                    </div>

                    <div className="w-full md:w-auto flex items-center gap-2">
                        <div className="relative group w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search amenities..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all text-sm"
                                value={amenitySearch}
                                onChange={(e) => setAmenitySearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') createItem('amenities', amenitySearch);
                                }}
                            />
                            {amenitySearch && !filteredAmenities.find(a => normalize(a.name) === normalize(amenitySearch)) && (
                                <button
                                    onClick={() => createItem('amenities', amenitySearch)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-black flex items-center gap-1"
                                >
                                    <Plus size={10} /> Add
                                </button>
                            )}
                        </div>
                        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap">
                            {formData.amenities?.length || 0} selected
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {filteredAmenities.map(item => {
                        const active = isSelected('amenities', item._id);
                        return (
                            <button
                                key={item._id}
                                type="button"
                                onClick={() => toggleSelection('amenities', item)}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all group ${active
                                    ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                                    : 'bg-white border-gray-200 hover:border-gray-400 text-gray-700'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-colors uppercase ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.name.substring(0, 1)}
                                </div>
                                <span className="text-sm font-medium">{item.name}</span>
                                {active && <Check size={14} className="ml-auto text-white/70" />}
                            </button>
                        );
                    })}
                    {filteredAmenities.length === 0 && (
                        <div className="col-span-full py-8 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                            <p className="text-sm text-gray-500 mb-2 font-medium">No amenities found.</p>
                            <button
                                onClick={() => createItem('amenities', amenitySearch)}
                                className="text-gray-900 font-bold text-sm hover:underline"
                            >
                                Create &quot;{amenitySearch}&quot;?
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* 2. Highlights & Features (Toggle Chips) */}
            <section className="space-y-6 pt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-3 gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Highlights</h3>
                        <p className="text-sm text-gray-500">Special features and unique selling points.</p>
                    </div>

                    <div className="w-full md:w-auto relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search highlights..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all text-sm"
                            value={featureSearch}
                            onChange={(e) => setFeatureSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') createItem('features', featureSearch);
                            }}
                        />
                        {featureSearch && !filteredFeatures.find(f => normalize(f.name) === normalize(featureSearch)) && (
                            <button
                                onClick={() => createItem('features', featureSearch)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-black flex items-center gap-1"
                            >
                                <Plus size={10} /> Add
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    {filteredFeatures.map(item => {
                        const active = isSelected('features', item._id!);
                        return (
                            <button
                                key={item._id}
                                type="button"
                                onClick={() => toggleSelection('features', item)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${active
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {active && <Check size={12} />}
                                {item.name}
                            </button>
                        );
                    })}
                    {filteredFeatures.length === 0 && (
                        <div className="w-full text-center py-8 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                            <span className="text-sm font-medium text-gray-400 block mb-2">No features found.</span>
                            <button
                                onClick={() => createItem('features', featureSearch)}
                                className="text-gray-900 font-bold text-sm hover:underline"
                            >
                                Create &quot;{featureSearch}&quot;?
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
