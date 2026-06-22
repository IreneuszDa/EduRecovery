"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const DashboardLoading = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900"
    >
        <div className="flex items-center space-x-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                Wczytywanie pulpitu...
            </p>
        </div>
    </motion.div>
);

export default DashboardLoading;