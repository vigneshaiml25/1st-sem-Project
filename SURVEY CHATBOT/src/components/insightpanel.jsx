import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function InsightsPanel({ responses }) {
    const generateInsights = () => {
        const insights = [];
        const totalResponses = responses.length;
        
        if (totalResponses === 0) {
            return [{
                type: 'info',
                icon: AlertCircle,
                title: 'No Data Yet',
                description: 'Start collecting survey responses to see insights here.'
            }];
        }

        // Count by user type
        const userTypeCounts = {
            employee: responses.filter(r => r.user_type === 'employee').length,
            stakeholder: responses.filter(r => r.user_type === 'stakeholder').length,
            customer: responses.filter(r => r.user_type === 'customer').length
        };

        // Most active user type
        const mostActive = Object.entries(userTypeCounts).sort((a, b) => b[1] - a[1])[0];
        if (mostActive[1] > 0) {
            insights.push({
                type: 'positive',
                icon: TrendingUp,
                title: 'Most Active Group',
                description: `${mostActive[0].charAt(0).toUpperCase() + mostActive[0].slice(1)}s are the most engaged with ${mostActive[1]} responses (${Math.round(mostActive[1] / totalResponses * 100)}%).`
            });
        }

        // Completion rate
        const completedCount = responses.filter(r => r.completed).length;
        const completionRate = Math.round(completedCount / totalResponses * 100);
        insights.push({
            type: completionRate >= 80 ? 'positive' : completionRate >= 50 ? 'neutral' : 'negative',
            icon: completionRate >= 50 ? TrendingUp : TrendingDown,
            title: 'Completion Rate',
            description: `${completionRate}% of surveys are fully completed. ${completionRate < 80 ? 'Consider shortening the survey or adding incentives.' : 'Great engagement!'}`
        });

        // Average responses per survey
        const avgResponses = responses.reduce((sum, r) => sum + (r.responses?.length || 0), 0) / totalResponses;
        insights.push({
            type: 'info',
            icon: Lightbulb,
            title: 'Engagement Depth',
            description: `On average, respondents answer ${avgResponses.toFixed(1)} questions per survey.`
        });

        // Low engagement warning
        const leastActive = Object.entries(userTypeCounts).sort((a, b) => a[1] - b[1])[0];
        if (leastActive[1] === 0) {
            insights.push({
                type: 'warning',
                icon: AlertCircle,
                title: 'Engagement Gap',
                description: `No responses from ${leastActive[0]}s yet. Consider targeted outreach to this group.`
            });
        }

        return insights;
    };

    const insights = generateInsights();

    const typeStyles = {
        positive: 'border-emerald-400/30 bg-emerald-500/10',
        negative: 'border-red-400/30 bg-red-500/10',
        neutral: 'border-amber-400/30 bg-amber-500/10',
        info: 'border-cyan-400/30 bg-cyan-500/10',
        warning: 'border-orange-400/30 bg-orange-500/10'
    };

    const iconStyles = {
        positive: 'text-emerald-400',
        negative: 'text-red-400',
        neutral: 'text-amber-400',
        info: 'text-cyan-400',
        warning: 'text-orange-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
        >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                Key Insights
            </h3>
            <div className="space-y-4">
                {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className={`p-4 rounded-xl border ${typeStyles[insight.type]}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg bg-white/10 ${iconStyles[insight.type]}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{insight.title}</h4>
                                    <p className="text-white/60 text-sm mt-1">{insight.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}