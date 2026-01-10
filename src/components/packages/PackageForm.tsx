import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Category } from '@/types';
import { CategoryAPI, PackageAPI } from '@/services/api';
import { UploadService } from '@/services/upload.service';
import { getImageUrl } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface PackageFormProps {
    initialData?: Partial<Category>;
    onSuccess: () => void;
    onCancel: () => void;
}

export function PackageForm({ initialData, onSuccess, onCancel }: PackageFormProps) {
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<Partial<Category>>({
        defaultValues: {
            type: 'package',
            is_active: true,
            isHero: false,
            itinerary: [],
            inclusions: [],
            exclusions: [],
            ...initialData
        }
    });

    const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
        control,
        name: "itinerary"
    });


    const [tempInclusion, setTempInclusion] = useState('');
    const [tempExclusion, setTempExclusion] = useState('');

    const inclusions = watch('inclusions') || [];
    const exclusions = watch('exclusions') || [];

    const addInclusion = () => {
        if (tempInclusion.trim()) {
            setValue('inclusions', [...inclusions, tempInclusion.trim()]);
            setTempInclusion('');
        }
    };

    const removeInclusionItem = (index: number) => {
        const newItems = [...inclusions];
        newItems.splice(index, 1);
        setValue('inclusions', newItems);
    };

    const addExclusion = () => {
        if (tempExclusion.trim()) {
            setValue('exclusions', [...exclusions, tempExclusion.trim()]);
            setTempExclusion('');
        }
    };

    const removeExclusionItem = (index: number) => {
        const newItems = [...exclusions];
        newItems.splice(index, 1);
        setValue('exclusions', newItems);
    };


    const [loading, setLoading] = useState(false);
    const { success, error } = useToast();

    const onSubmit = async (data: Partial<Category>) => {
        setLoading(true);
        try {
            // Ensure type is package
            data.type = 'package';

            if (initialData?._id) {
                await PackageAPI.update(initialData._id, data);
                success('Package updated successfully');
            } else {
                await PackageAPI.create(data);
                success('Package created successfully');
            }
            onSuccess();
        } catch (err: any) {
            console.error(err);
            error(err.message || 'Failed to save package');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">

            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Package Details</h2>
                    <p className="text-gray-500 mt-1">Curate a unique holiday experience.</p>
                </div>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:border-green-500 transition-colors">
                        <input type="checkbox" {...register('is_active')} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 shadow-sm hover:border-amber-400 transition-colors">
                        <input type="checkbox" {...register('isHero')} className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" />
                        <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">Hero Feature</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">

                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold font-serif text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            Core Information
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Package Title</label>
                                <input
                                    {...register('display_name', { required: 'Name is required' })}
                                    className="w-full text-xl p-3 border-b-2 border-gray-200 focus:border-primary outline-none bg-transparent placeholder-gray-300 transition-colors font-serif"
                                    placeholder="e.g. Kerala Holiday Package"
                                />
                                {errors.display_name && <span className="text-red-500 text-xs mt-1 block">{errors.display_name.message}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Slug (Auto-generated)</label>
                                    <input {...register('slug')} disabled className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-400 cursor-not-allowed" placeholder="Auto-generated from title" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Duration (Days / Nights)</label>
                                    <input {...register('duration')} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700" placeholder="e.g. 3 Days / 2 Nights" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Guest Capacity</label>
                                    <input {...register('guestCapacity')} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700" placeholder="e.g. 2 - 4 Guests" />
                                </div>
                            </div>




                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Short Description</label>
                                <textarea {...register('description')} rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-lg text-gray-700 leading-relaxed" placeholder="Brief overview of the package..." />
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400" />
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold font-serif text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
                                Interactive Itinerary
                            </h3>
                            <button type="button" onClick={() => appendItinerary({ title: '', activity: '', day: itineraryFields.length + 1 })} className="text-xs bg-gray-900 text-white px-3 py-2 rounded-lg font-medium hover:bg-black transition-all flex items-center gap-1">
                                <Plus size={14} /> Add Day
                            </button>
                        </div>

                        <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pl-8">
                            {itineraryFields.map((field, index) => (
                                <div key={field.id} className="relative group">
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-gray-200 group-hover:border-purple-500 transition-colors z-10" />

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 group-hover:shadow-md transition-all relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded">Day {index + 1}</span>
                                            <button type="button" onClick={() => removeItinerary(index)} className="text-gray-400 hover:text-red-500 p-1">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                {...register(`itinerary.${index}.title` as const)}
                                                placeholder="Day Title (e.g. Arrival)"
                                                className="w-full bg-transparent border-b border-gray-200 focus:border-purple-500 outline-none pb-2 font-bold text-gray-800 placeholder-gray-400"
                                            />
                                            <textarea
                                                {...register(`itinerary.${index}.activity` as const)}
                                                rows={3}
                                                placeholder="Detailed activities for the day..."
                                                className="w-full bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-600 focus:ring-2 focus:ring-purple-100 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {itineraryFields.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="inline-block p-4 bg-gray-50 rounded-full text-gray-300 mb-2">
                                        <Plus size={24} />
                                    </div>
                                    <p className="text-gray-400 text-sm">Start building the itinerary by adding Day 1</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="space-y-8 h-fit lg:sticky lg:top-8">

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Cover Visual</h3>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group relative hover:border-primary transition-colors">
                            {watch('imagePlaceholder') ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={getImageUrl(watch('imagePlaceholder'))} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all p-4">
                                        <p className="text-white text-xs mb-2">Click to replace</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setValue('imagePlaceholder', ''); }}
                                        className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-white z-20"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 pointer-events-none">
                                    <ImageIcon size={32} className="mb-2 opacity-50" />
                                    <span className="text-xs font-medium">Upload Hero Image</span>
                                </div>
                            )}

                            <label className="absolute inset-0 cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setLoading(true);
                                        try {
                                            const url = await UploadService.uploadImage(file);
                                            setValue('imagePlaceholder', url);
                                        } catch (err: any) {
                                            error(err.message || 'Upload failed');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                />
                            </label>

                            {loading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">Recommended: 1200 x 800px JPG/WebP</p>
                    </div>


                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-green-700 mb-4 bg-green-50 inline-block px-2 py-1 rounded">Inclusions</h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                value={tempInclusion}
                                onChange={(e) => setTempInclusion(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                                placeholder="Add item..."
                                className="flex-1 p-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none"
                            />
                            <button type="button" onClick={addInclusion} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 active:scale-95 transition-transform"><Plus size={18} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {inclusions.map((item: string, idx: number) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-green-50 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium border border-green-100 animate-in fade-in zoom-in duration-200">
                                    {item}
                                    <button type="button" onClick={() => removeInclusionItem(idx)} className="hover:text-red-500"><Trash2 size={12} /></button>
                                </span>
                            ))}
                            {inclusions.length === 0 && <span className="text-gray-400 text-xs italic">No inclusions added yet.</span>}
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-red-700 mb-4 bg-red-50 inline-block px-2 py-1 rounded">Exclusions</h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                value={tempExclusion}
                                onChange={(e) => setTempExclusion(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExclusion())}
                                placeholder="Add item..."
                                className="flex-1 p-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-red-500 outline-none"
                            />
                            <button type="button" onClick={addExclusion} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 active:scale-95 transition-transform"><Plus size={18} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {exclusions.map((item: string, idx: number) => (
                                <span key={idx} className="inline-flex items-center gap-1 bg-red-50 text-red-800 px-3 py-1.5 rounded-full text-xs font-medium border border-red-100 animate-in fade-in zoom-in duration-200">
                                    {item}
                                    <button type="button" onClick={() => removeExclusionItem(idx)} className="hover:text-red-800"><Trash2 size={12} /></button>
                                </span>
                            ))}
                            {exclusions.length === 0 && <span className="text-gray-400 text-xs italic">No exclusions added yet.</span>}
                        </div>
                    </div>
                </div>
            </div>


            <div className="fixed bottom-0 left-64 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-8 flex justify-between items-center z-40 lg:left-[280px]">
                <p className="text-xs text-gray-500 italic hidden md:block">Unsaved changes will be lost.</p>
                <div className="flex gap-4 ml-auto">
                    <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-all hover:shadow-sm">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-black font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 active:scale-95 text-sm tracking-wide">
                        {loading ? 'Saving...' : 'Save & Publish Package'}
                    </button>
                </div>
            </div>
        </form>
    );
}
