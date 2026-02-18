import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserTypeChart({ data }) {
    const chartData = [
        { name: 'Employees', count: data.employee, fill: '#10b981' },
        { name: 'Stakeholders', count: data.stakeholder, fill: '#8b5cf6' },
        { name: 'Customers', count: data.customer, fill: '#f59e0b' }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-white/70">{payload[0].value} responses</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
        >
            <h3 className="text-xl font-semibold text-white mb-6">Responses by User Type</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <YAxis 
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="count" 
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}