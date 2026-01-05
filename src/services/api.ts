// import { ApiResponse } from '@/types';

const API_BASE = typeof window === 'undefined'
    ? (process.env.INTERNAL_API_URL || 'http://localhost:5001/api') // Server-side
    : (process.env.NEXT_PUBLIC_API_URL || '/api'); // Client-side (proxy)

/**
 * A wrapper around fetch that handles credentials (cookies) automatically.
 */
export const clientFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        // CRITICAL: This ensures HTTP-only cookies are sent/received
        credentials: 'include',
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);

        // Handle 401 Unauthorized globally (redirect to login)
        if (response.status === 401) {
            if (typeof window !== 'undefined' && !window.location.href.includes('/login')) {
                window.location.href = '/login';
            }
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // Backend sends { error: "msg" }, frontend was looking for { message: "msg" }
            throw new Error(errorData.error || errorData.message || 'API Request Failed');
        }

        // If No Content (204)
        if (response.status === 204) {
            return {} as T;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

// --- CRUD Services ---

export const AuthAPI = {
    login: (credentials: { username: string; password: string }) =>
        clientFetch<{ user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
    logout: () => clientFetch('/auth/logout', { method: 'POST' }),
    me: () => clientFetch<{ user: any }>('/auth/me'),
};

// Categories
export const CategoryAPI = {
    getAll: () => clientFetch('/categories'),
    create: (data: any) => clientFetch('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => clientFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => clientFetch(`/categories/${id}`, { method: 'DELETE' }),
    seed: () => clientFetch('/categories/seed', { method: 'POST' })
};



// Houseboats (Boats)
export const HouseboatAPI = {
    getAll: (params: any = {}, options?: RequestInit) => {
        const query = new URLSearchParams(params).toString();
        return clientFetch<{ data: import('@/types').Houseboat[], meta: any } | import('@/types').Houseboat[]>(`/houseboats?${query}`, options);
    },
    // ... keep existing
    getOne: (id: string, options?: RequestInit) => clientFetch<import('@/types').Houseboat>(`/houseboats/${id}`, options),
    create: (data: any) => clientFetch('/houseboats', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => clientFetch(`/houseboats/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => clientFetch(`/houseboats/${id}`, { method: 'DELETE' }),
};
