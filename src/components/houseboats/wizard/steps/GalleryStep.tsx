import React, { FC, useState } from 'react';
import { Houseboat } from '@/types';
import { UploadService } from '@/services/upload.service';
import { getImageUrl } from '@/lib/constants';
import { Image as ImageIcon, Upload, X, CheckCircle } from 'lucide-react';

interface GalleryStepProps {
    formData: Houseboat;
    handleChange: (field: keyof Houseboat, value: any) => void;
}

const REQUIRED_SLOTS = [
    { key: 'hero', label: '1. Hero (Cover)', required: true, desc: 'Main listing photo' },
    { key: 'exterior', label: '2. Exterior', required: true, desc: 'Side or angle view' },
    { key: 'interior', label: '3. Interior', required: true, desc: 'Living area' },
    { key: 'bedroom', label: '4. Bedroom', required: true },
    { key: 'dining', label: '5. Dining', required: false },
    { key: 'bathroom', label: '6. Bathroom', required: false },
    { key: 'extra1', label: '7. Extra', required: false },
    { key: 'extra2', label: '8. Extra', required: false },
    { key: 'extra3', label: '9. Extra', required: false },
];

export const GalleryStep: FC<GalleryStepProps> = ({ formData, handleChange }) => {
    const images = formData.images || {};
    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
    // Local previews for immediate feedback before upload completes
    const [previews, setPreviews] = useState<Record<string, string>>({});

    // Bulk upload handler
    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Identify available slots
        const availableSlots = REQUIRED_SLOTS.filter(slot => !images[slot.key as keyof typeof images]);

        // Map files to slots
        const uploadsToProcess: { file: File, slotKey: string }[] = [];

        files.forEach((file, index) => {
            if (index < availableSlots.length) {
                uploadsToProcess.push({
                    file,
                    slotKey: availableSlots[index].key
                });
            }
        });

        if (uploadsToProcess.length === 0) {
            alert('No empty slots available to fill.');
            return;
        }

        // 1. Set previews immediately
        const newPreviews: Record<string, string> = {};
        const newUploadingState: Record<string, boolean> = {};

        uploadsToProcess.forEach(({ file, slotKey }) => {
            newPreviews[slotKey] = URL.createObjectURL(file);
            newUploadingState[slotKey] = true;
        });

        setPreviews(prev => ({ ...prev, ...newPreviews }));
        setUploadingState(prev => ({ ...prev, ...newUploadingState }));

        // 2. Upload in parallel
        try {
            const results = await Promise.allSettled(
                uploadsToProcess.map(async ({ file, slotKey }) => {
                    const url = await UploadService.uploadImage(file, 'houseboats');
                    return { slotKey, url };
                })
            );

            // 3. Update form data with successful uploads
            const newImages = { ...images };

            results.forEach((result, index) => {
                const slotKey = uploadsToProcess[index].slotKey;

                if (result.status === 'fulfilled') {
                    // @ts-expect-error - Dynamic object assignment
                    newImages[slotKey] = result.value.url;
                } else {
                    console.error(`Failed to upload for ${slotKey}`, result.reason);
                    // Clear preview if failed
                    setPreviews(prev => {
                        const copy = { ...prev };
                        delete copy[slotKey];
                        return copy;
                    });
                }

                // Clear loading state
                setUploadingState(prev => {
                    const copy = { ...prev };
                    delete copy[slotKey];
                    return copy;
                });
            });

            handleChange('images', newImages);

        } catch (err) {
            console.error('Bulk upload error', err);
            alert('Some images failed to upload.');
        }
    };

    const handleFileChange = async (slotKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Set preview
            const previewUrl = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [slotKey]: previewUrl }));

            setUploadingState(prev => ({ ...prev, [slotKey]: true }));
            const url = await UploadService.uploadImage(file);
            handleChange('images', { ...images, [slotKey]: url });
        } catch (err) {
            alert('Upload failed: ' + err);
            // Revert preview on fail
            setPreviews(prev => {
                const copy = { ...prev };
                delete copy[slotKey];
                return copy;
            });
        } finally {
            setUploadingState(prev => ({ ...prev, [slotKey]: false }));
        }
    };

    const removeImage = (slotKey: string) => {
        const newImages = { ...images };
        // @ts-expect-error - Dynamic object assignment
        delete newImages[slotKey];
        handleChange('images', newImages);

        setPreviews(prev => {
            const copy = { ...prev };
            delete copy[slotKey];
            return copy;
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Visual Gallery</h2>
                <p className="text-sm text-gray-500">High-resolution images of the vessel.</p>
            </div>

            {/* Bulk Uploader Box */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-gray-50 border border-gray-200 p-6 rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-700">
                        <Upload size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Quick Bulk Upload</h3>
                        <p className="text-gray-500 text-sm">Select multiple photos to fill empty slots automatically.</p>
                    </div>
                </div>
                <label className="cursor-pointer bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2">
                    <Upload size={16} />
                    Choose Photos
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleBulkUpload} />
                </label>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REQUIRED_SLOTS.map((slot) => {
                    const currentUrl = images[slot.key as keyof typeof images]; // server url
                    const previewUrl = previews[slot.key]; // local blob url
                    const displayUrl = currentUrl || previewUrl;
                    const isUploading = uploadingState[slot.key];

                    return (
                        <div key={slot.key} className="relative group">

                            {/* Label Header */}
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h4 className={`text-xs font-bold uppercase tracking-wide ${slot.required && !displayUrl ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {slot.label}
                                    </h4>
                                </div>
                                {slot.required && !displayUrl && (
                                    <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">Required</span>
                                )}
                                {displayUrl && (
                                    <span className="text-emerald-500">
                                        <CheckCircle size={14} fill="currentColor" className="text-white" />
                                    </span>
                                )}
                            </div>

                            {/* Drop Zone / Image Area */}
                            <div className={`aspect-[4/3] rounded-xl border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${displayUrl
                                ? 'border-gray-200 shadow-sm'
                                : 'border-dashed border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                                }`}>
                                {isUploading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 backdrop-blur-sm">
                                        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : null}

                                {displayUrl ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={getImageUrl(displayUrl)} alt={slot.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-4 z-10 pointer-events-none">
                                            {/* Pointer events handled by buttons */}
                                        </div>

                                        <button
                                            onClick={() => removeImage(slot.key)}
                                            className="absolute top-2 right-2 z-30 bg-white/20 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110"
                                            title="Remove Image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-4 group/label">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 group-hover/label:bg-gray-100 transition-colors text-gray-400 group-hover/label:text-gray-900">
                                            <ImageIcon size={18} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 group-hover/label:text-gray-900 transition-colors">Select Image</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(slot.key, e)} />
                                    </label>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
