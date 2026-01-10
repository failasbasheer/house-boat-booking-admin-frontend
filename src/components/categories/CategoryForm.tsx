import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Category } from '@/types';
import { CategoryAPI } from '@/services/api';
import { UploadService } from '@/services/upload.service';
import { getImageUrl } from '@/lib/constants';
import { useToast } from '@/components/ui/Toast';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface CategoryFormProps {
    initialData?: Partial<Category>;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<Partial<Category>>({
        defaultValues: {
            is_active: true,
            amenitiesList: [],
            reviews: [],
            stats: { rating: 4.8 },
            ...initialData
        }
    });

    const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({
        control,
        name: "amenitiesList"
    });

    const { fields: reviewFields } = useFieldArray({
        control,
        name: "reviews"
    });

    const [loading, setLoading] = useState(false);
    const { success, error } = useToast();

    const onSubmit = async (data: Partial<Category>) => {
        setLoading(true);
        try {
            if (initialData?._id) {
                await CategoryAPI.update(initialData._id, data);
                success('Category updated successfully');
            } else {
                await CategoryAPI.create(data);
                success('Category created successfully');
            }
            onSuccess();
        } catch (err: any) {
            console.error(err);
            error(err.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-1">

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <input {...register('display_name', { required: 'Name is required' })} className="w-full p-2 border rounded-lg" placeholder="e.g. Deluxe Houseboats" />
                        {errors.display_name && <span className="text-red-500 text-xs">{errors.display_name.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (ID)</label>
                        <input {...register('id')} className="w-full p-2 border rounded-lg" placeholder="e.g. deluxe (auto-generated if empty)" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Count</label>
                        <input type="number" {...register('availableCount', { valueAsNumber: true })} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (Numerical)</label>
                        <input type="number" {...register('base_price', { valueAsNumber: true })} className="w-full p-2 border rounded-lg" placeholder="e.g. 15000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Price (String)</label>
                        <input {...register('priceDisplay')} className="w-full p-2 border rounded-lg" placeholder="e.g. ₹ 15,000 / night" />
                        <p className="text-[10px] text-gray-500 mt-1">Used for promo cards</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Template</label>
                        <input {...register('whatsappTemplate')} className="w-full p-2 border rounded-lg" placeholder="Message text for WhatsApp link" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                        <input {...register('tagline')} className="w-full p-2 border rounded-lg" placeholder="e.g. Best Value Experience" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" {...register('is_active')} className="h-4 w-4 text-blue-600 rounded" />
                        <label className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" {...register('isHero')} className="h-4 w-4 text-amber-600 rounded" />
                        <label className="text-sm font-medium text-gray-700">Feature in Hero (Promo)</label>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Details & Description</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input {...register('duration')} className="w-full p-2 border rounded-lg" placeholder="e.g. Overnight Cruise" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guest Capacity</label>
                        <input {...register('guestCapacity')} className="w-full p-2 border rounded-lg" placeholder="e.g. 2 - 8 Guests" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Description</label>
                        <textarea {...register('description')} rows={3} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Description</label>
                        <textarea {...register('secondaryDescription')} rows={2} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image Placeholder</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-32 h-24 group">
                                <label className="cursor-pointer block w-full h-full rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-all relative">
                                    {watch('imagePlaceholder') ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={getImageUrl(watch('imagePlaceholder'))} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-white text-xs font-medium">Change Image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                                            <span className="text-xs">Click to Upload</span>
                                        </div>
                                    )}
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
                                {watch('imagePlaceholder') && (
                                    <button
                                        type="button"
                                        onClick={() => setValue('imagePlaceholder', '')}
                                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-sm border border-gray-100 hover:bg-red-50 z-10"
                                        title="Remove Image"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <input type="hidden" {...register('imagePlaceholder')} />
                            <div className="text-xs text-gray-500">
                                <p>Upload a representative image for this category.</p>
                                <p>Recommended size: 800x600px (WebP/JPG)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Amenities List</h3>
                    <button type="button" onClick={() => appendAmenity({ title: '', desc: '' })} className="text-blue-600 text-sm font-medium flex items-center hover:bg-blue-50 px-2 py-1 rounded">
                        <Plus size={16} className="mr-1" /> Add Amenity
                    </button>
                </div>
                <div className="space-y-3">
                    {amenityFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg group">
                            <div className="mt-2 text-gray-400 cursor-move">
                                <GripVertical size={16} />
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input {...register(`amenitiesList.${index}.title` as const)} placeholder="Title (e.g. AC Bedroom)" className="p-2 border rounded text-sm" />
                                <input {...register(`amenitiesList.${index}.desc` as const)} placeholder="Description (e.g. 9PM - 6AM)" className="p-2 border rounded text-sm" />
                            </div>
                            <button type="button" onClick={() => removeAmenity(index)} className="text-red-400 hover:text-red-600 p-2">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {amenityFields.length === 0 && <p className="text-gray-400 text-sm italic text-center py-4">No amenities added yet.</p>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Reviews & Testimonials</h3>
                </div>
                <div className="space-y-3">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
                        <input type="number" step="0.1" {...register('stats.rating', { valueAsNumber: true })} className="w-24 p-2 border rounded-lg" />
                    </div>
                    {reviewFields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                            <div className="mt-2 text-gray-400 cursor-move">
                                <GripVertical size={16} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <input {...register(`reviews.${index}.name` as const)} placeholder="Reviewer Name" className="flex-1 p-2 border rounded text-sm" />
                                    <input {...register(`reviews.${index}.location` as const)} placeholder="Location" className="flex-1 p-2 border rounded text-sm" />
                                </div>
                                <textarea {...register(`reviews.${index}.text` as const)} rows={2} placeholder="Review Text" className="w-full p-2 border rounded text-sm" />
                            </div>

                        </div>
                    ))}
                    {reviewFields.length === 0 && <p className="text-gray-400 text-sm italic text-center py-4">No reviews added yet.</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-white/90 backdrop-blur p-4 border-t z-10">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover font-medium shadow-sm transition-colors disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Category'}
                </button>
            </div>
        </form>
    );
}
