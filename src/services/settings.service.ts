import { clientFetch } from './api';

export interface GlobalSettings {
    whatsappNumber: string;
    whatsappMessage: string;
    contactPhone: string;
    contactEmail: string;
}

export const SettingsAPI = {
    get: async (): Promise<GlobalSettings> => {
        return await clientFetch<GlobalSettings>('/settings');
    },

    update: async (data: Partial<GlobalSettings>): Promise<GlobalSettings> => {
        return await clientFetch<GlobalSettings>('/settings', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};
