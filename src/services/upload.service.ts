

export const UploadService = {
    uploadImage: async (file: File, folder: string = 'category') => {
        const formData = new FormData();
        formData.append('file', file);

        // We use fetch directly here because clientFetch acts a bit customized for JSON
        // but we can adapt it or just use native fetch for multipart
        // However, clientFetch sets credentials 'include'.
        // Let's create a custom call or override headers.

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

        const response = await fetch(`${API_BASE}/upload?folder=${folder}`, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header, browser sets it with boundary
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        // Return relative URL, Next.js will proxy to backend
        return data.url;
    }
};
