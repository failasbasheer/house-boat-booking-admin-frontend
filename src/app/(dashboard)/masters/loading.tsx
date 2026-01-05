import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <Skeleton className="h-10 w-64 mb-6" />

            {/* Tabs Skeleton */}
            <div className="flex gap-4 border-b border-gray-100 mb-6 pb-2">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>

            <div className="space-y-6">
                {/* Form Skeleton */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex gap-4">
                        <Skeleton className="h-10 flex-1 rounded-lg" />
                        <Skeleton className="h-10 w-32 rounded-lg" />
                    </div>
                </div>

                {/* List Skeleton */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    {/* Table Rows */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-32 rounded-full" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
