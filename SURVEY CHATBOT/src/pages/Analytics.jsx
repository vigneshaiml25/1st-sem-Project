import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import InsightsCard from '../components/analytics/InsightsCard';
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import ResponseTable from '../components/analytics/ResponseTable';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import ScatterPlotCard from '../components/analytics/ScatterPlotCard';

export default function Analytics() {
  const [filters, setFilters] = useState({
    userType: 'all',
    startDate: '',
    endDate: ''
  });

  const { data: allResponses = [], isLoading, refetch } = useQuery({
    queryKey: ['surveyResponses'],
    queryFn: () => base44.entities.SurveyResponse.list('-created_date', 100),
    initialData: []
  });

  // Apply filters
  const responses = allResponses.filter(response => {
    const matchesUserType = filters.userType === 'all' || response.user_type === filters.userType;
    
    const responseDate = new Date(response.created_date);
    const matchesStartDate = !filters.startDate || responseDate >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || responseDate <= new Date(filters.endDate + 'T23:59:59');
    
    return matchesUserType && matchesStartDate && matchesEndDate;
  });

  const handleClearFilters = () => {
    setFilters({
      userType: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const userTypeData = [
    { name: 'Employees', value: responses.filter(r => r.user_type === 'employee').length },
    { name: 'Stakeholders', value: responses.filter(r => r.user_type === 'stakeholder').length },
    { name: 'Customers', value: responses.filter(r => r.user_type === 'customer').length }
  ];

  const completionData = [
    { name: 'Completed', value: responses.filter(r => r.completed).length },
    { name: 'In Progress', value: responses.filter(r => !r.completed).length }
  ];

  const timeData = responses
    .filter(r => r.completion_time)
    .reduce((acc, r) => {
      const minutes = Math.floor(r.completion_time / 60);
      const bucket = minutes < 5 ? '0-5 min' : minutes < 10 ? '5-10 min' : '10+ min';
      const existing = acc.find(item => item.name === bucket);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ name: bucket, count: 1 });
      }
      return acc;
    }, []);

  const pieColors = ['#3b82f6', '#8b5cf6', '#10b981'];
  const completionColors = ['#10b981', '#f59e0b'];

  // Scatter plot data - extract quality and recommendation ratings for customers
  const scatterData = responses
    .filter(r => r.user_type === 'customer' && r.responses)
    .map(r => {
      const responses = r.responses;
      // Extract numeric ratings from responses
      let quality = null;
      let recommendation = null;
      
      Object.entries(responses).forEach(([key, value]) => {
        const numMatch = String(value).match(/\b(\d+)\b/);
        if (numMatch) {
          const num = parseInt(numMatch[0]);
          if (num >= 1 && num <= 10) {
            // First rating-like answer is quality, next is recommendation
            if (key.includes('q1') || key.includes('q3') || value.toLowerCase().includes('satisf')) {
              quality = num;
            }
            if (key.includes('q7') || value.toLowerCase().includes('recommend')) {
              recommendation = num;
            }
          }
        }
      });
      
      return { quality, recommendation };
    })
    .filter(item => item.quality !== null && item.recommendation !== null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Subtle Mountain Background */}
      <div 
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative z-10 min-h-screen px-6 py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" className="mb-4 -ml-2 text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-5xl font-bold text-slate-900 mb-2">
                Survey Analytics
              </h1>
              <p className="text-lg text-slate-600">
                Comprehensive insights from all survey responses
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="rounded-full px-6 py-6 shadow-md hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </Button>
              <Button
                className="rounded-full px-6 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
              >
              {/* Filters */}
              <AnalyticsFilters 
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
              />

              {/* Insights Cards */}
              <InsightsCard responses={responses} />

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PieChartCard
                  title="Responses by User Type"
                  data={userTypeData}
                  colors={pieColors}
                />
                <PieChartCard
                  title="Completion Status"
                  data={completionData}
                  colors={completionColors}
                />
              </div>

              {/* Bar Chart */}
              <BarChartCard
                title="Completion Time Distribution"
                data={timeData}
                dataKey="count"
                color="#3b82f6"
              />

              {/* Scatter Plot - Customer Quality vs Recommendation */}
              {scatterData.length > 0 && (
                <ScatterPlotCard
                  title="Customer Quality Rating vs Recommendation Likelihood"
                  data={scatterData}
                />
              )}

              {/* Response Table */}
              <ResponseTable responses={responses} />

              {/* AI Insights Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Key Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h4 className="font-semibold text-slate-900 mb-2">Most Engaged Group</h4>
                    <p className="text-slate-600">
                      {userTypeData.reduce((max, item) => item.value > max.value ? item : max, userTypeData[0]).name} 
                      {' '}lead with the highest participation rate
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h4 className="font-semibold text-slate-900 mb-2">Average Engagement</h4>
                    <p className="text-slate-600">
                      Users spend an average of {Math.floor((responses.reduce((sum, r) => sum + (r.completion_time || 0), 0) / responses.length) / 60)} minutes completing surveys
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h4 className="font-semibold text-slate-900 mb-2">Response Quality</h4>
                    <p className="text-slate-600">
                      {Math.round((responses.filter(r => r.completed).length / responses.length) * 100)}% completion rate indicates strong engagement
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h4 className="font-semibold text-slate-900 mb-2">Growth Trend</h4>
                    <p className="text-slate-600">
                      Collected {responses.length} total responses across all user segments
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}