// @/components/drive/EmptyState.tsx

import { Search } from 'lucide-react';

type EmptyStateProps = {
    isFiltering: boolean;
};

export const EmptyState = ({ isFiltering }: EmptyStateProps) => {
    const icon = <Search className="mx-auto h-16 w-16 text-gray-400" />;
    const title = isFiltering ? "No Search Results" : "No Files to Display";
    const description = isFiltering
        ? "Try using different keywords or changing your filters."
        : "No files were found in your Google Drive.";

    return (
        <div className="text-center bg-white/60 p-12 rounded-2xl mt-8 border-2 border-dashed border-gray-200">
            {icon}
            <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
        </div>
    );
};