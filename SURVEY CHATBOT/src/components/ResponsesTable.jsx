import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSentiment } from '@/components/survey/SurveyQuestions';

export default function ResponsesTable({ responses }) {
    const userTypeColors = {
        employee: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
        stakeholder: "bg-violet-500/20 text-violet-300 border-violet-400/30",
        customer: "bg-amber-500/20 text-amber-300 border-amber-400/30"
    };

    const sentimentColors = {
        positive: "bg-green-500/20 text-green-300",
        neutral: "bg-yellow-500/20 text-yellow-300",
        negative: "bg-red-500/20 text-red-300"
    };

    const getOverallSentiment = (responseList) => {
        let positive = 0, negative = 0, neutral = 0;
        responseList.forEach(r => {
            const s = getSentiment(r.answer);
            if (s === 'positive') positive++;
            else if (s === 'negative') negative++;
            else neutral++;
        });
        if (positive > negative && positive > neutral) return 'positive';
        if (negative > positive && negative > neutral) return 'negative';
        return 'neutral';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
        >
            <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white">Recent Responses</h3>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-white/60">Date</TableHead>
                            <TableHead className="text-white/60">User Type</TableHead>
                            <TableHead className="text-white/60">Questions</TableHead>
                            <TableHead className="text-white/60">Sentiment</TableHead>
                            <TableHead className="text-white/60">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {responses.slice(0, 10).map((response, index) => (
                            <TableRow 
                                key={response.id} 
                                className="border-white/10 hover:bg-white/5"
                            >
                                <TableCell className="text-white/80">
                                    {response.created_date ? format(new Date(response.created_date), 'MMM d, yyyy HH:mm') : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge className={userTypeColors[response.user_type]}>
                                        {response.user_type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-white/80">
                                    {response.responses?.length || 0} answered
                                </TableCell>
                                <TableCell>
                                    <Badge className={sentimentColors[getOverallSentiment(response.responses || [])]}>
                                        {getOverallSentiment(response.responses || [])}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={response.completed ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                                        {response.completed ? 'Completed' : 'Incomplete'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}