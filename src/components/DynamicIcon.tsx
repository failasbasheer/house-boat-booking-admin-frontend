import { icons } from 'lucide-react';

export const DynamicIcon = ({ name, size = 16 }: { name: string, size?: number }) => {
    const normalizedInput = name.replace(/\s+/g, '').toLowerCase();

    const iconKey = Object.keys(icons).find(key => key.toLowerCase() === normalizedInput);
    const IconComponent = iconKey ? (icons as any)[iconKey] : null;

    if (!IconComponent) return null;
    return <IconComponent size={size} />;
};
