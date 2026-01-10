export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Returns the backend base URL (without /api suffix).
 * e.g. http://localhost:5001 or https://my-backend.onrender.com
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Helper to get full image URL.
 * If path starts with http, return as is.
 * If path starts with /, prepend BACKEND_URL.
 * Otherwise return placeholder or original.
 */
export const getImageUrl = (path?: string | null): string => {
    if (!path) return 'https://placehold.co/600x400?text=Image+Not+Available';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    if (path.startsWith('/uploads/')) return `${BACKEND_URL}${path}`;
    // Handle seeded/simple filenames that are not paths
    if (!path.startsWith('/')) return `https://placehold.co/600x400?text=${encodeURIComponent(path)}`;
    return path;
};
