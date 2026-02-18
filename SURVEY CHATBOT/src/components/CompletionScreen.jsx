import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CompletionScreen({ userType }) {
    const titles = {
        employee: "Employee",
        stakeholder: "Stakeholder",
        customer: "Customer"
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto text-center"
        >
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-10 border border-white/20 shadow-2xl">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="h-12 w-12 text-white" />
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-4"
                >
                    Thank You!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/70 text-lg mb-8"
                >
                    Your {titles[userType]} survey has been submitted successfully. 
                    Your feedback helps us improve our products and services.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to={createPageUrl('Home')}>
                        <Button className="w-full sm:w-auto h-12 px-6 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link to={createPageUrl('Analysis')}>
                        <Button className="w-full sm:w-auto h-12 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            View Analysis
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}