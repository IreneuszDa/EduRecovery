import { Loader2 } from "lucide-react";

export function LoadingState() {
    return (
        <div className="flex-1 flex justify-center items-center bg-slate-50 dark:bg-slate-900">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );
}