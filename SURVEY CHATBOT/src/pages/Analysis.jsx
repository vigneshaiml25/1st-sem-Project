import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Users, FileText, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { getSentiment } from '@/components/survey/SurveyQuestions';

import StatCard from '@/components/analysis/StatCard';
import SentimentChart from '@/components/analysis/SentimentChart';
import UserTypeChart from '@/components/analysis/UserTypeChart';
import ResponsesTable from '@/components/analysis/ResponsesTable';
import InsightsPanel from '@/components/analysis/InsightsPanel';

export default function Analysis() {
    const { data: responses = [], isLoading, refetch } = useQuery({
        queryKey: ['surveyResponses'],
        queryFn: () => base44.entities.SurveyResponse.list('-created_date', 100)
    });

    // Calculate stats
    const stats = {
        total: responses.length,
        completed: responses.filter(r => r.completed).length,
        userTypes: {
            employee: responses.filter(r => r.user_type === 'employee').length,
            stakeholder: responses.filter(r => r.user_type === 'stakeholder').length,
            customer: responses.filter(r => r.user_type === 'customer').length
        },
        sentiment: { positive: 0, neutral: 0, negative: 0 }
    };

    // Calculate sentiment across all responses
    responses.forEach(response => {
        (response.responses || []).forEach(r => {
            const sentiment = getSentiment(r.answer);
            stats.sentiment[sentiment]++;
        });
    });

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Mountain Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')`,
                }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/85 to-slate-900/95" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-indigo-900/20" />

            {/* Content */}
            <div className="relative z-10 min-h-screen">
                {/* Header */}
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Link to={createPageUrl('Home')}>
                                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            </Link>
                            <motion.h1 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl font-bold text-white"
                            >
                                Survey Analytics
                            </motion.h1>
                        </div>
                        <Button 
                            onClick={() => refetch()}
                            variant="outline"
                            className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    title="Total Responses"
                                    value={stats.total}
                                    subtitle="All time"
                                    icon={FileText}
                                    color="cyan"
                                    delay={0}
                                />
                                <StatCard
                                    title="Completed Surveys"
                                    value={stats.completed}
                                    subtitle={`${completionRate}% completion rate`}
                                    icon={CheckCircle}
                                    color="emerald"
                                    delay={0.1}
                                />
                                <StatCard
                                    title="Unique Users"
                                    value={stats.total}
                                    subtitle="Across all types"
                                    icon={Users}
                                    color="violet"
                                    delay={0.2}
                                />
                                <StatCard
                                    title="Positive Sentiment"
                                    value={`${stats.sentiment.positive + stats.sentiment.neutral + stats.sentiment.negative > 0 
                                        ? Math.round((stats.sentiment.positive / (stats.sentiment.positive + stats.sentiment.neutral + stats.sentiment.negative)) * 100) 
                                        : 0}%`}
                                    subtitle="Of all responses"
                                    icon={TrendingUp}
                                    color="amber"
                                    delay={0.3}
                                />
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <SentimentChart data={stats.sentiment} />
                                <UserTypeChart data={stats.userTypes} />
                            </div>

                            {/* Insights and Table */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1">
                                    <InsightsPanel responses={responses} />
                                </div>
                                <div className="lg:col-span-2">
                                    <ResponsesTable responses={responses} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}